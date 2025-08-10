// app/components/Toast.tsx
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

type ToastOptions = { type?: 'success' | 'error' | 'info'; duration?: number };

type ToastContextValue = {
  show: (msg: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [msg, setMsg] = useState<string | null>(null);
  const [type, setType] = useState<ToastOptions['type']>('info');
  const opacity = useRef(new Animated.Value(0)).current;

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start(() => setMsg(null));
  }, [opacity]);

  const show = useCallback(
    (m: string, opts?: ToastOptions) => {
      setMsg(m);
      setType(opts?.type ?? 'info');

      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start(() => {
        const delay = opts?.duration ?? 1800;
        setTimeout(hide, delay);
      });
    },
    [hide, opacity]
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {msg && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'fixed' as any, // web
            left: 0,
            right: 0,
            bottom: 24,
            display: 'flex',
            alignItems: 'center',
            opacity,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : 'rgba(17,24,39,0.9)',
              maxWidth: 480,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>{msg}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};