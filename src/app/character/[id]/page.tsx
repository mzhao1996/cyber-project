"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterDetail from '@/app/components/CharacterDetail';
import { Character } from '@/type/character';
import styles from './page.module.css';

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
      <div className={styles.loadingContainer}>
        Loading...
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return <CharacterDetail character={character} />;
} 