import React, { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>('UTC 2026.10.03 17:07:48');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`UTC ${year}.${month}.${day} ${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#080e19] border-t border-[#3e484f] py-2 px-4 sm:px-6">
      <div className="w-full flex flex-wrap items-center justify-between gap-2 font-label-sm text-[11px] text-[#bdc8d1] tracking-wider">
        <div className="flex items-center gap-2">
          <span>TEAM RED SHIFT</span>
          <span className="text-[#3e484f]">•</span>
          <span>NASA Space Apps Challenge 2026</span>
          <span className="text-[#3e484f]">•</span>
          <span className="text-[#8ed5ff]">TRACE-X Live Demo</span>
        </div>
        <div className="flex items-center gap-4 text-[#87929a]">
          <span className="font-data-display text-[11px] text-[#8ed5ff]/90">SPHEREx V0.8.4</span>
          <span className="text-[#3e484f]">•</span>
          <span className="font-data-display text-[11px]">{utcTime}</span>
        </div>
      </div>
    </footer>
  );
};
