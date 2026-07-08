import { useEffect } from "react";
import Sidebar from "./Sidebar";
import SettingsPanel from "./SettingsPanel";
import DataCore from "@/components/effects/DataCore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUIStore } from "@/store/uiStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme, sidebarOpen, settingsPanelOpen } = useSettingsStore();
  const { setIsMobile } = useUIStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        useSettingsStore.setState({ sidebarOpen: false, settingsPanelOpen: false });
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 3D Background */}
      <DataCore />

      {/* UI Layer */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Sidebar */}
        <div className="pointer-events-auto">
          <Sidebar />
        </div>

        {/* Settings Panel */}
        <div className="pointer-events-auto">
          <SettingsPanel />
        </div>

        {/* Main Content */}
        <main
          className="h-full transition-all duration-300 pointer-events-auto"
          style={{
            marginLeft: sidebarOpen ? "280px" : "0",
            marginRight: settingsPanelOpen ? "320px" : "0",
          }}
        >
          <div className="h-full liquid-glass-light m-2 rounded-3xl overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
