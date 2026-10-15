import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface SingaporeClockProps {
  compact?: boolean;
}

export const SingaporeClock: React.FC<SingaporeClockProps> = ({ compact = false }) => {
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format time in 24-hour format HH:mm:ss in Asia/Singapore
      const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      // Format date in dd MMM yyyy in Asia/Singapore
      const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Singapore',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      setTimeString(timeFormatter.format(now));
      setDateString(dateFormatter.format(now));
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono-numbers text-[#91A9C8]">
        <Clock className="w-3.5 h-3.5 text-[#00D9F5]" aria-hidden="true" />
        <span className="font-semibold text-[#F5F7FC]">{timeString || '--:--:--'}</span>
        <span>SGT</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1D2A3E]/70 border border-[#243149] shadow-xs backdrop-blur-xs select-none"
      role="timer"
      aria-live="off"
      aria-label="Current Singapore time and date"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#00C6A2]/10 border border-[#00C6A2]/25 text-[#00D9F5]">
        <Clock className="w-3 h-3 animate-pulse" aria-hidden="true" />
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs sm:text-[13px] font-bold tracking-tight text-[#F5F7FC] font-mono-numbers">
            {timeString || '--:--:--'}
          </span>
          <span className="text-[9px] font-semibold tracking-wide text-[#00D9F5] px-1 py-0.2 rounded bg-[#00D9F5]/10 border border-[#00D9F5]/20">
            SGT
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9.5px] text-[#91A9C8] mt-0.5">
          <span className="font-medium text-[#c4d6ee]">{dateString || '--- -- ----'}</span>
          <span className="text-[#243149]">·</span>
          <span className="text-[8.5px] tracking-wider uppercase text-[#91A9C8]">(SGT UTC +8)</span>
        </div>
      </div>
    </div>
  );
};
