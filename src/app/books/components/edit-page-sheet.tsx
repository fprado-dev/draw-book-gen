'use client';

import { TPage } from '@/types/ebook';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Settings, Sparkles, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SelectSeparator } from '@radix-ui/react-select';


type EditPageSheetProps = {
  page: TPage;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const AI_MODELS = [
  { id: 'flux-pro', name: 'FLUX.1 Pro', description: 'Professional high-quality image generation' },
  { id: 'sana', name: 'NVIDIA Sana', description: 'Advanced NVIDIA image model' },
  { id: 'photon-flash', name: 'Photon Flash', description: 'Fast, high-quality image generation' },
  { id: 'imagen-3-fast', name: 'Imagen 3 Fast', description: 'Quick generation with Google Imagen' },
  { id: 'recraft-v3', name: 'Recraft V3', description: 'Versatile image generation model' },
  { id: 'ideogram-turbo', name: 'Ideogram V2A Turbo', description: 'High-speed creative generation' },
  { id: 'ideogram-v2a', name: 'Ideogram V2A', description: 'Balanced creative image generation' },
  { id: 'imagen-3', name: 'Google Imagen 3', description: 'Premium Google image generation' },
  { id: 'flux-ultra', name: 'FLUX 1.1 Pro Ultra', description: 'Ultra-high quality image generation' },
  { id: 'photon', name: 'Photon', description: 'Advanced photorealistic generation' },
];

const STYLE_PRESETS = [
  { id: 'realistic', name: 'Realistic', keywords: ['photorealistic', 'detailed', 'natural lighting'] },
  { id: 'cartoon', name: 'Cartoon', keywords: ['vibrant', 'stylized', 'bold colors'] },
  { id: 'watercolor', name: 'Watercolor', keywords: ['soft', 'flowing', 'artistic'] },
  { id: 'oil-painting', name: 'Oil Painting', keywords: ['textured', 'rich colors', 'classical'] },
  { id: 'digital-art', name: 'Digital Art', keywords: ['modern', 'clean', 'sharp'] },
  { id: 'pencil-sketch', name: 'Pencil Sketch', keywords: ['monochrome', 'hand-drawn', 'detailed'] },
  { id: 'line-art', name: 'Line Art', keywords: ['minimal', 'clean lines', 'elegant'] },
  { id: 'anime', name: 'Anime', keywords: ['manga-style', 'cel-shaded', 'expressive'] },
  { id: 'comic-book', name: 'Comic Book', keywords: ['bold', 'dynamic', 'action'] },
  { id: 'abstract', name: 'Abstract', keywords: ['non-representational', 'geometric', 'experimental'] },
];

const GENERATION_HISTORY = [
  { timestamp: new Date(), prompt: 'Sample prompt 1', style: 'Realistic', model: 'sdxl' },
  { timestamp: new Date(), prompt: 'Sample prompt 2', style: 'Cartoon', model: 'dall-e' },
];

export default function EditPageSheet({ page, isOpen, onOpenChange }: EditPageSheetProps) {
  const [selectedModel, setSelectedModel] = useState('recraft-v3');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [activeTab, setActiveTab] = useState('generate');
  const [strength, setStrength] = useState([50]);
  const [guidance, setGuidance] = useState([7.5]);
  const [steps, setSteps] = useState([30]);

  const handleGenerateImage = () => {
    // TODO: Implement image generation
    console.log('Generating image...');
  };

  const addKeywordToPrompt = (keyword: string) => {
    setPrompt((prev) => prev + (prev ? ', ' : '') + keyword);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-full p-4 h-screen">



        <div className="grid grid-cols-4 gap-6 h-screen overflow-y-auto">
          {/* Left side - Page Preview */}
          <div className="col-span-2">
            <Card className="w-full h-full relative">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full rounded-sm bg-white border border-slate-100 relative">
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-16 pointer-events-none opacity-5">
                    {Array.from({ length: 192 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-slate-50"
                        style={{
                          borderRight: i % 12 !== 11 ? '1px solid' : 'none',
                          borderBottom: Math.floor(i / 12) !== 15 ? '1px solid' : 'none',
                        }}
                      />
                    ))}
                  </div>
                  {page.type === 'illustration' && page.imageUrl ? (
                    <img
                      src={page.imageUrl}
                      alt={page.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-slate-400">No image generated yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Tabs Content */}
          <div className="col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} >
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" /> Style
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" /> History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="generate" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className='cursor-pointer' >
                      <SelectValue className='bg-red-300' placeholder="Select AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex p-2 items-center gap-1">
                            <span>{model.name}</span>
                            -
                            <span className="text-xs text-slate-500">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Prompt</Label>
                  <Textarea
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-32"
                  />
                  <div className="flex flex-wrap gap-2">
                    {selectedStyle && STYLE_PRESETS.find(s => s.id === selectedStyle)?.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-slate-200"
                        onClick={() => addKeywordToPrompt(keyword)}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Negative Prompt</Label>
                  <Textarea
                    placeholder="Describe what you don't want in the image..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="h-24"
                  />
                </div>

                <Button className="w-full" size="lg" onClick={handleGenerateImage}>
                  Generate Image
                </Button>
              </TabsContent>

              <TabsContent value="style" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <Label>Style Preset</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {STYLE_PRESETS.map((style) => (
                      <Card
                        key={style.id}
                        className={`cursor-pointer transition-all ${selectedStyle === style.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{style.name}</h4>
                          <div className="flex flex-wrap gap-1">
                            {style.keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Strength</Label>
                      <span className="text-sm text-muted-foreground">{strength}%</span>
                    </div>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Guidance Scale</Label>
                      <span className="text-sm text-muted-foreground">{guidance}</span>
                    </div>
                    <Slider
                      value={guidance}
                      onValueChange={setGuidance}
                      min={1}
                      max={20}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Steps</Label>
                      <span className="text-sm text-muted-foreground">{steps}</span>
                    </div>
                    <Slider
                      value={steps}
                      onValueChange={setSteps}
                      min={10}
                      max={150}
                      step={1}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4">
                    {GENERATION_HISTORY.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {item.timestamp.toLocaleString()}
                            </span>
                            <Badge variant="outline">{item.model}</Badge>
                          </div>
                          <p className="text-sm">{item.prompt}</p>
                          <Badge variant="secondary">{item.style}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>

    </Sheet>
  );
}