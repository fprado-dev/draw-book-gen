'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type GeneratedImage = {
  bookId: string;
  id: number;
  url: string;
  selected: boolean;
  order: number;
  createdAt: Date;
};

type BookImagesContextType = {
  images: GeneratedImage[];
  selectedImages: number[];
  addImage: (bookId: string, url?: string,) => void;
  removeImage: (id: number) => void;
  toggleImageSelection: (id: number) => void;
  clearImages: () => void;
  updateImageOrder: (id: number, newOrder: number) => void;
};

const BookImagesContext = createContext<BookImagesContextType | undefined>(undefined);

export function BookImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const addImage = useCallback((bookId: string, url: string = "https://placehold.co/600x384@2x.png") => {
    setImages(prev => [
      ...prev,
      {
        bookId,
        id: Date.now(),
        url,
        selected: false,
        order: prev.length + 1,
        createdAt: new Date()
      }
    ]);
  }, []);

  const removeImage = useCallback((id: number) => {
    setImages(prev => prev.filter(image => image.id !== id));
    setSelectedImages(prev => prev.filter(selectedId => selectedId !== id));
  }, []);

  const toggleImageSelection = useCallback((id: number) => {
    setSelectedImages(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setSelectedImages([]);
  }, []);

  const updateImageOrder = useCallback((id: number, newOrder: number) => {
    setImages(prev =>
      prev.map(image =>
        image.id === id
          ? { ...image, order: newOrder }
          : image
      )
    );
  }, []);

  return (
    <BookImagesContext.Provider
      value={{
        images,
        selectedImages,
        addImage,
        removeImage,
        toggleImageSelection,
        clearImages,
        updateImageOrder
      }}
    >
      {children}
    </BookImagesContext.Provider>
  );
}

export function useBookImages() {
  const context = useContext(BookImagesContext);
  if (context === undefined) {
    throw new Error('useBookImages must be used within a BookImagesProvider');
  }
  return context;
}