import { useEffect, useState } from 'react';

const WELCOME_MODAL_KEY = 'welcome_modal_dismissed';

export interface UseWelcomeModalReturn {
  showModal: boolean;
  dismissModal: () => void;
  resetModal: () => void;
}

export const useWelcomeModal = (): UseWelcomeModalReturn => {
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const isDismissed = localStorage.getItem(WELCOME_MODAL_KEY);
    
    if (!isDismissed) {
      setShowModal(true);
    }
    
    setIsLoaded(true);
  }, []);

  const dismissModal = () => {
    setShowModal(false);
    localStorage.setItem(WELCOME_MODAL_KEY, 'true');
  };

  const resetModal = () => {
    setShowModal(true);
    localStorage.removeItem(WELCOME_MODAL_KEY);
  };

  return {
    showModal: showModal && isLoaded,
    dismissModal,
    resetModal,
  };
};
