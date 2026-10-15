import React from 'react';
import { Video, ShieldCheck, Radio } from 'lucide-react';
import { SingaporeClock } from './SingaporeClock';
import { SingaporeWeather } from './SingaporeWeather';

interface DashboardHeaderProps {
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#10192B]/95 backdrop-blur-md border-b border-[#243149] px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#00C6A2]/20 to-[#00D9F5]/10 border border-[#00C6A2]/40 text-[#00D9F5] shadow-[0_0_15px_rgba(0,198,162,0.15)] shrink-0">
            <Video className="w-5 h-5 text-[#00D9F5]" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FC]">
                Singapore Downtown Live Cams
              </h1>
              
              {/* Green live-monitoring badge with pulsing indicator */}
              <div 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10D99A]/10 border border-[#10D99A]/30 text-[#10D99A] text-xs font-semibold tracking-wide"
                role="status"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D99A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10D99A]"></span>
                </span>
                <span className="uppercase text-[11px] tracking-wider">LIVE MONITORING</span>
              </div>
            </div>

            <p className="text-xs text-[#91A9C8] mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C6A2]" aria-hidden="true" />
              <span>Multi-feed Downtown Surveillance View</span>
              <span className="text-[#243149]">·</span>
              <span className="hidden sm:inline">Official YouTube Streams</span>
            </p>
          </div>
        </div>

        {/* Right tools: Real-time Clock and Weather */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto justify-start md:justify-end">
          <SingaporeWeather />
          <SingaporeClock />
        </div>
      </div>
    </header>
  );
};
