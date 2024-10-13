

'use client';
import React from 'react';
import Image from 'next/image';

interface LivePreviewProps {
  selectedImage: string | null;
  removedBgImageUrl: string | null;
  textSets: Array<any>;
}

const LivePreview: React.FC<LivePreviewProps> = ({
    selectedImage,
    removedBgImageUrl,
    textSets,
  }) => {
    return (
      <div className="relative w-full h-[400px] border border-gray-300 rounded-lg overflow-hidden">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Uploaded"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        )}
        {textSets.map((textSet) => {
        console.log("Applying font family:", textSet.fontFamily);
        return (
          <div
            key={textSet.id}
            style={{
              position: 'absolute',
              top: `${50 - textSet.top}%`,
              left: `${textSet.left + 50}%`,
              transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
              color: textSet.color,
              fontSize: `${textSet.fontSize}px`,
              fontFamily: `"${textSet.fontFamily}"`,
              fontWeight: textSet.fontWeight,
              opacity: textSet.opacity,
              textShadow: textSet.shadowSize > 0 ? `${textSet.shadowSize}px ${textSet.shadowSize}px ${textSet.shadowSize}px ${textSet.shadowColor}` : 'none',
            }}
          >
            {textSet.text}
          </div>
        );
      })}
        {removedBgImageUrl && (
          <img
            src={removedBgImageUrl}
            alt="Removed background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        )}
      </div>
    );
  };


export default LivePreview;