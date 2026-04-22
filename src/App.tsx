import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BASE_PATH } from './constants';
import { useToast } from './hooks/useToast';
import { useDeviceDetection } from './hooks/useDeviceDetection';
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
import { AbsenceOverlay } from './components/AbsenceOverlay/AbsenceOverlay';
import { Toast } from './components/Toast/Toast';

function AppRoutes() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAbsenceOverlay, setShowAbsenceOverlay] = useState(false);

  const handleAddAction = (actionId: string) => {
    setShowAddSheet(false);
    switch (actionId) {
      case 'absence':
      case 'vacation':
      case 'sickness':
        setShowAbsenceOverlay(true);
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'meals':
      case 'checkout':
        showToast('Coming soon', 'info');
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

      {/* Global FAB — fixed, always on top */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-mfprimaryp-400 shadow-elevation-elevation-4 flex items-center justify-center z-[60] active:scale-95 transition-transform"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>

      {/* Global bottom sheet */}
      <GlobalAddSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAction={handleAddAction}
      />

      {/* Absence overlay */}
      {showAbsenceOverlay && (
        <div className="fixed inset-0 z-[90]">
          <AbsenceOverlay type="sick" onClose={() => setShowAbsenceOverlay(false)} />
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </>
  );
}

function App() {
  const { shouldShowFrame } = useDeviceDetection();
  return (
    <BrowserRouter basename={BASE_PATH}>
      <DeviceFrame showFrame={shouldShowFrame}>
        <AppRoutes />
      </DeviceFrame>
    </BrowserRouter>
  );
}

export default App;
