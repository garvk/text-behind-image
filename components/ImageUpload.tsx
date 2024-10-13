'use client';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { removeBackground } from "@imgly/background-removal";

interface ImageUploadProps {

  onImageUpload: (imageUrl: string, removedBgImageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      try {
        const imageBlob = await removeBackground(imageUrl);
        const removedBgImageUrl = URL.createObjectURL(imageBlob);
        onImageUpload(imageUrl, removedBgImageUrl);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".jpg, .jpeg, .png"
      />
      <Button onClick={handleUploadClick}>Upload Image</Button>
    </div>
  );
};

export default ImageUpload;