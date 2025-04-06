"use client";

import React from 'react';
import { Character } from '@/type/character';
import styles from './CharacterDetail.module.css';

interface CharacterDetailProps {
  character: Character;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  console.log("check character ===============>",character);
  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftSection}>
        <div className={styles.basicInfo}>
          <h2>{character.name}</h2>
          <p className={styles.occupation}>{character.occupation}</p>
          <div className={styles.contactInfo}>
            <p><span>Phone:</span> {character.phone}</p>
            <p><span>Address:</span> {character.address}</p>
          </div>
        </div>
        <div className={styles.bioSection}>
          <h3>Bio</h3>
          <p>{character.bio}</p>
        </div>
        <div className={styles.educationSection}>
          <h3>Education</h3>
          <p>{character.education}</p>
        </div>
        <div className={styles.gangSection}>
          <h3>Gang Affiliations</h3>
          <p>{character.gang_affiliations}</p>
        </div>
        <div className={styles.experienceSection}>
          <h3>Experience</h3>
          <p>{character.experience}</p>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.attributesSection}>
          <h3>Attributes</h3>
          <div className={styles.attributesGrid}>
            {Object.entries(character.attributes).map(([key, value]) => (
              <div key={key} className={styles.attributeItem}>
                <span className={styles.attributeLabel}>{key}</span>
                <span className={styles.attributeValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.skillsSection}>
          <h3>Skills</h3>
          <div className={styles.skillsGrid}>
            {Object.entries(character.skills).map(([key, value]) => (
              <div key={key} className={styles.skillItem}>
                <span className={styles.skillLabel}>{key}</span>
                <span className={styles.skillValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.cyberneticsSection}>
          <h3>Cybernetics</h3>
          <div className={styles.cyberneticsList}>
            {character.cybernetics.map((cyber, index) => (
              <div key={index} className={styles.cyberneticsItem}>
                <p>
                  <span className={styles.cyberneticsName}>{cyber.name}</span>
                  <span className={styles.cyberneticsType}>({cyber.type} - {cyber.version})</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.statsSection}>
          <h3>Stats</h3>
          <div className={styles.statsGrid}>
            {Object.entries(character.stats).map(([key, value]) => (
              <div key={key} className={styles.statItem}>
                <p>
                  <span className={styles.statLabel}>{key.replace('_', ' ').toUpperCase()}</span>
                  <span className={styles.statValue}>{value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 