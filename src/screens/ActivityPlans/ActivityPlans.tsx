import { BASE_PATH } from '../../constants';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ActivityDetailOverlay } from "../../components/ActivityDetailOverlay/ActivityDetailOverlay";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";

interface ActivityPlan {
  id: string;
  title: string;
  description?: string;
  icon: string;
  tags?: string[];
  type: 'activity' | 'storytime' | 'music' | 'sensory';
}

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Get current week dates
const getCurrentWeek = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day.getDate());
  }
  
  return week;
};

const getCurrentMonthName = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { month: 'long' });
};

const activityPlans: Record<number, ActivityPlan[]> = {
  // Monday
  1: [
    {
      id: '1',
      title: 'Fingerprint Ladybug Fun',
      icon: '🧸',
      type: 'activity',
      tags: ['Creativity', 'Fine Motor Skills']
    },
    {
      id: '2',
      title: 'Ten Little Ladybugs by Melanie Gerth',
      icon: '📚',
      type: 'storytime'
    },
    {
      id: '3',
      title: 'Music and movement',
      description: '"Fly Like a Butterfly" — flap arms and dance',
      icon: '🎵',
      type: 'music'
    },
    {
      id: '4',
      title: 'Sensory play',
      description: 'Texture cards — soft, bumpy, smooth',
      icon: '🤲',
      type: 'sensory'
    }
  ],
  // Tuesday
  2: [
    {
      id: '5',
      title: 'Bug Hunt Adventure',
      icon: '🧸',
      type: 'activity',
      tags: ['Problem Solving', 'Gross Motor Skills']
    },
    {
      id: '6',
      title: 'The Very Hungry Caterpillar',
      icon: '📚',
      type: 'storytime'
    },
    {
      id: '7',
      title: 'Butterfly Dance',
      description: 'Gentle wing movements with scarves',
      icon: '🎵',
      type: 'music'
    }
  ],
  // Wednesday
  3: [
    {
      id: '8',
      title: 'Butterfly Coffee Filter Art',
      icon: '🧸',
      type: 'activity',
      tags: ['Creativity', 'Science']
    },
    {
      id: '9',
      title: 'Where Butterflies Grow',
      icon: '📚',
      type: 'storytime'
    },
    {
      id: '10',
      title: 'Buzzing Bee Songs',
      description: 'Buzz around the room like busy bees',
      icon: '🎵',
      type: 'music'
    }
  ],
  // Thursday
  4: [
    {
      id: '11',
      title: 'Caterpillar Egg Carton Craft',
      icon: '🧸',
      type: 'activity',
      tags: ['Fine Motor Skills', 'Recycling']
    },
    {
      id: '12',
      title: 'From Caterpillar to Butterfly',
      icon: '📚',
      type: 'storytime'
    }
  ],
  // Friday
  5: [
    {
      id: '13',
      title: 'Garden Bug Exploration',
      icon: '🧸',
      type: 'activity',
      tags: ['Nature', 'Observation Skills']
    },
    {
      id: '14',
      title: 'Ladybug at Orchard Avenue',
      icon: '📚',
      type: 'storytime'
    },
    {
      id: '15',
      title: 'Flutter and Fly',
      description: 'Gentle movements with ribbon streamers',
      icon: '🎵',
      type: 'music'
    }
  ],
  // Weekend days (no activities)
  0: []
};

export const ActivityPlans = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const currentWeek = getCurrentWeek();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Map to our activity plan keys (1-5 for Mon-Fri)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return dayOfWeek;
    }
    return 1; // Default to Monday if weekend
  });
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState('1');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return '🧸';
      case 'storytime':
        return '📚';
      case 'music':
        return '🎵';
      case 'sensory':
        return '🤲';
      default:
        return '🧸';
    }
  };

  const appContent = (
    <>
      <div className={`flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
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
            onClick={() => navigate('/menu')}
            className="w-6 h-6 p-0"
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </Button>

          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            {getCurrentMonthName()}
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Calendar Week View */}
      <div className="bg-mfprimaryp-400 px-6 pb-6">
        <div className="flex items-center justify-between">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="text-white text-sm font-medium opacity-80">
                {day}
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  const dayOfWeek = index + 1; // Convert to 1-7 (Mon-Sun)
                  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                    setSelectedDay(dayOfWeek);
                  } else {
                    setSelectedDay(0); // Use 0 for weekends (no activities)
                  }
                }}
                className={`w-12 h-12 rounded-full text-lg font-medium transition-all duration-200 ${
                  (index + 1 <= 5 && selectedDay === index + 1) || (index + 1 > 5 && selectedDay === 0)
                    ? 'bg-white text-mfprimaryp-400'
                    : index + 1 > 5
                    ? 'text-white/50 bg-white/10 cursor-not-allowed hover:bg-white/10'
                    : 'text-white hover:bg-white/20'
                }`}
                disabled={index + 1 > 5}
              >
                {currentWeek[index]}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 px-6 py-6 ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        {/* Theme Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Theme of the week - Bugs and butterflies
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Dear parents, this week we're looking at bugs and butterflies through simple crafts, stories, and sensory play. It's a fun way to explore nature while helping children build early skills like counting, fine motor control, and language.
          </p>
        </div>

        {/* Activities Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
          {/* Activities Section */}
          {activityPlans[selectedDay]?.filter(activity => activity.type === 'activity').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧸</span>
                <h4 className="font-semibold text-gray-800">Activities</h4>
              </div>
              {activityPlans[selectedDay]?.filter(activity => activity.type === 'activity').map((activity) => (
                <Button
                  key={activity.id}
                  variant="ghost"
                  onClick={() => {
                    setSelectedActivityId(activity.id);
                    setShowActivityDetail(true);
                  }}
                  className="w-full bg-gray-50 rounded-lg p-4 h-auto hover:bg-gray-100 text-left"
                >
                  <div className="w-full">
                    <div className="font-semibold text-gray-800 text-lg mb-3 hover:text-mfprimaryp-400 transition-colors">
                      {activity.title}
                    </div>
                    {activity.tags && (
                      <div className="flex gap-2 flex-wrap">
                        {activity.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-3 py-1 bg-mfprimaryp-400 text-white text-sm font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Storytime Section */}
          {activityPlans[selectedDay]?.filter(activity => activity.type === 'storytime').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <h4 className="font-semibold text-gray-800">Storytime</h4>
              </div>
              {activityPlans[selectedDay]?.filter(activity => activity.type === 'storytime').map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 ml-7">
                  <span className="text-lg">🐞</span>
                  <p className="text-gray-700">{activity.title}</p>
                </div>
              ))}
            </div>
          )}

          {/* Music and movement Section */}
          {activityPlans[selectedDay]?.filter(activity => activity.type === 'music').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎵</span>
                <h4 className="font-semibold text-gray-800">Music and movement</h4>
              </div>
              {activityPlans[selectedDay]?.filter(activity => activity.type === 'music').map((activity) => (
                <div key={activity.id} className="ml-7">
                  <p className="text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sensory play Section */}
          {activityPlans[selectedDay]?.filter(activity => activity.type === 'sensory').length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤲</span>
                <h4 className="font-semibold text-gray-800">Sensory play</h4>
              </div>
              {activityPlans[selectedDay]?.filter(activity => activity.type === 'sensory').map((activity) => (
                <div key={activity.id} className="ml-7">
                  <p className="text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* No activities message */}
          {!activityPlans[selectedDay] && (
            <div className="text-center py-8">
              <p className="text-gray-500">No activities planned for this day</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`bottom-nav flex flex-col max-w-screen-md items-center justify-end px-[9px] py-0 w-full bg-mfneutralsn-0 rounded-[0px_0px_16px_16px] ${!shouldShowFrame ? 'sticky bottom-0 z-50 shadow-lg' : ''}`}>
        <div className="flex items-center gap-[46px] pl-2 pr-4 pt-3 pb-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative flex-1 grow">
            {/* Newsfeed */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Newsfeed"
                src={`${BASE_PATH}navigation.svg`}
              />
            </Button>

            {/* Child Profile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/child-profile')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`${BASE_PATH}infant--girl--profile-picture--caucasian--dark-hair.png`}
                  alt="Child profile"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </Button>

            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Messages"
                src={`${BASE_PATH}navigation-2.svg`}
              />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Notifications"
                src={`${BASE_PATH}navigation-1.svg`}
              />
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/menu')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`${BASE_PATH}avatar-2.png`}
                  alt="Account"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
      </div>

      {showActivityDetail && (
        <ActivityDetailOverlay 
          onClose={() => setShowActivityDetail(false)} 
          activityId={selectedActivityId}
        />
      )}
    </>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
    </DeviceFrame>
  );
};