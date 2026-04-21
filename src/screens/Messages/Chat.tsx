import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeftIcon, ChevronDownIcon, SendIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";

interface Message {
  id: string;
  sender: 'olivia' | 'sandra' | 'claire' | 'michael' | 'sarah';
  content: string;
  spanishContent?: string;
  timestamp: string;
  isTranslated?: boolean;
  senderName?: string;
  senderRole?: string;
  avatar?: string;
}

const individualChatMessages: Message[] = [
  {
    id: '0',
    sender: 'olivia',
    content: "Hi Sandra! Just a quick reminder that we're running low on Amanda's diapers. Could you bring a fresh pack when you drop her off tomorrow morning?",
    spanishContent: "¡Hola Sandra! Solo un recordatorio rápido de que se nos están acabando los pañales de Amanda. ¿Podrías traer un paquete nuevo cuando la dejes mañana por la mañana?",
    timestamp: "Yesterday 4:20pm",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '0.5',
    sender: 'sandra',
    content: "Of course! I'll grab a pack on my way home tonight. Thanks for letting me know 😊",
    spanishContent: "¡Por supuesto! Compraré un paquete de camino a casa esta noche. Gracias por avisarme 😊",
    timestamp: "Yesterday 4:25pm",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '1',
    sender: 'olivia',
    content: "Hi Sandra, I wanted to let you know that Amanda isn't feeling very well today. She has a slight fever and seems quite tired. I think it would be best if you could pick her up early today.",
    spanishContent: "Hola Sandra, quería informarte que Amanda no se siente muy bien hoy. Tiene un poco de fiebre y parece bastante cansada. Creo que sería mejor si pudieras recogerla temprano hoy.",
    timestamp: "Today 11:30am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '2',
    sender: 'sandra',
    content: "Oh no! Poor little one. I'll be there in 20 minutes. Has she been eating or drinking anything?",
    spanishContent: "¡Oh no! Pobrecita. Estaré allí en 20 minutos. ¿Ha estado comiendo o bebiendo algo?",
    timestamp: "Today 11:35am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '3',
    sender: 'olivia',
    content: "She had a little water but didn't want her snack. We've been keeping her comfortable and taking her temperature regularly. It's 99.2°F right now.",
    spanishContent: "Tomó un poco de agua pero no quiso su merienda. La hemos mantenido cómoda y le hemos estado tomando la temperatura regularmente. Ahora mismo está a 99.2°F.",
    timestamp: "Today 11:37am",
    isTranslated: true,
    isTranslatable: true
  }
];

const groupChatMessages: Message[] = [
  {
    id: '1',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Teacher (Pre-schoolers Room)',
    avatar: `${BASE_PATH}frame-12.png`,
    content: "Good morning Pre-schoolers families! 🌟 Just a friendly reminder that tomorrow is our Halloween costume parade at 10:30am. The children are so excited to show off their costumes! Please remember to keep costumes simple and comfortable for play. We'll be taking lots of photos to share with you all. Looking forward to a spooky fun day! 🎃👻",
    spanishContent: "¡Buenos días familias de Preescolares! 🌟 Solo un recordatorio amistoso de que mañana es nuestro desfile de disfraces de Halloween a las 10:30am. ¡Los niños están muy emocionados de mostrar sus disfraces! Por favor recuerden mantener los disfraces simples y cómodos para jugar. Tomaremos muchas fotos para compartir con todos ustedes. ¡Esperamos un día divertido y espeluznante! 🎃👻",
    timestamp: "Yesterday 8:15am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '2',
    sender: 'sandra',
    content: "Thank you for the reminder! Emma is so excited about her butterfly costume 🦋",
    spanishContent: "¡Gracias por el recordatorio! Emma está muy emocionada con su disfraz de mariposa 🦋",
    timestamp: "Yesterday 8:45am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '3',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Teacher (Pre-schoolers Room)',
    avatar: `${BASE_PATH}frame-12.png`,
    content: "Perfect! The butterfly costume sounds adorable. Can't wait to see it! 😊",
    spanishContent: "¡Perfecto! El disfraz de mariposa suena adorable. ¡No puedo esperar a verlo! 😊",
    timestamp: "Yesterday 9:02am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '4',
    sender: 'michael',
    senderName: 'Michael Johnson',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: "Thanks Claire! Just to confirm - are masks okay as long as they're not covering the whole face? Tommy wants to be a superhero.",
    spanishContent: "¡Gracias Claire! Solo para confirmar - ¿están bien las máscaras siempre y cuando no cubran toda la cara? Tommy quiere ser un superhéroe.",
    timestamp: "Yesterday 9:15am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '5',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Teacher (Pre-schoolers Room)',
    avatar: `${BASE_PATH}frame-12.png`,
    content: "Yes, partial masks are fine! Just make sure we can see his eyes and mouth clearly for safety. Superhero costumes are always a hit! 🦸‍♂️",
    spanishContent: "¡Sí, las máscaras parciales están bien! Solo asegúrense de que podamos ver sus ojos y boca claramente por seguridad. ¡Los disfraces de superhéroes siempre son un éxito! 🦸‍♂️",
    timestamp: "Yesterday 9:18am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '6',
    sender: 'sarah',
    senderName: 'Sarah Martinez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: "Should we bring any snacks for the parade? Lily keeps asking if there will be treats! 🍭",
    spanishContent: "¿Deberíamos traer algunos bocadillos para el desfile? ¡Lily sigue preguntando si habrá dulces! 🍭",
    timestamp: "Yesterday 9:45am",
    isTranslated: true,
    isTranslatable: true
  },
  {
    id: '7',
    sender: 'claire',
    senderName: 'Claire Potter',
    senderRole: 'Teacher (Pre-schoolers Room)',
    avatar: `${BASE_PATH}frame-12.png`,
    content: "No need to bring snacks - we have some special Halloween treats prepared for after the parade! The children will love the surprise 🎃",
    spanishContent: "No necesitan traer bocadillos - ¡tenemos algunos dulces especiales de Halloween preparados para después del desfile! A los niños les encantará la sorpresa 🎃",
    timestamp: "Yesterday 9:50am",
    isTranslated: true,
    isTranslatable: true
  }
];
export const Chat = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [translatedMessages, setTranslatedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine if this is a group chat and set appropriate title
  const isGroupChat = chatId === '2';
  const chatTitle = isGroupChat ? 'Pre-schoolers' : 'Olivia Wilson';

  // Initialize messages when component mounts or chatId changes
  useEffect(() => {
    const initialMessages = isGroupChat ? groupChatMessages : individualChatMessages;
    setMessages(initialMessages);
  }, [isGroupChat]);

  // Auto-scroll to bottom when component mounts or messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSendMessage = (e: React.FormEvent) => {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `Today ${displayHours}:${displayMinutes}${ampm}`;
  };

  // Simple translation function for new messages
  const translateToSpanish = (text: string): string => {
    const translations: Record<string, string> = {
      "Thanks for letting me know!": "¡Gracias por avisarme!",
      "I'll take care of that right away.": "Me encargaré de eso de inmediato.",
      "Perfect, see you soon!": "¡Perfecto, nos vemos pronto!",
      "Got it, thanks! 😊": "¡Entendido, gracias! 😊",
      "No problem at all!": "¡No hay problema!",
      "I appreciate the update.": "Agradezco la actualización.",
      "Okay, I'll be right there.": "Está bien, estaré allí enseguida.",
      "Thank you for the information.": "Gracias por la información.",
      "Sounds good!": "¡Suena bien!",
      "Will do!": "¡Lo haré!"
    };
    return translations[text] || text;
  };
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'sandra',
        content: newMessage.trim(),
        spanishContent: translateToSpanish(newMessage.trim()),
        timestamp: getCurrentTime(),
        isTranslated: false,
        isTranslatable: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Simulate a response after a short delay (for demo purposes)
      if (!isGroupChat) {
        setTimeout(() => {
          const responses = [
            "Thanks for letting me know!",
            "I'll take care of that right away.",
            "Perfect, see you soon!",
            "Got it, thanks! 😊",
            "No problem at all!",
            "I appreciate the update."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'olivia',
            content: randomResponse,
            spanishContent: translateToSpanish(randomResponse),
            timestamp: getCurrentTime(),
            isTranslated: false,
            isTranslatable: true
          };
          
          setMessages(prev => [...prev, responseMsg]);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      }
    }
  };

  const toggleTranslation = (messageId: string) => {
    setTranslatedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };
  const appContent = (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'}`}>
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className={`flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400 ${!shouldShowFrame ? 'hidden' : ''}`}>
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
            onClick={() => navigate('/messages')}
            className="w-6 h-6 p-0"
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </Button>

          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            {chatTitle}
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        <div className="flex flex-col gap-6">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-2">
              {/* Sender Info - only show for other people's messages */}
              {message.sender !== 'sandra' && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage 
                      src={message.avatar || (message.sender === 'olivia' ? "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400" : `${BASE_PATH}avatar-2.png`)} 
                      alt={message.senderName || (message.sender === 'olivia' ? "Olivia Wilson" : "Sandra A.")} 
                    />
                    <AvatarFallback>
                      {message.senderName ? message.senderName.split(' ').map(n => n[0]).join('') : (message.sender === 'olivia' ? 'OW' : 'SA')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                      {message.senderName || (message.sender === 'olivia' ? 'Olivia Wilson' : 'You')}
                    </span>
                    {message.senderRole && (
                      <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                        {message.senderRole}
                      </span>
                    )}
                    {!message.senderRole && message.sender === 'olivia' && (
                      <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                        Employee (Bunnies Room)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className={`max-w-[280px] p-3 rounded-2xl ${
                message.sender === 'sandra'
                  ? 'bg-mfprimaryp-400 text-white ml-auto rounded-br-md' 
                  : 'bg-white text-mfneutralsn-500 rounded-bl-md'
              }`}>
                <p className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                  {translatedMessages.has(message.id) && message.spanishContent 
                    ? message.spanishContent 
                    : message.content}
                </p>
              </div>

              {/* Timestamp and Translation */}
              <div className={`flex items-center gap-2 ${message.sender === 'sandra' ? 'justify-end' : 'justify-start'}`}>
                <span className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
                  {message.timestamp}
                </span>
                {message.isTranslatable && (
                  <button
                    onClick={() => toggleTranslation(message.id)}
                    className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfprimaryp-400 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)] hover:underline cursor-pointer"
                  >
                    {translatedMessages.has(message.id) ? 'Original' : 'Traducir'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-10 h-10 bg-gray-100 border-0 rounded-full font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 w-8 h-8 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 rounded-full"
              disabled={!newMessage.trim()}
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
    </DeviceFrame>
  );
};