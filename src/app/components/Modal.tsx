"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import CharacterDetail from './CharacterDetail';
import { Character } from '@/type/character';

interface SearchResult {
  query: string;
  message: string[];
  results: Character[];
  recommendations: Record<string, string>;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SearchResult;
}

export default function Modal({ isOpen, onClose, data }: ModalProps) {
  const [displayedTexts, setDisplayedTexts] = useState<{ left: string; right: string }[]>([]);
  const [boxHeights, setBoxHeights] = useState<number[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayedTexts([]);
      const texts = data.results.map(character => {
        const leftText = `Name: ${character.name}
Occupation: ${character.occupation}
Skills:
${Object.entries(character.skills)
  .map(([skill, level]) => `- ${skill}: ${level}`)
  .join('\n')}`;

        const rightText = `Recommendation:
${data.recommendations[character.name] || 'No recommendation available'}`;

        return {
          left: leftText,
          right: rightText
        };
      });

      // 计算每个文本框的高度
      const heights = texts.map(text => {
        const leftLines = text.left.split('\n').length;
        const rightLines = text.right.split('\n').length;
        return Math.max(leftLines, rightLines) * 1.5; // 每行1.5em的高度
      });
      setBoxHeights(heights);

      let currentIndex = 0;
      const maxLength = Math.max(
        ...texts.map(text => Math.max(text.left.length, text.right.length))
      );
      
      const interval = setInterval(() => {
        setDisplayedTexts(prev => {
          const newTexts = texts.map(text => ({
            left: text.left.slice(0, currentIndex + 1),
            right: text.right.slice(0, currentIndex + 1)
          }));
          return newTexts;
        });

        currentIndex++;
        if (currentIndex >= maxLength) {
          clearInterval(interval);
        }
      }, 30);
    }
  }, [isOpen, data.results, data.recommendations]);

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
    <>
      <div className={styles.modalOverlay}>
        <div ref={modalRef} className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Search Results</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          <div className={styles.searchInfo}>
            <h3>Search Information</h3>
            <p><strong>Query:</strong> {data.query}</p>
            {data.message.map((msg, index) => (
              <p key={index} className={index === 0 ? styles.reasoning : ''}>
                {index === 0 ? <strong>Reasoning:</strong> : ''} {msg}
              </p>
            ))}
          </div>
          <div className={styles.resultsContainer}>
            {data.results.map((character, index) => (
              <div 
                key={character.id} 
                className={styles.characterCard}
                onClick={() => handleCharacterClick(character)}
                style={{ height: `${boxHeights[index]}em` }}
              >
                <div className={styles.characterContent}>
                  <pre className={styles.characterText}>
                    {displayedTexts[index]?.left || ''}
                    <span className={styles.cursor}>_</span>
                  </pre>
                  <div className={styles.recommendationBox}>
                    <pre className={styles.characterText}>
                      {displayedTexts[index]?.right || ''}
                      <span className={styles.cursor}>_</span>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedCharacter && (
        <div className={styles.detailOverlay}>
          <div ref={detailRef} className={styles.detailContent}>
            <div className={styles.modalHeader}>
              <h2>Character Details</h2>
              <button className={styles.closeButton} onClick={() => setSelectedCharacter(null)}>×</button>
            </div>

            <div className={styles.detailSection}>
              <h3>Basic Information</h3>
              <p><strong>Name:</strong> {selectedCharacter.name}</p>
              <p><strong>Occupation:</strong> {selectedCharacter.occupation}</p>
              <p><strong>Phone:</strong> {selectedCharacter.phone}</p>
              <p><strong>Address:</strong> {selectedCharacter.address}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Mission Recommendation</h3>
              <p>{data.recommendations[selectedCharacter.name] || 'No recommendation available'}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Background</h3>
              <p><strong>Education:</strong> {selectedCharacter.education.join(', ')}</p>
              <p><strong>Experience:</strong> {selectedCharacter.experience.join(', ')}</p>
              <p><strong>Gang Affiliations:</strong> {selectedCharacter.gang_affiliations.join(', ')}</p>
            </div>

            <div className={styles.detailSection}>
              <h3>Cybernetics</h3>
              <div className={styles.cyberneticsList}>
                {selectedCharacter.cybernetics.map((cyber, index) => (
                  <div key={index} className={styles.cyberneticItem}>
                    {cyber.name} - {cyber.type} (v{cyber.version})
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Skills</h3>
              <div className={styles.skillsGrid}>
                {Object.entries(selectedCharacter.skills).map(([skill, level]) => (
                  <div key={skill} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill}:</span>
                    <span className={styles.skillValue}>{level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Attributes</h3>
              <div className={styles.skillsGrid}>
                {Object.entries(selectedCharacter.attributes).map(([attr, value]) => (
                  <div key={attr} className={styles.skillItem}>
                    <span className={styles.skillName}>{attr}:</span>
                    <span className={styles.skillValue}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 