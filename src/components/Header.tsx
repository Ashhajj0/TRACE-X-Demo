import React from 'react';

interface HeaderProps {
  currentTab: 'blink-comparator' | 'object-tracking' | 'sky-catalog';
  onSelectTab: (tab: 'blink-comparator' | 'object-tracking' | 'sky-catalog') => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenInfo }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0d131f]/95 backdrop-blur-md border-b border-[#3e484f]">
      <div className="h-14 w-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 font-label-md text-xs tracking-wider shrink-0 select-none">
            <span className="text-[#8ed5ff] font-bold text-sm">TRACE-X</span>
            <span className="text-[#3e484f]">//</span>
            <span className="text-[#dde2f3] font-medium hidden sm:inline">Planet X × SPHEREx</span>
            <span className="px-1.5 py-0.5 rounded bg-[#242a36] text-[#8ed5ff] font-label-sm text-[11px] border border-[#3e484f]">
              [Demo Mode]
            </span>
          </div>

          <nav className="flex items-center gap-1 font-label-sm text-[11px] uppercase tracking-wider shrink-0">
            <button
              onClick={() => onSelectTab('blink-comparator')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'blink-comparator'
                  ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3] hover:bg-[#161c27]'
              }`}
            >
              Blink Comparator
            </button>
            <button
              onClick={() => onSelectTab('object-tracking')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'object-tracking'
                  ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3] hover:bg-[#161c27]'
              }`}
            >
              Object Tracking
            </button>
            <button
              onClick={() => onSelectTab('sky-catalog')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'sky-catalog'
                  ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3] hover:bg-[#161c27]'
              }`}
            >
              Sky Catalog
            </button>
          </nav>
        </div>

        {/* Right: Live Demo Indicator & User Profile / Info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080e19] border border-[#3e484f]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ed5ff] animate-pulse"></span>
            <span className="font-label-sm text-[10px] text-[#8ed5ff] tracking-widest uppercase font-medium">
              Live Demo
            </span>
          </div>

          <button
            onClick={onOpenInfo}
            title="SPHEREx Mission & System Telemetry Info"
            className="w-8 h-8 rounded-full bg-[#8ed5ff] flex items-center justify-center cursor-pointer hover:bg-[#7bd0ff] transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#00354a] text-[18px]">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
