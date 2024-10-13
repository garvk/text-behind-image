'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImageExportProps {
  onExport: () => void;
}

const ImageExport: React.FC<ImageExportProps> = ({ onExport }) => {
    const handleExport = () => {
      console.log("Export button clicked");
      onExport();
    };
  
    return (
      <Button onClick={handleExport}>
        Save Image
      </Button>
    );
  };

// const ImageExport: React.FC<ImageExportProps> = ({ onExport }) => {
//   console.log("Triggering download in ImageExport");
//   return <Button onClick={onExport}>Save Image</Button>;
// };

export default ImageExport;