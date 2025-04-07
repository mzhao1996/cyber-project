import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 检查 OpenAI API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API Key is not set');
      return NextResponse.json(
        { error: 'OpenAI API Key is not configured' },
        { status: 500 }
      );
    }

    const { query, queryType = 'mission' } = await request.json();
    console.log('Received request:', { query, queryType });

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // 获取表结构信息
    const { data: tableInfo, error: tableError } = await supabase
      .from('characters')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Supabase table error:', tableError);
      return NextResponse.json(
        { error: 'Failed to fetch table structure' },
        { status: 500 }
      );
    }

    if (!tableInfo || tableInfo.length === 0) {
      console.error('No data found in characters table');
      return NextResponse.json(
        { error: 'No data found in characters table' },
        { status: 404 }
      );
    }

    const tableStructure = Object.keys(tableInfo[0]).map(key => {
      const value = tableInfo[0][key];
      const type = Array.isArray(value) ? 'array' : 
                  typeof value === 'object' ? 'json' : 
                  typeof value;
      return `${key} (${type})`;
    }).join(', ');

    console.log('Table structure:', tableStructure);

    let prompt = '';
    let systemMessage = '';

    if (queryType === 'mission') {
      prompt = `You are a mission planner for a cyberpunk team. Convert the following mission request into Supabase query conditions to find suitable team members.
      
      Available character attributes:
      - Occupation: Hacker, Samurai, Netrunner, Technician, Bounty Hunter, etc.
      - Skills: hacking, combat, stealth, etc. (rated 1-9)
      - Attributes: strength, intelligence, reflexes, etc. (rated 1-9)
      - Cybernetics: various implants and enhancements
      - Stats: controllability, hijack_difficulty, bounty, legal_immunity
      
      The table has the following structure: ${tableStructure}
      
      Important notes:
      1. For JSON fields (attributes, skills, stats), use the -> operator to access nested values
      2. For array fields (education, gangAffiliations, experience, cybernetics), use array operators
      3. Use ILIKE for case-insensitive text searches
      4. You MUST return a valid JSON object with these fields:
         {
           "reasoning": "Detailed explanation of how you analyzed the mission requirements and selected the search criteria",
           "queryConditions": {
             "column": "field_name",
             "operator": "comparison_operator",
             "value": comparison_value
           }
         }
      5. Valid operators are: "eq", "gt", "gte", "lt", "lte", "neq", "like", "ilike"
      6. Consider team composition and required skills for the mission
      7. For skills queries, use the format: "skills->skill_name"
      8. For attributes queries, use the format: "attributes->attribute_name"
      
      Example response for "Find characters with high hacking skills":
      {
        "reasoning": "For a mission requiring high hacking skills, we need to look for characters with hacking skill greater than 7. This ensures we find highly skilled hackers who can handle complex security systems.",
        "queryConditions": {
          "column": "skills->hacking",
          "operator": "gt",
          "value": 7
        }
      }
      
      Mission request: ${query}`;

      systemMessage = "You are a cyberpunk mission planner. You must return ONLY a valid JSON object with column, operator, and value fields.";
    } else {
      prompt = `Convert the following natural language query into Supabase query conditions for the characters table.
      
      The table has the following structure: ${tableStructure}
      
      Important notes:
      1. For JSON fields (attributes, skills, stats), use the -> operator to access nested values
      2. For array fields (education, gangAffiliations, experience, cybernetics), use array operators
      3. Use ILIKE for case-insensitive text searches
      4. You MUST return ONLY a valid JSON object with exactly these three fields:
         {
           "column": "field_name",
           "operator": "comparison_operator",
           "value": comparison_value
         }
      5. Valid operators are: "eq", "gt", "gte", "lt", "lte", "neq", "like", "ilike"
      
      Example response for "Find characters where hacking skill is greater than 7":
      {
        "column": "skills->hacking",
        "operator": "gt",
        "value": 7
      }
      
      Query: ${query}`;

      systemMessage = "You are a SQL expert. You must return ONLY a valid JSON object with column, operator, and value fields.";
    }

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log('OpenAI response:', completion.choices[0].message.content);

    let queryConditions;
    let reasoning = '';
    try {
      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }
      
      const response = JSON.parse(content);
      console.log('Parsed OpenAI response:', response);

      reasoning = response.reasoning || '';
      queryConditions = response.queryConditions;

      // Validate the structure of query conditions
      if (!queryConditions || typeof queryConditions !== 'object') {
        throw new Error('Invalid response format: queryConditions not an object');
      }

      if (!queryConditions.column || typeof queryConditions.column !== 'string') {
        throw new Error('Invalid response format: missing or invalid column');
      }

      if (!queryConditions.operator || typeof queryConditions.operator !== 'string') {
        throw new Error('Invalid response format: missing or invalid operator');
      }

      if (queryConditions.value === undefined || queryConditions.value === null) {
        throw new Error('Invalid response format: missing value');
      }

      // Validate operator
      const validOperators = ['eq', 'gt', 'gte', 'lt', 'lte', 'neq', 'like', 'ilike'];
      if (!validOperators.includes(queryConditions.operator)) {
        throw new Error(`Invalid operator: ${queryConditions.operator}. Must be one of: ${validOperators.join(', ')}`);
      }

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to parse query conditions',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          rawResponse: completion.choices[0].message.content
        },
        { status: 500 }
      );
    }

    // 执行查询并记录结果
    console.log('Executing query with conditions:', {
      column: queryConditions.column,
      operator: queryConditions.operator,
      value: queryConditions.value
    });

    const { data: testData, error: testError } = await supabase
      .from('characters')
      .select('*')
      .filter(queryConditions.column, queryConditions.operator, queryConditions.value);

    console.log('Query execution result:', {
      conditions: queryConditions,
      resultCount: testData?.length || 0,
      error: testError,
      firstResult: testData?.[0]
    });

    // Generate recommendations for each character
    let recommendations: { [key: string]: string } = {};
    if (testData && testData.length > 0) {
      const recommendationPrompt = `For each character, explain why they are suitable for this mission based on their skills and attributes.
      
      Mission: ${query}
      Characters: ${JSON.stringify(testData.map(char => ({
        name: char.name,
        skills: char.skills,
        attributes: char.attributes,
        occupation: char.occupation
      })))}
      
      Return a JSON object where the key is the character's name and the value is the recommendation.
      The recommendation should be specific to the mission and highlight relevant skills and attributes.
      Example:
      {
        "John Doe": "Recommended for their high hacking skills (8) and intelligence (7), making them ideal for technical tasks.",
        "Jane Smith": "Recommended for their combat skills (7) and reflexes (8), perfect for frontline operations."
      }`;

      try {
        const recommendationCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a mission planner. Provide specific reasons why each character is suitable for the mission based on their skills and attributes."
            },
            {
              role: "user",
              content: recommendationPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const recommendationContent = recommendationCompletion.choices[0].message.content;
        if (!recommendationContent) {
          throw new Error('Empty recommendation response from OpenAI');
        }

        recommendations = JSON.parse(recommendationContent);
        console.log('Generated recommendations:', recommendations);

        // 确保每个角色都有推荐
        testData.forEach(character => {
          if (!recommendations[character.name]) {
            recommendations[character.name] = `Recommended for their ${character.occupation} role and skills in ${Object.entries(character.skills)
              .filter(([_, level]) => (level as number) >= 5)
              .map(([skill]) => skill)
              .join(', ')}`;
          }
        });
      } catch (error) {
        console.error('Failed to generate recommendations:', error);
        // 如果生成推荐失败，为每个角色创建基本推荐
        testData.forEach(character => {
          recommendations[character.name] = `Recommended for their ${character.occupation} role and skills in ${Object.entries(character.skills)
            .filter(([_, level]) => (level as number) >= 5)
            .map(([skill]) => skill)
            .join(', ')}`;
        });
      }
    }

    return NextResponse.json({ 
      queryConditions,
      testData: testData || [],
      testError: testError || null,
      reasoning: reasoning,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process query', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 