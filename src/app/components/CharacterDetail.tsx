"use client";

import React from 'react';
import { Character } from '@/type/character';
import styles from './CharacterDetail.module.css';

interface CharacterDetailProps {
  character: Character;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.header}>
          <h1>{character.name}</h1>
          <div className={styles.occupation}>{character.occupation}</div>
        </div>

        <div className={styles.contactInfo}>
          <h3 className={styles.sectionTitle}>Contact Information</h3>
          <div className={styles.phone}>Phone: {character.phone}</div>
          <div className={styles.address}>Address: {character.address}</div>
        </div>

        <div className={styles.bioSection}>
          <h3 className={styles.sectionTitle}>Biography</h3>
          <div className={styles.bio}>{character.bio}</div>
        </div>

        <div className={styles.educationSection}>
          <h3 className={styles.sectionTitle}>Education</h3>
          <ul className={styles.educationList}>
            {character.education.map((edu, index) => (
              <li key={index} className={styles.educationItem}>
                {edu}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.gangSection}>
          <h3 className={styles.sectionTitle}>Gang Affiliation</h3>
          <ul className={styles.gangList}>
            {character.gangAffiliations.map((gang, index) => (
              <li key={index} className={styles.gangItem}>
                {gang}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.experienceSection}>
          <h3 className={styles.sectionTitle}>Experience</h3>
          <ul className={styles.experienceList}>
            {character.experience.map((exp, index) => (
              <li key={index} className={styles.experienceItem}>
                {exp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.attributes}>
          <h3 className={styles.sectionTitle}>Attributes</h3>
          <div className={styles.attributeList}>
            {Object.entries(character.attributes).map(([key, value]) => (
              <div key={key} className={styles.attributeItem}>
                <span className={styles.attributeName}>{key}</span>
                <span className={styles.attributeValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.skills}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          <div className={styles.skillList}>
            {Object.entries(character.skills).map(([key, value]) => (
              <div key={key} className={styles.skillItem}>
                <span className={styles.skillName}>{key}</span>
                <span className={styles.skillValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cybernetics}>
          <h3 className={styles.sectionTitle}>Cybernetics</h3>
          <div className={styles.cyberneticsList}>
            {character.cybernetics.map((cyber, index) => (
              <div key={index} className={styles.cyberneticsItem}>
                <div className={styles.cyberneticsName}>{cyber.name}</div>
                <div className={styles.cyberneticsType}>{cyber.type}</div>
                <div className={styles.cyberneticsVersion}>Version: {cyber.version}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stats}>
          <h3 className={styles.sectionTitle}>Stats</h3>
          <div className={styles.statsList}>
            {Object.entries(character.stats).map(([key, value]) => (
              <div key={key} className={styles.statItem}>
                <span className={styles.statName}>{key}</span>
                <span className={styles.statValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail; 