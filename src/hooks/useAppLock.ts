import { useState, useEffect, useCallback } from 'react';

export type LockTimeout = 'immediate' | '1min' | '5min' | '15min';

const TIMEOUT_MS: Record<LockTimeout, number> = {
  immediate: 0,
  '1min': 60000,
  '5min': 300000,
  '15min': 900000,
};

export const useAppLock = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [lockTimeout, setLockTimeout] = useState<LockTimeout>('immediate');
  const [rememberDevice, setRememberDevice] = useState(false);

  useEffect(() => {
    const savedTimeout = localStorage.getItem('appLockTimeout') as LockTimeout;
    const savedRemember = localStorage.getItem('rememberDevice') === 'true';
    
    if (savedTimeout) setLockTimeout(savedTimeout);
    if (savedRemember) setRememberDevice(true);
  }, []);

  const unlock = () => {
    setIsLocked(false);
    setLastActiveTime(Date.now());
  };

  const updateTimeout = (timeout: LockTimeout) => {
    setLockTimeout(timeout);
    localStorage.setItem('appLockTimeout', timeout);
  };

  const updateRememberDevice = (remember: boolean) => {
    setRememberDevice(remember);
    localStorage.setItem('rememberDevice', remember.toString());
  };

  return {
    isLocked,
    lockTimeout,
    rememberDevice,
    unlock,
    updateTimeout,
    updateRememberDevice,
  };
};
