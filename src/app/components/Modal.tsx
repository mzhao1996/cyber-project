"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import CharacterDetail from './CharacterDetail';
import { Character } from '@/type/character';

interface SearchResult {
  message: string[];
  query: string;
  results: Character[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SearchResult;
}

export default function Modal({ isOpen, onClose, data }: ModalProps) {
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayedTexts([]);
      const texts = data.results.map(character => 
        `Name: ${character.name}
Occupation: ${character.occupation}
Skills:
${Object.entries(character.skills).map(([skill, level]) => `- ${skill}: ${level}`).join('\n')}`
      );

      let currentIndex = 0;
      const maxLength = Math.max(...texts.map(text => text.length));
      
      const interval = setInterval(() => {
        setDisplayedTexts(prev => {
          const newTexts = texts.map(text => text.slice(0, currentIndex + 1));
          return newTexts;
        });

        currentIndex++;
        if (currentIndex >= maxLength) {
          clearInterval(interval);
        }
      }, 30);
    }
  }, [isOpen, data.results]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedCharacter && detailRef.current && !detailRef.current.contains(event.target as Node)) {
        setSelectedCharacter(null);
      } else if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCharacter, onClose]);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Search Results</h2>
        </div>
        <div className={styles.searchInfo}>
          <p>Query: {data.query}</p>
          <p>Found {data.results.length} matches</p>
        </div>
        <div className={styles.resultsContainer}>
          {data.results.map((character, index) => {
            const text = `Name: ${character.name}
Occupation: ${character.occupation}
Skills:
${Object.entries(character.skills).map(([skill, level]) => `- ${skill}: ${level}`).join('\n')}`;

            return (
              <div 
                key={character.id} 
                className={styles.characterCard}
                onClick={() => handleCharacterClick(character)}
                style={{ cursor: 'pointer' }}
              >
                <pre className={styles.characterText} style={{ height: `${text.split('\n').length * 1.5}em` }}>
                  {displayedTexts[index] || ''}
                  <span className={styles.cursor}>_</span>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
      {selectedCharacter && (
        <div className={styles.detailOverlay}>
          <div ref={detailRef}>
            <CharacterDetail character={selectedCharacter} />
          </div>
        </div>
      )}
    </div>
  );
} 