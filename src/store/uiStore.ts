import { create } from "zustand";

interface UIState {
  isMobile: boolean;
  mobileMenuOpen: boolean;
  welcomeVisible: boolean;
  exportDialogOpen: boolean;
  presetDialogOpen: boolean;
  projectDialogOpen: boolean;

  setIsMobile: (mobile: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setWelcomeVisible: (visible: boolean) => void;
  setExportDialogOpen: (open: boolean) => void;
  setPresetDialogOpen: (open: boolean) => void;
  setProjectDialogOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobile: false,
  mobileMenuOpen: false,
  welcomeVisible: true,
  exportDialogOpen: false,
  presetDialogOpen: false,
  projectDialogOpen: false,

  setIsMobile: (mobile) => set({ isMobile: mobile }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setWelcomeVisible: (visible) => set({ welcomeVisible: visible }),
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
  setPresetDialogOpen: (open) => set({ presetDialogOpen: open }),
  setProjectDialogOpen: (open) => set({ projectDialogOpen: open }),
}));
