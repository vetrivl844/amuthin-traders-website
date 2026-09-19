import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, UserProfile } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  role: 'customer' | 'admin' | 'guest';
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginCustomer: (name: string, phone: string) => Promise<UserProfile>;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: 'customer' | 'admin') => Promise<void>;
  // Modal controllers
  isAuthModalOpen: boolean;
  authModalMode: 'customer' | 'admin';
  openAuthModal: (mode?: 'customer' | 'admin', onComplete?: () => void) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'customer' | 'admin') => void;
  pendingCallback: (() => void) | null;
  executePendingCallback: () => void;
  // Sign Out Modal controllers
  isSignOutModalOpen: boolean;
  openSignOutModal: () => void;
  closeSignOutModal: () => void;
  signOutAndSwitchAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'customer' | 'admin'>('customer');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Sign out modal state
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const openSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(true);
  }, []);

  const closeSignOutModal = useCallback(() => {
    setIsSignOutModalOpen(false);
  }, []);

  useEffect(() => {
    authService.getCurrentUser().then((stored) => {
      setUser(stored);
      setIsLoading(false);
    });
  }, []);

  const openAuthModal = useCallback(
    (mode: 'customer' | 'admin' = 'customer', onComplete?: () => void) => {
      setAuthModalMode(mode);
      if (onComplete) {
        setPendingCallback(() => onComplete);
      } else {
        setPendingCallback(null);
      }
      setIsAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  }, []);

  const executePendingCallback = useCallback(() => {
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  }, [pendingCallback]);

  const loginCustomer = async (name: string, phone: string): Promise<UserProfile> => {
    const updated = await authService.loginCustomer(name, phone);
    setUser(updated);
    setIsAuthModalOpen(false);
    if (pendingCallback) {
      setTimeout(() => {
        pendingCallback();
        setPendingCallback(null);
      }, 50);
    }
    return updated;
  };

  const loginAdmin = async (
    username: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await authService.loginAdmin(username, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      if (pendingCallback) {
        setTimeout(() => {
          pendingCallback();
          setPendingCallback(null);
        }, 50);
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const switchRole = async (role: 'customer' | 'admin') => {
    const updated = await authService.switchRole(role);
    setUser(updated);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsSignOutModalOpen(false);
  };

  const signOutAndSwitchAccount = async () => {
    await authService.logout();
    setUser(null);
    setIsSignOutModalOpen(false);
    setTimeout(() => {
      openAuthModal('customer');
    }, 100);
  };

  const isAuthenticated = Boolean(user && user.id);
  const isAdmin = user?.role === 'admin';
  const role = user?.role || 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        loginCustomer,
        loginAdmin,
        logout,
        switchRole,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        pendingCallback,
        executePendingCallback,
        isSignOutModalOpen,
        openSignOutModal,
        closeSignOutModal,
        signOutAndSwitchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
