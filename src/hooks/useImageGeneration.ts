"use client";

import { useState } from 'react';
import { toast } from 'sonner';

interface GenerationState {
  isGenerating: boolean;
  currentImage: string | null;
  error: string | null;
  generationTime: number;
}

interface GenerateImageParams {
  prompt: string;
  systemPrompt?: string;
  onSuccess?: (imageUrl: string, data: any) => void;
  onError?: (error: string) => void;
}

export function useImageGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentImage: null,
    error: null,
    generationTime: 0,
  });

  const generateImage = async ({ 
    prompt, 
    systemPrompt, 
    onSuccess, 
    onError 
  }: GenerateImageParams) => {
    if (!prompt.trim()) {
      const error = 'Please enter a prompt to generate an image';
      setState(prev => ({ ...prev, error }));
      onError?.(error);
      toast.error(error);
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
      generationTime: 0,
    }));

    const startTime = Date.now();

    try {
      toast.info('Starting image generation...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          systemPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const generationTime = Date.now() - startTime;

      setState(prev => ({
        ...prev,
        isGenerating: false,
        currentImage: data.imageUrl,
        generationTime,
      }));

      onSuccess?.(data.imageUrl, data);
      toast.success(`Image generated successfully in ${(generationTime / 1000).toFixed(1)}s`);

    } catch (error: any) {
      const generationTime = Date.now() - startTime;
      const errorMessage = error.message || 'Failed to generate image';
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        generationTime,
      }));

      onError?.(errorMessage);
      toast.error(`Generation failed: ${errorMessage}`);
      console.error('Image generation error:', error);
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const clearCurrentImage = () => {
    setState(prev => ({ ...prev, currentImage: null }));
  };

  return {
    ...state,
    generateImage,
    clearError,
    clearCurrentImage,
  };
}