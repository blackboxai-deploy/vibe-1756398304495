import { ImageGenerator } from "@/components/ImageGenerator";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Image Generator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with advanced AI technology. 
            Create art, illustrations, and designs with simple text prompts.
          </p>
        </div>

        {/* Main Content */}
        <ImageGenerator />

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by advanced AI models • Create responsibly</p>
        </div>
      </div>
    </main>
  );
}