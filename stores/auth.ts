import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialize: () => () => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      loading: true,
      initialize: () => {
        const getSession = async () => {
          const { data } = await supabase.auth.getSession();
          console.log('[Zustand] getSession', data.session?.user);
          set({ user: data.session?.user ?? null, loading: false });
          console.log('[Zustand] set user (getSession)', data.session?.user);
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('[Zustand] onAuthStateChange', session?.user);
          set({ user: session?.user ?? null });
          console.log('[Zustand] set user (onAuthStateChange)', session?.user);
        });

        getSession();

        return () => {
          listener.subscription.unsubscribe();
        };
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        loading: true,
        initialize: state.initialize,
        setUser: state.setUser,
      }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore; 