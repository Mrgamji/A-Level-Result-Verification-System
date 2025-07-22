import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useFirstLogin = () => {
  const { user } = useAuth();
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if this is a first login (you can customize this logic)
      // For example, check if user has a flag indicating first login
      // or if they're using a temporary password
      const firstLoginFlag = localStorage.getItem(`firstLogin_${user.id}`);
      
      if (!firstLoginFlag && user.role === 'institution') {
        // For institutions, assume first login if no flag is set
        setIsFirstLogin(true);
        setShowPasswordModal(true);
      }
    }
  }, [user]);

  const markFirstLoginComplete = () => {
    if (user) {
      localStorage.setItem(`firstLogin_${user.id}`, 'completed');
      setIsFirstLogin(false);
      setShowPasswordModal(false);
    }
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    if (isFirstLogin) {
      markFirstLoginComplete();
    }
  };

  return {
    isFirstLogin,
    showPasswordModal,
    openPasswordModal,
    closePasswordModal,
    markFirstLoginComplete
  };
};