'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/supabase';

interface Character {
  id: string;
  name: string;
  occupation: string;
  attributes?: {
    intelligence: number;
    reflexes: number;
    tech: number;
    cool: number;
    luck: number;
    movement: number;
    body: number;
    empathy: number;
  };
  cybernetics?: Array<{
    name: string;
    type: string;
    version: string;
  }>;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCharacters() {
      setLoading(true);
      try {
        // 获取角色数据
        const result = await fetchData<Character>('characters');
        
        if (result.error) {
          throw result.error;
        }
        
        setCharacters(result.data || []);
      } catch (err) {
        console.error('获取角色数据失败:', err);
        setError(err instanceof Error ? err : new Error('获取数据时发生未知错误'));
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error.message}</div>;
  }

  if (characters.length === 0) {
    return <div>没有找到角色数据</div>;
  }

  return (
    <div>
      <h2>角色列表</h2>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <h3>{character.name}</h3>
            <p>职业: {character.occupation}</p>
            
            {character.cybernetics && character.cybernetics.length > 0 && (
              <div>
                <h4>植入物:</h4>
                <ul>
                  {character.cybernetics.map((cyber, index) => (
                    <li key={index}>
                      {cyber.name} - {cyber.type} ({cyber.version})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 