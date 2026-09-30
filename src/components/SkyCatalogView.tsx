import React, { useState } from 'react';
import { Candidate, CANDIDATES } from '../data/candidates';

interface SkyCatalogViewProps {
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigateToTracking: (candidate: Candidate) => void;
  onNavigateToBlink: (candidate: Candidate) => void;
}

export const SkyCatalogView: React.FC<SkyCatalogViewProps> = ({
  onSelectCandidate,
  onNavigateToTracking,
  onNavigateToBlink,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(CANDIDATES[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCandidates = CANDIDATES.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.constellation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.centerRA.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'uncatalogued'
        ? cand.status === 'Uncatalogued'
        : statusFilter === 'validated'
        ? cand.status === 'Validated'
        : statusFilter === 'kbo'
        ? cand.status === 'KBO Object' || cand.status === 'Validated'
        : statusFilter === 'asteroid'
        ? cand.status === 'Asteroid FP'
        : true;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Subheader Toolbar */}
      <div className="w-full bg-[#161c27] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#3e484f]/40">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-label-md text-xs text-[#dde2f3]">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">
              dataset
            </span>
            <span className="font-semibold text-sm">SPHEREx Sky Survey Candidate Catalog</span>
            <span className="px-1.5 py-0.5 rounded bg-[#242a36] text-[#8ed5ff] font-label-sm text-[11px] border border-[#3e484f]">
              {CANDIDATES.length} Tracked Targets
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#080e19] p-0.5 rounded border border-[#3e484f]/50 font-label-sm text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
            >
              All Targets
            </button>
            <button
              onClick={() => setStatusFilter('uncatalogued')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                statusFilter === 'uncatalogued'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
            >
              Uncatalogued
            </button>
            <button
              onClick={() => setStatusFilter('validated')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                statusFilter === 'validated'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
            >
              Planet X Candidates
            </button>
            <button
              onClick={() => setStatusFilter('asteroid')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                statusFilter === 'asteroid'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
            >
              Asteroids / Interlopers
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search candidate, RA, or constellation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080e19] border border-[#3e484f] rounded px-3 py-1.5 pl-8 font-label-sm text-xs text-[#dde2f3] placeholder-[#87929a] focus:outline-none focus:border-[#38bdf8]"
          />
          <span className="material-symbols-outlined text-[#87929a] text-[16px] absolute left-2.5 top-2">
            search
          </span>
        </div>
      </div>

      {/* Main Catalog Viewport */}
      <div className="w-full px-4 sm:px-6 py-4 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
          {/* Main Table (8 cols or 12 cols if drawer closed) */}
          <div className={`${drawerOpen ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col rounded bg-[#161c27] border border-[#3e484f]/60 shadow-sm overflow-hidden transition-all duration-300`}>
            {/* Table Header */}
            <div className="px-4 py-2.5 bg-[#1a202b] border-b border-[#3e484f]/60 flex items-center justify-between font-label-sm text-xs text-[#87929a]">
              <span>CANDIDATE ASTROMETRIC LOG (EPOCHS 1 - 4)</span>
              <span>ICRS J2000 ASTROMETRIC SOLVER</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-label-sm text-xs border-collapse">
                <thead>
                  <tr className="bg-[#080e19] text-[#87929a] uppercase text-[10px] tracking-wider border-b border-[#3e484f]">
                    <th className="py-2.5 px-3">Candidate ID</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">RA / Dec (J2000)</th>
                    <th className="py-2.5 px-3">Proper Motion (μ)</th>
                    <th className="py-2.5 px-3">Est. Distance</th>
                    <th className="py-2.5 px-3">Magnitude</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e484f]/30">
                  {filteredCandidates.map((cand) => {
                    const isSelected = selectedCandidate.id === cand.id;
                    return (
                      <tr
                        key={cand.id}
                        onClick={() => handleRowClick(cand)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#242a36] text-[#8ed5ff]'
                            : 'hover:bg-[#1a202b] text-[#dde2f3]'
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-xs flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              cand.status === 'Validated'
                                ? 'bg-[#38bdf8]'
                                : cand.status === 'Uncatalogued'
                                ? 'bg-[#7bd0ff]'
                                : cand.status === 'Asteroid FP'
                                ? 'bg-[#fbbf24]'
                                : 'bg-[#87929a]'
                            }`}
                          ></span>
                          <span>{cand.name}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-label-sm ${
                              cand.status === 'Validated'
                                ? 'bg-[#00799e] text-white'
                                : cand.status === 'Uncatalogued'
                                ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f]'
                                : cand.status === 'Asteroid FP'
                                ? 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30'
                                : 'bg-[#080e19] text-[#bdcee7]'
                            }`}
                          >
                            {cand.statusBadge}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-data-display text-[11px] text-[#bdc8d1]">
                          <div>RA {cand.centerRA}</div>
                          <div className="text-[#87929a]">Dec {cand.centerDec}</div>
                        </td>
                        <td className="py-3 px-3 font-data-display text-[#8ed5ff]">
                          {cand.properMotion}
                        </td>
                        <td className="py-3 px-3 font-data-display text-[#dde2f3]">
                          {cand.distanceEst}
                        </td>
                        <td className="py-3 px-3 font-data-display text-[#bdc8d1]">
                          {cand.apparentMag}
                        </td>
                        <td className="py-3 px-3 font-data-display text-[#8ed5ff] font-semibold">
                          {cand.confidence}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                onSelectCandidate(cand);
                                onNavigateToTracking(cand);
                              }}
                              className="px-2 py-1 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-label-sm text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Track Vector in 2D Viewport"
                            >
                              Track
                            </button>
                            <button
                              onClick={() => {
                                onSelectCandidate(cand);
                                onNavigateToBlink(cand);
                              }}
                              className="px-2 py-1 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#2f3541] font-label-sm text-[11px] transition-colors cursor-pointer"
                              title="Inspect in Blink Comparator"
                            >
                              Blink
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-2 bg-[#080e19] border-t border-[#3e484f]/40 flex items-center justify-between text-[#87929a] font-label-sm text-[11px]">
              <span>Showing {filteredCandidates.length} candidate entries</span>
              <span>All observations validated against Gaia DR3 non-detections</span>
            </div>
          </div>

          {/* Right Column: Detailed Candidate Dossier (4 cols when open) */}
          {drawerOpen && (
            <div className="lg:col-span-4 flex flex-col gap-3 rounded bg-[#161c27] border border-[#3e484f]/60 p-4 shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#3e484f]/50">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] text-[#87929a] uppercase tracking-wider">
                    Candidate Dossier
                  </span>
                  <h3 className="font-headline-sm text-sm text-[#dde2f3] font-semibold">
                    {selectedCandidate.name}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[#87929a] hover:text-[#dde2f3] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {/* Physical Properties Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-label-sm">
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Constellation</span>
                  <span className="font-medium text-[#dde2f3]">{selectedCandidate.constellation}</span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Semi-Major Axis</span>
                  <span className="font-data-display text-[#8ed5ff]">{selectedCandidate.semiMajorAxis}</span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Est. Orbital Period</span>
                  <span className="font-data-display text-[#dde2f3]">{selectedCandidate.orbitalPeriodEst}</span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Inclination</span>
                  <span className="font-data-display text-[#8ed5ff]">{selectedCandidate.inclinationEst}</span>
                </div>
              </div>

              {/* Spectral Energy Distribution (SED) 4-band SPHEREx chart */}
              <div className="bg-[#1a202b] p-3 rounded border border-[#3e484f]/50 space-y-2">
                <div className="flex items-center justify-between font-label-sm text-[11px]">
                  <span className="text-[#87929a] uppercase">SPHEREx Infrared SED (Flux μJy)</span>
                  <span className="text-[#8ed5ff]">Mid-IR Excess</span>
                </div>
                <div className="space-y-1.5 font-label-sm text-[11px]">
                  {selectedCandidate.sedBands.map((band) => {
                    const maxFlux = Math.max(...selectedCandidate.sedBands.map((b) => b.fluxUJy), 1);
                    const widthPercent = (band.fluxUJy / maxFlux) * 100;
                    return (
                      <div key={band.band} className="flex flex-col gap-0.5">
                        <div className="flex justify-between text-[10px] text-[#bdc8d1]">
                          <span>{band.band}</span>
                          <span className="font-data-display text-[#8ed5ff]">
                            {band.fluxUJy.toFixed(1)} ± {band.errorUJy} μJy
                          </span>
                        </div>
                        <div className="w-full bg-[#080e19] h-2 rounded overflow-hidden">
                          <div
                            className="bg-[#38bdf8] h-full rounded transition-all duration-500"
                            style={{ width: `${widthPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#080e19] p-3 rounded border border-[#3e484f]/40 text-xs text-[#bdc8d1] leading-relaxed">
                {selectedCandidate.description}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    onSelectCandidate(selectedCandidate);
                    onNavigateToTracking(selectedCandidate);
                  }}
                  className="w-full py-2 px-3 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-label-md text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span>Load into Object Tracking</span>
                </button>
                <button
                  onClick={() => {
                    onSelectCandidate(selectedCandidate);
                    onNavigateToBlink(selectedCandidate);
                  }}
                  className="w-full py-2 px-3 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#2f3541] font-label-md text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">compare</span>
                  <span>Inspect in Blink Comparator</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
