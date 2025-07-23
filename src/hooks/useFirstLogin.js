import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useFirstLogin = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Use isPasswordChanged boolean to determine first login
    const isFirstLogin = (
      user.role?.toLowerCase() === 'institution' &&
      user.isPasswordChanged === false
    );

    if (isFirstLogin) {
      setShowAlert(true);
    }
  }, [user]);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    dismissAlert
  };
};