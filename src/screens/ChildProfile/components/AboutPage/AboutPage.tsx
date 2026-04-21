import React from "react";
import { Button } from "../../../../components/ui/button";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_PATH } from "../../../../constants";

interface AboutPageProps {
  onClose: () => void;
}

const aboutSections = [
  { id: 'basic-info', label: 'Basic info' },
  { id: 'health', label: 'Health' },
  { id: 'sensitive-information', label: 'Sensitive information' },
  { id: 'documents', label: 'Documents' },
  { id: 'registration-classroom', label: 'Registration & classroom move' },
  { id: 'permissions', label: 'Permissions' },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();

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
            About
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 bg-white">
        <div className="flex flex-col">
          {aboutSections.map((section, index) => (
            <Button
              key={section.id}
              variant="ghost"
              className={`flex items-center justify-between h-14 px-6 py-4 text-left rounded-none border-b border-gray-100 ${
                section.id === 'permissions' ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default hover:bg-transparent'
              }`}
              onClick={() => {
                if (section.id === 'permissions') {
                  navigate('/child-profile/about/permissions');
                }
              }}
            >
              <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                {section.label}
              </span>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};