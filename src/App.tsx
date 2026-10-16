import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CAMERAS } from './types/camera';
import { DashboardHeader } from './components/DashboardHeader';
import { MonitoringSummary } from './components/MonitoringSummary';
import { CameraCard } from './components/CameraCard';
import { Info, Shield, Radio, Sparkles } from 'lucide-react';

export default function App() {
  const [globalRefreshTrigger, setGlobalRefreshTrigger] = useState<number>(0);
  const [isRefreshingAll, setIsRefreshingAll] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'single' | 'focus'>('grid');

  // Compute Singapore time string for sync timestamp
  const getSgtTimeString = useCallback(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return `${formatter.format(now)} SGT`;
  }, []);

  // Initialize timestamp on mount
  useEffect(() => {
    setLastRefreshedTime(getSgtTimeString());
  }, [getSgtTimeString]);

  const handleRefreshAll = () => {
    setIsRefreshingAll(true);
    setGlobalRefreshTrigger((prev) => prev + 1);
    setLastRefreshedTime(getSgtTimeString());

    // Provide visual feedback for 700ms
    setTimeout(() => {
      setIsRefreshingAll(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#030817] text-[#F5F7FC] flex flex-col font-sans selection:bg-[#00C6A2]/25 selection:text-[#00D9F5]">
      {/* 3. Dashboard Header */}
      <DashboardHeader onRefreshAll={handleRefreshAll} isRefreshing={isRefreshingAll} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 4. Monitoring Summary Banner */}
        <MonitoringSummary
          onRefreshAll={handleRefreshAll}
          isRefreshing={isRefreshingAll}
          lastRefreshedTime={lastRefreshedTime}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          totalCameras={CAMERAS.length}
        />

        {/* 5. Four-Camera Grid */}
        <section aria-label="Singapore Live Camera Feeds">
          <div
            className={`grid gap-6 ${
              layoutMode === 'single'
                ? 'grid-cols-1 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {CAMERAS.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                dashboardSyncTime={lastRefreshedTime}
                globalRefreshTrigger={globalRefreshTrigger}
              />
            ))}
          </div>
        </section>

        {/* Information & Notice Footer Card */}
        <footer className="w-full bg-[#101A2D]/70 border border-[#243149] rounded-2xl p-4 sm:p-5 text-xs text-[#91A9C8] space-y-2 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243149]/60 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00C6A2]" />
              <span className="font-semibold text-[#F5F7FC]">
                Singapore Live Cams Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10D99A] inline-block animate-pulse"></span>
                <span>Active 24/7 Monitoring Mode</span>
              </span>
              <span className="text-[#243149]">|</span>
              <span>Timezone: Asia/Singapore (UTC+8)</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] pt-1 text-[#91A9C8]">
            <p>
              Video streams are provided via YouTube embedded players from their respective broadcast channels.
              Broadcast availability, frame rate, and streaming resolution are subject to source broadcaster conditions.
            </p>
            <p className="shrink-0 text-[#c4d6ee]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#1D2A3E] border border-[#243149] font-mono-numbers text-[10px]">Fullscreen</kbd> on any camera card for single-feed focus view.
            </p>
          </div>
        </footer>
      </main>
      <Analytics />
    </div>
  );
}
