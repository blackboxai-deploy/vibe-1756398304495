"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageDisplayProps {
  imageUrl: string;
  prompt: string;
  onDownload: () => void;
}

export function ImageDisplay({ imageUrl, prompt, onDownload }: ImageDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Image</span>
          <Button onClick={onDownload} size="sm">
            Download
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Container */}
        <div className="overflow-hidden rounded-lg border bg-muted">
          <AspectRatio ratio={1}>
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/800x800?text=Image+loading+failed";
              }}
            />
          </AspectRatio>
        </div>

        {/* Prompt Display */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Prompt</Badge>
          </div>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {prompt}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={onDownload} 
            className="flex-1"
          >
            Download Image
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(imageUrl);
            }}
          >
            Copy URL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}