// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Square, RectangleHorizontal, Loader2 } from 'lucide-react';
// import { useBookImages } from '@/contexts/BookImagesContext';
// import { generateColoringBookImage } from '@/services/stability-ai.service';
// import { toast } from 'sonner';
// import { supabase } from '@/services/supabase';

// type TGeneratePanel = {
//   bookId: string;
// };

// export default function GeneratePanel({ bookId }: TGeneratePanel) {
//   const [introduction, setIntroduction] = useState('');
//   const [style, setStyle] = useState('');
//   const [artStyle, setArtStyle] = useState('');
//   const [themeCollection, setThemeCollection] = useState('');
//   const [aspectRatio, setAspectRatio] = useState('portrait');
//   const [difficultyLevel, setDifficultyLevel] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { addImage } = useBookImages();

//   const handleGenerate = async () => {
//     if (!introduction.trim()) {
//       toast.error('Please provide a description of what you want to draw');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Build the prompt based on user inputs
//       let prompt = introduction;

//       // Add theme if selected
//       if (themeCollection) {
//         prompt = `${themeCollection} ${prompt}`;
//       }

//       // Determine dimensions based on aspect ratio
//       const dimensions =
//         aspectRatio === 'portrait'
//           ? { width: 768, height: 1024 }
//           : { width: 1024, height: 1024 };

//       // Generate the image using Stability AI
//       const imageUrl = await generateColoringBookImage({
//         prompt,
//         stylePrompt: style,
//         width: dimensions.width,
//         height: dimensions.height,
//         style: artStyle || 'line-art',
//         difficultyLevel,
//       });

//       const compressImage = async (
//         blob: Blob,
//         maxSizeInBytes: number
//       ): Promise<Blob> => {
//         const createImageBitmap = (blob: Blob): Promise<ImageBitmap> => {
//           return new Promise((resolve, reject) => {
//             const img = new Image();
//             img.onload = () => {
//               const canvas = document.createElement('canvas');
//               canvas.width = img.width;
//               canvas.height = img.height;
//               const ctx = canvas.getContext('2d');
//               if (ctx) {
//                 ctx.drawImage(img, 0, 0);
//                 canvas.toBlob((blob) => {
//                   if (blob) {
//                     resolve(createImageBitmap(blob));
//                   } else {
//                     reject(new Error('Failed to create blob from image'));
//                   }
//                 });
//               } else {
//                 reject(new Error('Failed to get canvas context'));
//               }
//             };
//             img.onerror = reject;
//             img.src = URL.createObjectURL(blob);
//           });
//         };

//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         if (!ctx) throw new Error('Could not get canvas context');

//         const bitmap = await createImageBitmap(blob);
//         let quality = 0.9;
//         let compressedBlob = blob;

//         while (compressedBlob.size > maxSizeInBytes && quality > 0.1) {
//           canvas.width = bitmap.width;
//           canvas.height = bitmap.height;
//           ctx.drawImage(bitmap, 0, 0);

//           const compressedDataUrl = canvas.toDataURL('image/png', quality);
//           const base64Data = compressedDataUrl.split(',')[1];
//           compressedBlob = await fetch(
//             `data:image/png;base64,${base64Data}`
//           ).then((res) => res.blob());

//           quality -= 0.1;
//         }

//         return compressedBlob;
//       };

//       if (imageUrl) {
//         // Convert base64 to blob and check file size
//         const base64Data = imageUrl.split(',')[1];
//         let blob = await fetch(`data:image/png;base64,${base64Data}`).then(
//           (res) => res.blob()
//         );

//         // Check if file size is greater than 50MB
//         const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
//         if (blob.size > MAX_FILE_SIZE) {
//           try {
//             blob = await compressImage(blob, MAX_FILE_SIZE);
//             if (blob.size > MAX_FILE_SIZE) {
//               toast.error(
//                 'Unable to compress image to target size. Please try with simpler prompt or lower resolution.'
//               );
//               return;
//             }
//           } catch (error) {
//             console.error('Error compressing image:', error);
//             toast.error('Failed to compress image');
//             return;
//           }
//         }

//         // Get current user's ID
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();

//         if (!user) {
//           toast.error('You must be logged in to save images');
//           return;
//         }

//         // Generate unique filename with user ID as first path segment
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
//         const filePath = `${user.id}/${bookId}/${fileName}`;

//         // Upload to Supabase storage
//         const { error: uploadError } = await supabase.storage
//           .from('users-generated-images')
//           .upload(filePath, blob, {
//             contentType: 'image/png',
//             cacheControl: '3600',
//           });

//         if (uploadError) {
//           console.error('Upload error:', uploadError);
//           toast.error('Failed to save the generated image');
//           return;
//         }

//         // Get the public URL
//         const {
//           data: { publicUrl },
//         } = supabase.storage
//           .from('users-generated-images')
//           .getPublicUrl(filePath);

//         // Add the stored image to the book
//         addImage(bookId, publicUrl);
//         toast.success('Image generated and saved successfully!');
//       } else {
//         toast.error('Failed to generate image. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error generating image:', error);
//       toast.error('An error occurred while generating the image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ConfigurationPanel = (
//     <div className="flex flex-col gap-4">
//       <div className="flex flex-col gap-2">
//         <label className="font-mono text-sm" htmlFor="introduction">
//           Introduction:
//         </label>
//         <Textarea
//           id="introduction"
//           className="border border-slate-400"
//           placeholder="Enter a detailed description of what you want to draw..."
//           value={introduction}
//           onChange={(e) => setIntroduction(e.target.value)}
//           rows={4}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="font-mono text-sm" htmlFor="style">
//           Style
//         </label>
//         <Textarea
//           id="style"
//           className="border border-slate-400"
//           placeholder="Describe the style details you want for your drawing..."
//           value={style}
//           onChange={(e) => setStyle(e.target.value)}
//           rows={4}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Select value={themeCollection} onValueChange={setThemeCollection}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a Theme" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="animals">Animals</SelectItem>
//               <SelectItem value="fantasy">Fantasy</SelectItem>
//               <SelectItem value="vehicles">Vehicles</SelectItem>
//               <SelectItem value="holidays">Holidays</SelectItem>
//               <SelectItem value="educational">Educational</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Select value={artStyle} onValueChange={setArtStyle}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a Style" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="line-art">Line Art</SelectItem>
//               <SelectItem value="analog">Analog</SelectItem>
//               <SelectItem value="anime">Anime</SelectItem>
//               <SelectItem value="digital-art">Digital Art</SelectItem>
//               <SelectItem value="low-poly">Lowpoly</SelectItem>
//               <SelectItem value="origami">Origami</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Select value={aspectRatio} onValueChange={setAspectRatio}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a Mode" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="portrait" className="flex items-center gap-2">
//                 <RectangleHorizontal className="h-4 w-4 rotate-90" />
//                 <span>Portrait</span>
//               </SelectItem>
//               <SelectItem value="square" className="flex items-center gap-2">
//                 <Square className="h-4 w-4" />
//                 <span>Square</span>
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select Level" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="kids">Kids (Simple)</SelectItem>
//               <SelectItem value="beginner">Beginner</SelectItem>
//               <SelectItem value="intermediate">Intermediate</SelectItem>
//               <SelectItem value="advanced">Advanced</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Button
//         className="w-full hover:cursor-pointer"
//         onClick={handleGenerate}
//         disabled={loading}
//       >
//         {loading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Generating...
//           </>
//         ) : (
//           'Generate Coloring Page'
//         )}
//       </Button>
//     </div>
//   );

//   return <main className="container mx-auto">{ConfigurationPanel}</main>;
// }
