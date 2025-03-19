'use client';

import { CoverDimensions } from '@/services/pdf-rules.service';

type PDFGuidelinesProps = {
  dimensions: CoverDimensions;
  visible: boolean;
};

export default function PDFGuidelines({ dimensions, visible }: PDFGuidelinesProps) {
  if (!visible) return null;

  const {
    bleed,
    safeZone,
    spineWidth,
    spineTextMargin,
    spineVariance,
    spineTextAllowed
  } = dimensions;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute overflow-hidden"
        style={{
          top: `${safeZone}in`,
          right: `${safeZone}in`,
          bottom: `${safeZone}in`,
          left: `${safeZone}in`
        }}
      >

      </div>
      {/* Bleed Area */}
      <div className="absolute inset-0 border-2 border-red-400 border-dashed opacity-50">
        <div className="absolute top-1 left-2 bg-red-400 text-white text-xs px-1 rounded">
          {`Bleed ${bleed}`}
        </div>
      </div>

      {/* Safe Zone */}
      <div
        className="absolute border-2 border-blue-400 border-dashed opacity-50"
        style={{
          top: `${safeZone}in`,
          right: `${safeZone}in`,
          bottom: `${safeZone}in`,
          left: `${safeZone}in`
        }}
      >
        <div className="absolute -top-3 left-2 bg-blue-400 text-white text-xs px-1 rounded">
          {`Safe Zone ${safeZone}`}
        </div>
      </div>

      {/* Spine Area */}
      {spineWidth > 0 && (
        <div
          className="absolute top-0 bottom-0 border-l-2 border-r-2 border-green-400 border-dashed opacity-50"
          style={{
            left: `calc(50% - ${spineWidth / 2}in)`,
            width: `${spineWidth}in`
          }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-white text-xs px-1 rounded whitespace-nowrap">
            {`Spine ${spineWidth.toFixed(3)}`}
          </div>
          {spineTextAllowed && (
            <div
              className="absolute border-t-2 border-b-2 border-yellow-400 border-dashed opacity-50"
              style={{
                top: `${spineTextMargin}in`,
                bottom: `${spineTextMargin}in`,
                left: `${spineVariance}in`,
                right: `${spineVariance}in`
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs px-1 rounded whitespace-nowrap">
                Text Safe Area
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}