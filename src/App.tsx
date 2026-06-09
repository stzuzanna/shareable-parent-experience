import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BASE_PATH } from './constants';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useHomeTabsVariant } from './hooks/useHomeTabsVariant';
import { DeviceFrame } from './components/DeviceFrame/DeviceFrame';
import { PlusIcon } from 'lucide-react';
import { IphoneProMax } from './screens/IphoneProMax/IphoneProMax';
import { ChildProfile } from './screens/ChildProfile/ChildProfile';
import { AboutPage } from './screens/ChildProfile/components/AboutPage/AboutPage';
import { PermissionsPage } from './screens/ChildProfile/components/PermissionsPage/PermissionsPage';
import { Messages } from './screens/Messages/Messages';
import { Chat } from './screens/Messages/Chat';
import { Menu } from './screens/Menu/Menu';
import { Balance } from './screens/Balance/Balance';
import { ActivityPlans } from './screens/ActivityPlans/ActivityPlans';
import { Notifications } from './screens/Notifications/Notifications';
import { GlobalAddSheet } from './screens/ChildProfile/components/GlobalAddSheet/GlobalAddSheet';
import { FeedbackSheet } from './components/FeedbackSheet/FeedbackSheet';
import { ToastProvider, useAppToast } from './contexts/ToastContext';
import { GlobalUiProvider, useGlobalUi } from './contexts/GlobalUiContext';

function AppRoutes() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const { hideGlobalFab, registerAddSheetOpener } = useGlobalUi();
  const { shouldShowFrame } = useDeviceDetection();
  const tabsVariant = useHomeTabsVariant();
  const overlayPos = shouldShowFrame ? 'absolute' : 'fixed';

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false);

  useEffect(() => {
    registerAddSheetOpener(() => setShowAddSheet(true));
    return () => registerAddSheetOpener(null);
  }, [registerAddSheetOpener]);

  const handleAddAction = (actionId: string) => {
    switch (actionId) {
      case 'add-leave':
        break;
      case 'message':
        setShowAddSheet(false);
        navigate('/messages/chat/1');
        break;
      case 'feedback':
        setShowAddSheet(false);
        setShowFeedbackSheet(true);
        break;
      case 'checkin-pin':
      case 'request-care':
        break;
      case 'meals':
        break;
      case 'check-out':
        setShowAddSheet(false);
        showToast('Coming soon', 'info');
        break;
      default:
        setShowAddSheet(false);
        break;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<IphoneProMax />} />
        <Route path="/index.html" element={<IphoneProMax />} />
        <Route path="/demo/parent" element={<IphoneProMax />} />
        <Route path="/child-profile" element={<ChildProfile />} />
        <Route path="/child-profile/about" element={<AboutPage />} />
        <Route path="/child-profile/about/permissions" element={<PermissionsPage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/chat/:chatId" element={<Chat />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/activity-plans" element={<ActivityPlans />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      {!hideGlobalFab && tabsVariant !== 'pills' && (
        <button
          onClick={() => setShowAddSheet(true)}
          className={`${overlayPos} bottom-24 right-4 w-14 h-14 rounded-full bg-mfprimaryp-400 shadow-elevation-elevation-4 flex items-center justify-center z-[60] active:scale-95 transition-transform`}
        >
          <PlusIcon className="w-6 h-6 text-white" />
        </button>
      )}

      <GlobalAddSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAction={handleAddAction}
        useAbsolute={shouldShowFrame}
      />

      <FeedbackSheet
        isOpen={showFeedbackSheet}
        onClose={() => setShowFeedbackSheet(false)}
        useAbsolute={shouldShowFrame}
      />
    </>
  );
}

function App() {
  const { shouldShowFrame } = useDeviceDetection();
  const overlayPos = shouldShowFrame ? 'absolute' : 'fixed';

  return (
    <BrowserRouter basename={BASE_PATH}>
      <DeviceFrame showFrame={shouldShowFrame}>
        <div className="relative w-full h-full">
          <ToastProvider position={overlayPos}>
            <GlobalUiProvider>
              <AppRoutes />
            </GlobalUiProvider>
          </ToastProvider>
        </div>
      </DeviceFrame>
    </BrowserRouter>
  );
}

export default App;
