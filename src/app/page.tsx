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
  recommendations: Record<string, string>;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [queryType, setQueryType] = useState('mission');
  const loadingMessage = "Backdoor Intrusion in Progress...";
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
    setSearchResults(null);
    setIsModalOpen(false);
    
    try {
      // First convert natural language to query conditions
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: searchQuery,
          queryType: queryType
        }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.error || 'API request failed';
        const errorDetails = responseData.details ? `: ${responseData.details}` : '';
        const rawResponse = responseData.rawResponse ? `\nRaw response: ${responseData.rawResponse}` : '';
        throw new Error(`${errorMessage}${errorDetails}${rawResponse}`);
      }

      const { queryConditions, testData, testError, reasoning, recommendations } = responseData;
      
      if (testError) {
        throw new Error(testError);
      }

      if (!queryConditions || !queryConditions.column || !queryConditions.operator || !queryConditions.value) {
        throw new Error('Invalid query conditions received from API');
      }

      setSearchResults({
        query: searchQuery,
        message: [
          reasoning || 'No reasoning provided',
          `Search completed successfully. Found ${testData.length} results.`
        ],
        results: testData || [],
        recommendations: recommendations || {}
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        query: searchQuery,
        message: [`Error: ${error instanceof Error ? error.message : 'An error occurred during search'}`],
        results: [],
        recommendations: {}
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
    <div className={`${styles.page} ${styles.squareCorners}`}>
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
          <div className={styles.queryTypeContainer}>
            <select 
              className={styles.queryTypeSelect}
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
            >
              <option value="mission">Mission Query</option>
              <option value="sql">Database Query</option>
            </select>
            <div className={styles.selectArrow}>▼</div>
          </div>
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
            {isSearching ? 'Searching...' : 'Search'}
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
