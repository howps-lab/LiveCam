import React from 'react';
import { Video, ShieldCheck, Wind, ExternalLink } from 'lucide-react';
import { SingaporeClock } from './SingaporeClock';

interface DashboardHeaderProps {
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#10192B]/95 backdrop-blur-md border-b border-[#243149] px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C6A2]/20 to-[#00D9F5]/10 border border-[#00C6A2]/40 text-[#00D9F5] shadow-[0_0_15px_rgba(0,198,162,0.15)] shrink-0">
            <Video className="w-5 h-5 text-[#00D9F5]" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F7FC]">
                Singapore Live Cams
              </h1>
              
              {/* Green live-monitoring badge with pulsing indicator */}
              <div 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10D99A]/10 border border-[#10D99A]/30 text-[#10D99A] text-[11px] font-semibold tracking-wide"
                role="status"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D99A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10D99A]"></span>
                </span>
                <span className="uppercase text-[10px] tracking-wider">LIVE MONITORING</span>
              </div>
            </div>

            <p className="text-xs text-[#91A9C8] mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C6A2]" aria-hidden="true" />
              <span>Multi-feed Live Surveillance View</span>
              <span className="text-[#243149]">·</span>
              <span className="hidden sm:inline">Official YouTube Streams</span>
            </p>
          </div>
        </div>

        {/* Right tools: Real-time Singapore Clock + Bright Live Haze Update Button */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto justify-start md:justify-end">
          <SingaporeClock />

          <a
            href="https://haze.sgapp.site/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Singapore Haze Update in a new tab"
            className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[#030817] bg-gradient-to-r from-[#FF7A00] via-[#FFA800] to-[#FFCC00] hover:from-[#FF8A1A] hover:to-[#FFD633] active:scale-[0.98] transition-all duration-200 shadow-[0_0_12px_rgba(255,140,0,0.35)] hover:shadow-[0_0_18px_rgba(255,165,0,0.55)] shrink-0 border border-amber-300/60 select-none"
          >
            <div className="flex items-center justify-center shrink-0">
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DC2626]"></span>
              </span>
              <Wind className="w-3.5 h-3.5 text-[#030817]" aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] font-extrabold tracking-tight">Haze</span>
              <span className="text-[9.5px] font-bold tracking-tight flex items-center gap-0.5">
                Update
                <ExternalLink className="w-2.5 h-2.5 text-[#030817]/85 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};
