import { NextResponse } from 'next/server';
import { Character } from '@/type/character';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    // Import character data
    const characterData: Character[] = require('@/data/Character.json');

    // Simple keyword mapping
    const keywordMap = {
      'smart': 'intelligence',
      'reaction': 'reaction',
      'tech': 'technology',
      'physical': 'physical',
      'hacker': 'Hacker',
      'samurai': 'Samurai',
      'ninja': 'Ninja',
      'technician': 'Technician',
      'nurse': 'Nurse',
      'undercover': 'Undercover'
    };

    // Parse query statement
    let searchParams = {
      attributes: {} as Record<string, number>,
      occupation: [] as string[],
      minBounty: 0
    };

    // Process natural language query
    Object.entries(keywordMap).forEach(([key, value]) => {
      if (query.includes(key)) {
        if (['Hacker', 'Samurai', 'Ninja', 'Technician', 'Nurse', 'Undercover'].includes(value)) {
          searchParams.occupation.push(value);
        } else {
          searchParams.attributes[value] = 70; // Set minimum threshold
        }
      }
    });

    // Search characters
    const results = characterData.filter((char: Character) => {
      let match = true;
      
      // Check occupation
      if (searchParams.occupation.length > 0) {
        match = match && searchParams.occupation.includes(char.occupation);
      }
      
      // Check attributes
      Object.entries(searchParams.attributes).forEach(([attr, threshold]) => {
        match = match && char.attributes[attr as keyof typeof char.attributes] >= threshold;
      });
      
      return match;
    });
    
    return NextResponse.json({ 
      message: [
        'connection: safe',
        'cyber_neural_pathway: safe',
        'scranton_reality_anchors: not in dream',
      ],
      query: query,
      results: results
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 