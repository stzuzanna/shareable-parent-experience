import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { XIcon } from "lucide-react";
import { BASE_PATH } from "../../../../constants";

interface PhotosPageProps {
  onClose: () => void;
}

const kindergartenPhotos = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export const PhotosPage: React.FC<PhotosPageProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className="flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400">
          <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
            <div className="relative w-[54px] h-[21px] rounded-3xl">
              <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-0 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">
                9:41
              </div>
            </div>
          </div>

          <div className="flex flex-col h-8 items-center justify-center relative flex-1">
            <div className="relative flex-1 w-[108px] bg-mfneutralsn-0 rounded-[100px] opacity-0" />
          </div>

          <img
            className="relative w-[106px] h-full"
            alt="Right side"
            src={`${BASE_PATH}right-side.svg`}
          />
        </div>

        <nav className="flex h-12 items-center justify-between px-4 py-2 relative w-full bg-mfprimaryp-400">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0"
          >
            <XIcon className="w-5 h-5 text-white" />
          </Button>

          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Photos
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 bg-white p-3">
        <div className="grid grid-cols-2 gap-3">
          {kindergartenPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedPhoto(photo.url)}
            >
              <img
                src={photo.url}
                alt="Kindergarten activity"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen photo modal */}
      {selectedPhoto && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white z-10"
            >
              <XIcon className="w-6 h-6" />
            </Button>
            <img
              src={selectedPhoto}
              alt="Full screen view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};