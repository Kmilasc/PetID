import * as React from 'react';
import { View } from 'react-native';
import { Toast, useToast } from './toast';

interface ToastContextType {
  showToast: (props: Parameters<ReturnType<typeof useToast>['showToast']>[0]) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, showToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <View className="absolute bottom-4 left-4 right-4 z-50">
          <Toast {...toast} />
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
} 