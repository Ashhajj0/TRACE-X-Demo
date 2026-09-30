import React from 'react';

interface MissionModalProps {
  onClose: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161c27] border border-[#3e484f] rounded-lg max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1a202b] border-b border-[#3e484f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-[#87929a] uppercase tracking-wider block">
                NASA Space Apps Challenge 2026
              </span>
              <h2 className="font-headline-sm text-sm text-[#dde2f3] font-medium">
                TRACE-X // Planet X × SPHEREx
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-[#87929a] hover:text-[#dde2f3] hover:bg-[#242a36] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-auto space-y-4 text-xs text-[#bdc8d1] leading-relaxed">
          <div className="bg-[#080e19] p-3.5 rounded border border-[#3e484f]/60 space-y-1.5">
            <div className="flex items-center gap-2 text-[#8ed5ff] font-semibold text-xs font-label-md">
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>The Search for Planet Nine / Outer Trans-Neptunian Bodies</span>
            </div>
            <p>
              Extreme Trans-Neptunian Objects (eTNOs) exhibit unusual clustering in their argument of perihelion and orbital orientations, strongly suggesting gravitational perturbation by an undiscovered massive body (~5–10 Earth masses) at distances between 350 and 600 AU.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-label-sm text-[11px] text-[#8ed5ff] uppercase font-semibold">
              Mission Instrumentation: SPHEREx
            </h4>
            <p>
              NASA&apos;s Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer (SPHEREx) surveys the entire sky in 102 near-infrared bands (0.75 μm – 5.0 μm). Because cold distant planetary bodies radiate their internal heat predominantly in the mid-infrared while remaining nearly invisible in optical surveys (Gaia, Pan-STARRS), SPHEREx provides unprecedented multi-epoch detection sensitivity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded bg-[#1a202b] border border-[#3e484f]/50">
              <span className="font-label-sm text-[10px] text-[#87929a] uppercase block">Astrometric Precision</span>
              <span className="font-data-display text-sm text-[#8ed5ff] font-semibold">0.022″ / px</span>
              <span className="text-[10px] text-[#87929a] block mt-0.5">Centroid fit sub-pixel resolution</span>
            </div>
            <div className="p-3 rounded bg-[#1a202b] border border-[#3e484f]/50">
              <span className="font-label-sm text-[10px] text-[#87929a] uppercase block">Survey Cadence</span>
              <span className="font-data-display text-sm text-[#8ed5ff] font-semibold">6-Month Sweeps</span>
              <span className="text-[10px] text-[#87929a] block mt-0.5">4 baseline all-sky epochs</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-label-sm text-[11px] text-[#8ed5ff] uppercase font-semibold">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#bdc8d1]">
              <li>
                <strong className="text-[#dde2f3]">Object Tracking:</strong> Astrometric vector motion viewport, multi-epoch linear proper motion validation, and orbital inclination constraint solver.
              </li>
              <li>
                <strong className="text-[#dde2f3]">Blink Comparator:</strong> Astronomical blink tool toggling multi-epoch exposures, side-by-side matrices, and difference subtraction imaging.
              </li>
              <li>
                <strong className="text-[#dde2f3]">Sky Catalog:</strong> Multi-band infrared photometry, Keplerian orbital parameters, and catalog cross-matching against Gaia DR3 and CatWISE.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1a202b] border-t border-[#3e484f] flex items-center justify-between text-[#87929a] font-label-sm text-[11px]">
          <span>Designed by Team Red Shift</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#38bdf8] text-[#00354a] font-semibold hover:bg-[#7bd0ff] transition-colors cursor-pointer"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
