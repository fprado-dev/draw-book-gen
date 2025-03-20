'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { generateBookOutline } from '@/services/replicate.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Sparkles, BookOpen, Copy, Trash, Filter, Download } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type Genre = {
  id: string;
  name: string;
  description: string;
  promptKeywords: string[];
};

type Outline = {
  prompt: string;
  chapters: { title: string; description: string }[];
  createdAt: string;
  complexity: number;
  genre?: string;
};

const GENRES: Genre[] = [
  { id: 'fantasy', name: 'Fantasy', description: 'Magical worlds and epic adventures', promptKeywords: ['magical elements', 'mythical creatures', 'epic journey'] },
  { id: 'mystery', name: 'Mystery', description: 'Suspenseful investigations and puzzles', promptKeywords: ['detective work', 'suspense', 'plot twists'] },
  { id: 'romance', name: 'Romance', description: 'Love stories and relationships', promptKeywords: ['emotional journey', 'character development', 'relationships'] },
  { id: 'scifi', name: 'Science Fiction', description: 'Futuristic and technological themes', promptKeywords: ['advanced technology', 'space exploration', 'future society'] },
  { id: 'thriller', name: 'Thriller', description: 'High-stakes action and suspense', promptKeywords: ['fast-paced', 'high stakes', 'intense action'] },
  { id: 'historical', name: 'Historical Fiction', description: 'Stories set in the past', promptKeywords: ['historical setting', 'period details', 'historical events'] }
];


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function OutlinesPage() {
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chapterCount, setChapterCount] = useState('5');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [complexityLevel, setComplexityLevel] = useState('balanced');
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [stats, setStats] = useState({
    totalOutlines: 0,
    totalChapters: 0,
    averageComplexity: 0
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    updateStats();
  }, [outlines]);

  const updateStats = () => {
    const totalChapters = outlines.reduce((sum, outline) => sum + outline.chapters.length, 0);
    const avgComplexity = outlines.reduce((sum, outline) => sum + outline.complexity, 0) / (outlines.length || 1);

    setStats({
      totalOutlines: outlines.length,
      totalChapters,
      averageComplexity: Math.round(avgComplexity * 10) / 10
    });
  };

  const handleGenerateOutline = async () => {
    if (!outlinePrompt.trim()) {
      toast.error('Please provide a description for your book outline');
      return;
    }

    setLoading(true);
    try {
      const result = await generateBookOutline({
        prompt: outlinePrompt,
        complexity: complexityLevel,
        chapters: parseInt(chapterCount)
      });

      if (result.success && result.outline) {
        if (typeof result.outline === 'string') {
          toast.error('Unexpected outline format received');
          return;
        }

        const chapters = result.outline.chapters;
        if (Array.isArray(chapters)) {
          const newOutline: Outline = {
            prompt: outlinePrompt,
            chapters,
            createdAt: new Date().toISOString(),
            complexity: Math.random() * 2 + 3 // Simulated complexity score between 3-5
          };
          setOutlines(prev => [newOutline, ...prev]);
          setOutlinePrompt('');
          toast.success('Book outline generated successfully!');
        } else {
          toast.error('Invalid outline format received');
        }
      } else {
        throw new Error(result.error || 'Failed to generate outline');
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      toast.error('An error occurred while generating the outline');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutline = (index: number) => {
    setOutlines(prev => prev.filter((_, i) => i !== index));
    toast.success('Outline deleted successfully');
  };

  const handleDownloadOutline = (outline: Outline) => {
    const content = JSON.stringify(outline, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outline-${format(new Date(outline.createdAt), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Outline downloaded successfully');
  };

  const filteredOutlines = outlines.filter(outline => {
    if (filter === 'all') return true;
    if (filter === 'complex') return outline.complexity >= 4;
    return outline.complexity < 4;
  });

  const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/50 backdrop-blur-sm border border-slate-200">
        <CardContent className="flex items-center p-6">
          <div className="rounded-full p-2 bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          icon={BookOpen}
          label="Total Outlines"
          value={stats.totalOutlines}
        />
        <StatCard
          icon={Copy}
          label="Total Chapters"
          value={stats.totalChapters}
        />
        <StatCard
          icon={Sparkles}
          label="Avg. Complexity"
          value={stats.averageComplexity}
        />
      </motion.div>

      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter outlines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlines</SelectItem>
              <SelectItem value="complex">Complex (4-5)</SelectItem>
              <SelectItem value="simple">Simple (3-4)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Outline
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-full md:max-w-3xl  p-6 h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create Book Outline</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Genre</label>
                <Select value={selectedGenre} onValueChange={(value) => {
                  setSelectedGenre(value);
                  const genre = GENRES.find(g => g.id === value);
                  if (genre) {
                    setOutlinePrompt(prev => prev + '\n\nGenre Keywords: ' + genre.promptKeywords.join(', '));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        <div className="flex flex-col">
                          <span>{genre.name}</span>
                          <span className="text-xs text-muted-foreground">{genre.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Complexity Level</label>
                <Select value={complexityLevel} onValueChange={setComplexityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple - Basic plot structure</SelectItem>
                    <SelectItem value="balanced">Balanced - Moderate detail</SelectItem>
                    <SelectItem value="complex">Complex - Rich detail & subplots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="outlinePrompt">
                  Create Your Book Outline
                </label>
                <p className="text-sm text-muted-foreground">
                  Be specific about themes, target audience, and key plot elements
                </p>
                <Textarea
                  id="outlinePrompt"
                  className="min-h-[120px]"
                  placeholder="Describe your book's content, themes, and structure..."
                  value={outlinePrompt}
                  onChange={(e) => setOutlinePrompt(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="chapterCount">
                  Number of Chapters
                </label>
                <Select value={chapterCount} onValueChange={setChapterCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of chapters" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Chapter' : 'Chapters'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateOutline}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Outline'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredOutlines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No outlines generated yet. Create your first outline!</p>
            </motion.div>
          ) : (
            <Accordion type="multiple" className="w-full gap-4">
              {filteredOutlines.map((outline, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col gap-4'
                >
                  <Card className='px-4 py-0 mb-4'>
                    <AccordionItem value={index.toString()}>
                      <AccordionTrigger className="group">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <span className="text-left font-medium">{outline.prompt}</span>
                            <Badge variant="secondary" className="hidden group-hover:inline-flex">
                              {outline.chapters.length} chapters
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={outline.complexity >= 4 ? 'default' : 'outline'}
                              className="hidden group-hover:inline-flex"
                            >
                              {outline.complexity >= 4 ? 'Complex' : 'Simple'}
                            </Badge>
                            <span className="text-sm text-muted-foreground hidden group-hover:inline">
                              {format(new Date(outline.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-end gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadOutline(outline)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOutline(index)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                        <motion.div
                          variants={container}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {outline.chapters.map((chapter, chapterIndex) => (
                            <motion.div
                              key={chapterIndex}
                              variants={item}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className="overflow-hidden cursor-pointer transition-all duration-200 hover:bg-slate-50"
                                onClick={() => {
                                  navigator.clipboard.writeText(chapter.description);
                                  toast.success('Copied to clipboard!');
                                }}
                              >
                                <CardHeader>
                                  <CardTitle className="text-sm">{chapter.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">{chapter.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                </motion.div>
              ))}
            </Accordion>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}