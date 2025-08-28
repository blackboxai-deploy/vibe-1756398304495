"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { GeneratedImage } from '@/hooks/useLocalStorage';

interface GenerationHistoryProps {
  history: GeneratedImage[];
  onImageClick: (imageUrl: string, prompt: string) => void;
  onDownload: (url: string, filename: string) => void;
  onClearHistory: () => void;
  visible: boolean;
}

export function GenerationHistory({
  history,
  onImageClick,
  onDownload,
  onClearHistory,
  visible
}: GenerationHistoryProps) {
  if (!visible && history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generation History</span>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/30 rounded"></div>
            </div>
            <p className="text-sm">No images generated yet</p>
            <p className="text-xs mt-1">Your generated images will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {history.map((image) => (
                <div
                  key={image.id}
                  className="group border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Image Thumbnail */}
                  <div className="mb-3 overflow-hidden rounded-md">
                    <AspectRatio ratio={1}>
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                        onClick={() => onImageClick(image.imageUrl, image.prompt)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/200x200?text=Failed+to+load";
                        }}
                      />
                    </AspectRatio>
                  </div>

                  {/* Image Info */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {formatDate(image.timestamp)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDownload(
                          image.imageUrl, 
                          `ai-image-${image.timestamp.split('T')[0]}-${image.id.slice(0, 8)}.jpg`
                        )}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs h-6 px-2"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}