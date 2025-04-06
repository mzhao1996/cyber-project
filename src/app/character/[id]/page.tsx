"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterDetail from '@/app/components/CharacterDetail';

interface Character {
  id: string;
  name: string;
  occupation: string;
  phone: string;
  address: string;
  bio: string;
  education: string[];
  gangAffiliations: string[];
  experience: string[];
  attributes: {
    strength: number;
    intelligence: number;
    reflexes: number;
    tech: number;
    cool: number;
    luck: number;
    movement: number;
    body: number;
    empathy: number;
  };
  skills: {
    [key: string]: number;
  };
  cybernetics: {
    name: string;
    type: string;
    version: string;
  }[];
  stats: {
    [key: string]: number;
  };
  rating: number;
  controllability: number;
  hijack_difficulty: number;
  bounty: number;
  legal_immunity: boolean;
}

export default function CharacterPage({ params }: { params: { id: string } }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/character/${params.id}`);
        if (!response.ok) {
          throw new Error('Character not found');
        }
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCharacter();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '1.2rem',
        fontWeight: 500
      }}>
        Loading...
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return <CharacterDetail character={character} />;
} 