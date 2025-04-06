import { NextResponse } from 'next/server';
import { fetchData } from '@/lib/supabase';

export async function GET() {
  try {
    const result = await fetchData('characters');
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('API获取角色数据失败:', error);
    return NextResponse.json(
      { error: '获取角色数据时发生错误' },
      { status: 500 }
    );
  }
}

// 获取单个角色的API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少角色ID' },
        { status: 400 }
      );
    }
    
    const { data, error } = await fetchData('characters', '*', {
      filters: [{ column: 'id', operator: 'eq', value: id }]
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '找不到指定ID的角色' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error('API获取单个角色数据失败:', error);
    return NextResponse.json(
      { error: '获取角色数据时发生错误' },
      { status: 500 }
    );
  }
} 