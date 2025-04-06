import { createClient } from '@supabase/supabase-js';

// 这些环境变量需要在.env.local文件中设置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 通用获取数据方法
export async function fetchData<T>(
  table: string,
  columns: string = '*',
  queryOptions?: {
    filters?: { column: string; operator: string; value: any }[];
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  }
) {
  try {
    let query = supabase.from(table).select(columns);

    // 应用过滤器
    if (queryOptions?.filters) {
      queryOptions.filters.forEach((filter) => {
        query = query.filter(
          filter.column,
          filter.operator as any,
          filter.value
        );
      });
    }

    // 应用排序
    if (queryOptions?.orderBy) {
      query = query.order(
        queryOptions.orderBy.column,
        { ascending: queryOptions.orderBy.ascending }
      );
    }

    // 应用限制
    if (queryOptions?.limit) {
      query = query.limit(queryOptions.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data as T[], error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: null, error: error as Error };
  }
}

// 单条数据获取方法
export async function fetchRecordById<T>(
  table: string,
  id: string,
  columns: string = '*'
) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as T, error: null };
  } catch (error) {
    console.error('Error fetching record:', error);
    return { data: null, error: error as Error };
  }
}

// 创建数据方法
export async function insertRecord<T>(table: string, record: Partial<T>) {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error inserting record:', error);
    return { data: null, error: error as Error };
  }
}

// 更新数据方法
export async function updateRecord<T>(
  table: string,
  id: string,
  updates: Partial<T>
) {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating record:', error);
    return { data: null, error: error as Error };
  }
}

// 删除数据方法
export async function deleteRecord(table: string, id: string) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting record:', error);
    return { error: error as Error };
  }
} 