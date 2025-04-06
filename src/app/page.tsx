'use client';

import { useState, useEffect, useRef } from 'react';
import styles from "./page.module.css";
import Modal from './components/Modal';
import { Character } from '@/type/character';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  message: string[];
  query: string;
  results: Character[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const loadingMessage = "Obtaining search permission...";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Typewriter effect
    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingMessage.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex >= loadingMessage.length) {
        clearInterval(interval);
        // Hide loading screen and focus input after 3 seconds
        setTimeout(() => {
          setIsLoading(false);
          inputRef.current?.focus();
        }, 3000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .ilike('name', `%${searchQuery}%`);
      
      if (error) throw error;
      
      setSearchResults({
        query: searchQuery,
        message: ['Search completed successfully'],
        results: data || []
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        query: searchQuery,
        message: ['An error occurred during search, please try again later'],
        results: []
      });
      setIsModalOpen(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.page}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>
            {loadingText}
            <span className={styles.cursor}>_</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      )}
      <div className={styles.main}>
        <div className={styles.searchContainer}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="lets plug in and scrape the data" 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
          />
          <button 
            className={styles.searchButton} 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'injection'}
          </button>
        </div>
      </div>
      {searchResults && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={searchResults}
        />
      )}
    </div>
  );
}
