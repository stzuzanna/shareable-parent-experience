import React from "react";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { ChevronRightIcon, XIcon, PhoneIcon } from "lucide-react";
import { BASE_PATH } from "../../../../constants";

interface FamilyPageProps {
  onClose: () => void;
}

const familyContacts = [
  {
    id: 'katie',
    name: 'Katie Smith',
    role: 'Mom',
    phone: '7035972396',
    avatar: `${BASE_PATH}avatar-2.png`,
    isPrimary: true,
  },
  {
    id: 'john',
    name: 'John Smith',
    role: 'Dad',
    phone: '5717222209',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPrimary: true,
  },
  {
    id: 'margaret',
    name: 'Margaret Smith',
    role: 'Grandma',
    phone: '5551234567',
    avatar: null,
    isPrimary: false,
  },
];

export const FamilyPage: React.FC<FamilyPageProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  
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
            Family
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 bg-white px-6 py-6">
        {/* Contacts Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Contacts
          </h2>
          
          <Button
            variant="outline"
            className="h-8 px-3 py-1 text-sm border-mfprimaryp-400 text-mfprimaryp-400 hover:bg-mfprimaryp-50"
          >
            Add Contact
          </Button>
        </div>

        {/* Family Contacts List */}
        <div className="flex flex-col gap-4 mb-8">
          {familyContacts.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className="flex items-center justify-between h-auto p-0 text-left rounded-none hover:bg-transparent"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  {contact.avatar ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                    {contact.name}
                  </div>
                  <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                    {contact.role}
                  </div>
                  <div className="flex items-center gap-1 text-mfprimaryp-400">
                    <PhoneIcon className="w-3 h-3" />
                    <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                      {contact.phone}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Button>
          ))}
        </div>

        {/* Siblings Section */}
        <div className="flex flex-col">
          <h2 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)] mb-4">
            Siblings
          </h2>
          
          <div className="text-center py-8">
            <p className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] max-w-xs mx-auto">
              Connect siblings to each other and get an overview of the entire family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};