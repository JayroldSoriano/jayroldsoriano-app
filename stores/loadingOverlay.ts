import { create } from 'zustand';

type LoadingOverlayState = {
  visible: boolean;
  message?: string;
  show: (message?: string) => void;
  hide: () => void;
};

const useLoadingOverlayStore = create<LoadingOverlayState>((set) => ({
  visible: false,
  message: undefined,
  show: (message) => set({ visible: true, message }),
  hide: () => set({ visible: false, message: undefined }),
}));

export default useLoadingOverlayStore; 