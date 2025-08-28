"use client";

import { useState, useEffect } from 'react';

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: string;
  model: string;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [isInitialized ? storedValue : initialValue, setValue];
}

export function useImageHistory() {
  const [history, setHistory] = useLocalStorage<GeneratedImage[]>('ai-image-history', []);

  const addImage = (image: Omit<GeneratedImage, 'id'>) => {
    const newImage: GeneratedImage = {
      ...image,
      id: crypto.randomUUID(),
    };
    setHistory([newImage, ...history.slice(0, 19)]); // Keep last 20 images
  };

  const removeImage = (id: string) => {
    setHistory(history.filter(img => img.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addImage, removeImage, clearHistory };
}