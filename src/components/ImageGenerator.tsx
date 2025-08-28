"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useImageHistory } from '@/hooks/useLocalStorage';
import { ImageDisplay } from './ImageDisplay';
import { GenerationHistory } from './GenerationHistory';
import { LoadingState } from './LoadingState';

const PROMPT_SUGGESTIONS = [
  "A serene mountain landscape at golden hour with misty valleys",
  "Futuristic cyberpunk cityscape with neon lights and flying cars", 
  "Abstract digital art with flowing geometric patterns in vibrant colors",
  "A cozy coffee shop interior with warm lighting and vintage furniture",
  "Minimalist architectural design of a modern glass building",
  "Watercolor painting of a blooming cherry blossom tree in spring",
  "Space exploration scene with astronauts on an alien planet",
  "Vintage steam locomotive crossing a stone bridge over a river"
];

const DEFAULT_SYSTEM_PROMPT = `You are an expert AI image generator. Create high-quality, detailed images based on user prompts. Focus on artistic composition, proper lighting, and visual appeal. Generate photorealistic or artistic images as requested.`;

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { 
    isGenerating, 
    currentImage, 
    error, 
    generationTime,
    generateImage,
    clearError 
  } = useImageGeneration();

  const { history, addImage, clearHistory } = useImageHistory();

  const handleGenerate = () => {
    generateImage({
      prompt,
      systemPrompt,
      onSuccess: (imageUrl, data) => {
        addImage({
          imageUrl,
          prompt: data.prompt,
          timestamp: data.timestamp,
          model: data.model,
        });
      },
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const downloadImage = async (url: string, filename: string = 'ai-generated-image.jpg') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Generation Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generate Image</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                >
                  {showSystemPrompt ? 'Hide' : 'Show'} System Prompt
                </Button>
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    History ({history.length})
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* System Prompt Section */}
            {showSystemPrompt && (
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt (Customizable)</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  placeholder="Customize how the AI should generate images..."
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  This prompt defines how the AI model should approach image generation.
                </p>
                <Separator />
              </div>
            )}

            {/* Main Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">
                Image Prompt 
                <span className="text-muted-foreground ml-2">
                  ({prompt.length}/500)
                </span>
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                placeholder="Describe the image you want to generate in detail..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Prompt Suggestions */}
            <div className="space-y-2">
              <Label>Quick Prompts</Label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-auto py-2 px-3 text-left"
                  >
                    {suggestion.length > 50 ? `${suggestion.slice(0, 50)}...` : suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="mt-2 text-destructive hover:text-destructive"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </Button>

            {generationTime > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                <Badge variant="secondary">
                  Generated in {(generationTime / 1000).toFixed(1)}s
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && <LoadingState />}

        {/* Generated Image Display */}
        {currentImage && (
          <ImageDisplay
            imageUrl={currentImage}
            prompt={prompt}
            onDownload={() => downloadImage(currentImage, `ai-image-${Date.now()}.jpg`)}
          />
        )}
      </div>

      {/* History Sidebar */}
      <div className="space-y-6">
        <GenerationHistory
          history={history}
          onImageClick={(imageUrl, prompt) => {
            // Could implement image preview modal here
            console.log('Image clicked:', { imageUrl, prompt });
          }}
          onDownload={downloadImage}
          onClearHistory={clearHistory}
          visible={showHistory || history.length === 0}
        />
      </div>
    </div>
  );
}