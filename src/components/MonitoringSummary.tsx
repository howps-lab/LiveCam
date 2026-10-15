import React from 'react';
import { Cctv, RefreshCw, LayoutGrid, Square, Info, Volume2 } from 'lucide-react';

interface MonitoringSummaryProps {
  onRefreshAll: () => void;
  isRefreshing: boolean;
  lastRefreshedTime: string;
  layoutMode: 'grid' | 'single' | 'focus';
  setLayoutMode: (mode: 'grid' | 'single' | 'focus') => void;
  totalCameras: number;
}

export const MonitoringSummary: React.FC<MonitoringSummaryProps> = ({
  onRefreshAll,
  isRefreshing,
  lastRefreshedTime,
  layoutMode,
  setLayoutMode,
  totalCameras,
}) => {
  return (
    <section 
      aria-label="Monitoring Summary" 
      className="w-full bg-[#10192B]/60 border border-[#243149] rounded-2xl p-4 sm:p-5 lg:p-6 backdrop-blur-xs transition-all shadow-lg"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left info column */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1D2A3E] border border-[#243149] text-[#00C6A2] shrink-0 shadow-inner">
            <Cctv className="w-6 h-6 text-[#00C6A2]" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F7FC]">
                Singapore Live ({totalCameras} Cameras)
              </h2>
            </div>

            <p className="text-sm text-[#91A9C8] max-w-3xl leading-relaxed">
              Scroll down to monitor the Haze situation in real time.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs text-[#91A9C8] flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-[#00D9F5]">●</span> Dashboard Synced: <span className="font-mono-numbers text-[#F5F7FC]">{lastRefreshedTime || '--:--:-- SGT'}</span>
              </span>
              <span className="text-[#243149]">|</span>
              <span className="flex items-center gap-1 text-[11px] text-[#91A9C8]">
                <Volume2 className="w-3 h-3 text-[#00D9F5]" aria-hidden="true" />
                Audio muted by default (browser policy) · Unmute anytime in player
              </span>
            </div>
          </div>
        </div>

        {/* Right controls column: Refresh Dashboard + View Layout */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#243149]/60">
          {/* Layout switches */}
          <div className="flex items-center bg-[#1D2A3E] border border-[#243149] rounded-xl p-1 gap-1">
            <button
              onClick={() => setLayoutMode('grid')}
              title="2x2 Grid Layout"
              aria-label="Switch to 2x2 grid layout"
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-[#00C6A2] text-[#030817] shadow-sm font-semibold'
                  : 'text-[#91A9C8] hover:text-[#F5F7FC] hover:bg-[#243149]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid 2×2</span>
            </button>

            <button
              onClick={() => setLayoutMode('single')}
              title="Single Column Stack"
              aria-label="Switch to single column stack"
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                layoutMode === 'single'
                  ? 'bg-[#00C6A2] text-[#030817] shadow-sm font-semibold'
                  : 'text-[#91A9C8] hover:text-[#F5F7FC] hover:bg-[#243149]'
              }`}
            >
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">1-Column</span>
            </button>
          </div>

          {/* Refresh Dashboard button */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C6A2] to-[#00D9F5] hover:brightness-110 active:scale-[0.98] text-[#030817] font-semibold text-sm shadow-[0_0_20px_rgba(0,198,162,0.25)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Refresh Dashboard feeds"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing All...' : 'Refresh Dashboard'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
