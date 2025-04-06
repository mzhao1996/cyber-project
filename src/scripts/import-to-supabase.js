// 该脚本用于将Character.json数据导入到Supabase
// 使用方法: node src/scripts/import-to-supabase.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 缺少Supabase配置。请确保.env.local文件中包含NEXT_PUBLIC_SUPABASE_URL和NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    console.log('开始导入角色数据到Supabase...');
    
    // 读取本地JSON文件
    const filePath = path.join(process.cwd(), 'src', 'data', 'Character.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const characters = JSON.parse(fileContent);
    
    console.log(`读取了 ${characters.length} 个角色数据`);
    
    // 检查characters表是否存在，如果不存在则创建
    const { error: checkError } = await supabase
      .from('characters')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('未找到characters表，请先在Supabase中创建该表');
      console.log('请创建如下字段：');
      console.log('- id: uuid (主键)');
      console.log('- name: text');
      console.log('- occupation: text');
      console.log('- phone: text');
      console.log('- address: text');
      console.log('- bio: text');
      console.log('- education: text[]');
      console.log('- gangAffiliations: text[]');
      console.log('- experience: text[]');
      console.log('- attributes: jsonb');
      console.log('- skills: jsonb');
      console.log('- cybernetics: jsonb');
      console.log('- stats: jsonb');
      process.exit(1);
    }
    
    // 清空现有数据（可选）
    console.log('清空现有数据...');
    const { error: deleteError } = await supabase
      .from('characters')
      .delete()
      .neq('id', '0'); // 删除所有记录
      
    if (deleteError) {
      console.error('清空数据时出错:', deleteError);
      process.exit(1);
    }
    
    // 分批导入数据，避免一次性导入太多
    const batchSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize);
      
      // 处理legal_immunity字段，将"yes"/"no"转换为true/false
      batch.forEach(character => {
        if (typeof character.stats.legal_immunity === 'string') {
          character.stats.legal_immunity = character.stats.legal_immunity.toLowerCase() === 'yes';
        }
      });
      
      const { error: insertError } = await supabase
        .from('characters')
        .insert(batch);
        
      if (insertError) {
        console.error(`导入第 ${i+1} 到 ${i+batch.length} 条数据时出错:`, insertError);
      } else {
        successCount += batch.length;
        console.log(`成功导入 ${i+1} 到 ${i+batch.length} 条数据`);
      }
    }
    
    console.log(`导入完成! 成功导入 ${successCount}/${characters.length} 条记录`);
  } catch (error) {
    console.error('导入过程中发生错误:', error);
    process.exit(1);
  }
}

importData(); 