// 'use client';

// import { CoverDimensions } from '@/services/pdf-rules.service';

// type PDFGuidelinesProps = {
//   dimensions: CoverDimensions;
//   visible: boolean;
// };

// export default function PDFGuidelines({
//   dimensions,
//   visible,
// }: PDFGuidelinesProps) {
//   if (!visible) return null;

//   const {
//     bleed,
//     safeZone,
//     spineWidth,
//     spineTextMargin,
//     spineVariance,
//     spineTextAllowed,
//   } = dimensions;

//   return (
//     <div className="pointer-events-none absolute inset-0">
//       <div
//         className="absolute overflow-hidden"
//         style={{
//           top: `${safeZone}in`,
//           right: `${safeZone}in`,
//           bottom: `${safeZone}in`,
//           left: `${safeZone}in`,
//         }}
//       ></div>
//       {/* Bleed Area */}
//       <div className="absolute inset-0 border-2 border-dashed border-red-400 opacity-50">
//         <div className="absolute left-2 top-1 rounded bg-red-400 px-1 text-xs text-white">
//           {`Bleed ${bleed}`}
//         </div>
//       </div>

//       {/* Safe Zone */}
//       <div
//         className="absolute border-2 border-dashed border-blue-400 opacity-50"
//         style={{
//           top: `${safeZone}in`,
//           right: `${safeZone}in`,
//           bottom: `${safeZone}in`,
//           left: `${safeZone}in`,
//         }}
//       >
//         <div className="absolute -top-3 left-2 rounded bg-blue-400 px-1 text-xs text-white">
//           {`Safe Zone ${safeZone}`}
//         </div>
//       </div>

//       {/* Spine Area */}
//       {spineWidth > 0 && (
//         <div
//           className="absolute bottom-0 top-0 border-l-2 border-r-2 border-dashed border-green-400 opacity-50"
//           style={{
//             left: `calc(50% - ${spineWidth / 2}in)`,
//             width: `${spineWidth}in`,
//           }}
//         >
//           <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-green-400 px-1 text-xs text-white">
//             {`Spine ${spineWidth.toFixed(3)}`}
//           </div>
//           {spineTextAllowed && (
//             <div
//               className="absolute border-b-2 border-t-2 border-dashed border-yellow-400 opacity-50"
//               style={{
//                 top: `${spineTextMargin}in`,
//                 bottom: `${spineTextMargin}in`,
//                 left: `${spineVariance}in`,
//                 right: `${spineVariance}in`,
//               }}
//             >
//               <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-yellow-400 px-1 text-xs text-white">
//                 Text Safe Area
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
