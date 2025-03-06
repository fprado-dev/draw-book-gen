'use client';

import Image from "next/image";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, RectangleHorizontal, Settings2Icon, BookCheckIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function GeneratePanel() {
  const [introduction, setIntroduction] = useState('');
  const [style, setStyle] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [themeCollection, setThemeCollection] = useState('');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const handleImageSelect = (index: number) => {
    setSelectedImages(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoading(false);
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
    <main className="container mx-auto bg-slate-100">
      <div >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-x-4">
            <CardTitle>Preview</CardTitle>
            <div className="flex items-center gap-2">


              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    Generate with AI
                    <Settings2Icon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[600px] sm:max-w-none">
                  <SheetHeader className="py-4">
                    <SheetTitle>Configuration</SheetTitle>
                  </SheetHeader>
                  {ConfigurationPanel}
                </SheetContent>
              </Sheet>

            </div>
          </CardHeader>
          <CardContent className="relative flex gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative w-[450px] h-[700px] border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id={`image-${index}`}
                    checked={selectedImages.includes(index)}
                    onChange={() => handleImageSelect(index)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`image-${index}`} className="text-sm text-gray-600 cursor-pointer">
                    Select this image
                  </label>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Image
                      src="/window.svg"
                      alt="Main preview placeholder"
                      width={120}
                      height={60}
                      className="opacity-20"
                    />
                    <p className="text-slate-500 text-center">
                      Main preview will appear here
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
