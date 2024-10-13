'use client';

import React, { useState, useRef } from 'react';
import ImageUpload from './ImageUpload';
// import TextCustomizer from './editor/text-customizer';
import TextCustomizer from './TextCustomizer';
import LivePreview from './LivePreview';
import ImageExport from './ImageExport';
import { Button } from './ui/button';
import { Accordion } from './ui/accordion';
import {fonts} from '@/constants/fonts'

const TextBehindImage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // We'll implement these functions in the following steps
  const handleImageUpload = (imageUrl: string, removedBgImageUrl: string) => {
    setSelectedImage(imageUrl);
    setRemovedBgImageUrl(removedBgImageUrl);
  };
  const handleTextChange = (id: number, attribute: string, value: any) => {
    console.log("handleTextChange", { id, attribute, value });
    setTextSets((prev) =>
      prev.map((set) => {
        if (set.id === id) {
          const updatedSet = { ...set, [attribute]: value };
          console.log("Updated text set:", updatedSet);
          return updatedSet;
        }
        return set;
      })
    );
  };
  
  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: 'New Text',
        fontFamily: `"${fonts[0]}"`,
        fontSize: 20,
        fontWeight: 400,
        color: 'white',
        top: 0,
        left: 0,
        rotation: 0,
        opacity: 1,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowSize: 0,
      },
    ]);
  };
  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  const saveCompositeImage = () => {
    console.log("Starting saveCompositeImage function");
    if (!canvasRef.current || !selectedImage) {
      console.log("Canvas ref or selected image is missing", { canvasRef: !!canvasRef.current, selectedImage: !!selectedImage });
      return;
    }
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("Failed to get 2D context from canvas");
      return;
    }
  
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log("Background image loaded", { width: img.width, height: img.height });
      canvas.width = img.width;
      canvas.height = img.height;
  
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log("Background image drawn on canvas");
  
      console.log("Starting to draw text sets", { textSetsCount: textSets.length });
      textSets.forEach((textSet, index) => {
        console.log(`Processing text set ${index + 1}`, textSet);
        ctx.save();
        const fontSize = textSet.fontSize * 3; // Scale font size
        
        const font = `${textSet.fontWeight || 400} ${fontSize}px ${textSet.fontFamily}`;
        ctx.font = font;
        console.log("Set font", { font });
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
  
        const x = canvas.width * (textSet.left + 50) / 100;
        const y = canvas.height * (50 - textSet.top) / 100;
        console.log("Calculated position", { x, y });
  
        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
  
        if (textSet.shadowSize > 0) {
          ctx.shadowColor = textSet.shadowColor;
          ctx.shadowBlur = textSet.shadowSize;
          ctx.shadowOffsetX = textSet.shadowSize;
          ctx.shadowOffsetY = textSet.shadowSize;
          console.log("Applied shadow", { shadowSize: textSet.shadowSize, shadowColor: textSet.shadowColor });
        }
  
        ctx.fillText(textSet.text, 0, 0);
        console.log("Text drawn", { text: textSet.text });
        ctx.restore();
      });
  
      if (removedBgImageUrl) {
        console.log("Attempting to draw removed background image");
        const removedBgImg = new Image();
        removedBgImg.crossOrigin = 'anonymous';
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          console.log("Removed background image drawn");
          triggerDownload();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        console.log("No removed background image, triggering download directly");
        triggerDownload();
      }
    };
    img.src = selectedImage;
    console.log("Set background image source", { src: selectedImage });
  
    function triggerDownload() {
      console.log("Triggering download");
      const dataUrl = canvas.toDataURL('image/png');
      console.log("Canvas data URL created");
      const link = document.createElement('a');
      link.download = 'text-behind-image.png';
      link.href = dataUrl;
      link.click();
      console.log("Download link clicked");
    }
  };
//   const saveCompositeImage = () => {
//     if (!canvasRef.current || !selectedImage) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const img = new Image();
//     img.crossOrigin = 'anonymous';
//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;

//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//       textSets.forEach((textSet) => {
//         ctx.save();
//         ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
//         ctx.fillStyle = textSet.color;
//         ctx.globalAlpha = textSet.opacity;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';

//         const x = canvas.width * (textSet.left + 50) / 100;
//         const y = canvas.height * (50 - textSet.top) / 100;

//         ctx.translate(x, y);
//         ctx.rotate((textSet.rotation * Math.PI) / 180);

//         // Apply text shadow
//         if (textSet.shadowSize > 0) {
//           ctx.shadowColor = textSet.shadowColor;
//           ctx.shadowBlur = textSet.shadowSize;
//           ctx.shadowOffsetX = textSet.shadowSize;
//           ctx.shadowOffsetY = textSet.shadowSize;
//         }

//         ctx.fillText(textSet.text, 0, 0);
//         ctx.restore();
//       });

//       if (removedBgImageUrl) {
//         const removedBgImg = new Image();
//         removedBgImg.crossOrigin = 'anonymous';
//         removedBgImg.onload = () => {
//           ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
//           triggerDownload();
//         };
//         removedBgImg.src = removedBgImageUrl;
//       } else {
//         triggerDownload();
//       }
//     };
//     img.src = selectedImage;

//     function triggerDownload() {
//       const dataUrl = canvas.toDataURL('image/png');
//       const link = document.createElement('a');
//       link.download = 'text-behind-image.png';
//       link.href = dataUrl;
//       link.click();
//     }
//   };



  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2">
        <ImageUpload onImageUpload={handleImageUpload} />
        <Button onClick={addNewTextSet}>Add New Text</Button>
        <Accordion type="single" collapsible>
          {textSets.map((textSet) => (
            <TextCustomizer
              key={textSet.id}
              textSet={textSet}
              handleAttributeChange={handleTextChange}
              removeTextSet={removeTextSet}
              duplicateTextSet={() => {}} // Add this function later
            />
          ))}
        </Accordion>
      </div>
      <div className="w-full md:w-1/2">
        <LivePreview
          selectedImage={selectedImage}
          removedBgImageUrl={removedBgImageUrl}
          textSets={textSets}
        />
        <ImageExport onExport={saveCompositeImage} />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default TextBehindImage;