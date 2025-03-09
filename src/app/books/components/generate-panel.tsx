'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, RectangleHorizontal } from 'lucide-react';
import { useBookImages } from '@/contexts/BookImagesContext';

type TGeneratePanel = {
  bookId: string;
}

export default function GeneratePanel({ bookId }: TGeneratePanel) {
  const [introduction, setIntroduction] = useState('');
  const [style, setStyle] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [themeCollection, setThemeCollection] = useState('');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const { selectedImages, toggleImageSelection: handleImageSelect, addImage } = useBookImages();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // TODO: Implement AI image generation
      // For now, just add a placeholder image
      addImage(bookId);
      setLoading(false);

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const ConfigurationPanel = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-mono" htmlFor="introduction">
          Introduction:
        </label>
        <Textarea
          id="introduction"
          className="border border-slate-400"
          placeholder="Enter a detailed description of what you want to draw..."
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          rows={4}
        />

      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-mono" htmlFor="style">
          Style
        </label>
        <Textarea
          id="style"
          className="border border-slate-400"
          placeholder="Describe the style details you want for your drawing..."
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          rows={4}
        />

      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">

          <Select value={themeCollection} onValueChange={setThemeCollection}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="animals">Animals</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="holidays">Holidays</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">

          <Select value={artStyle} onValueChange={setArtStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photograph">Photograph</SelectItem>
              <SelectItem value="analog">Analog</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
              <SelectItem value="digital-art">Digital Art</SelectItem>
              <SelectItem value="lowpoly">Lowpoly</SelectItem>
              <SelectItem value="claymation">Claymation</SelectItem>
              <SelectItem value="kawaii">Kawaii</SelectItem>
              <SelectItem value="origami">Origami</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">

          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait" className="flex items-center gap-2">
                <RectangleHorizontal className="h-4 w-4 rotate-90" />
                <span>Portrait</span>
              </SelectItem>
              <SelectItem value="square" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                <span>Square</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">

          <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kids">Kids (Simple)</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full hover:cursor-pointer"
        onClick={handleGenerate}
      >
        {loading ? 'Generating...' : 'Generate Coloring Page'}
      </Button>
    </div>
  );

  return (
    <main className="container mx-auto">
      {ConfigurationPanel}
    </main>
  );
}