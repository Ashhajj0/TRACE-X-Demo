import React, { useState, useEffect, useRef } from 'react';
import { Candidate, CANDIDATES, STARFIELD_IMAGE_URL } from '../data/candidates';

interface ObjectTrackingViewProps {
  currentCandidate: Candidate;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenExport: () => void;
  onNavigateToCatalog: () => void;
}

export const ObjectTrackingView: React.FC<ObjectTrackingViewProps> = ({
  currentCandidate,
  onSelectCandidate,
  onOpenExport,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(2); // 0: T1, 1: T2, 2: T3
  const [showProjectedPath, setShowProjectedPath] = useState<boolean>(true);
  const [hoverCoord, setHoverCoord] = useState<{ ra: string; dec: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const epochs = currentCandidate.epochs;
  const observedEpochs = epochs.filter((e) => !e.isProjected);
  const projectedEpoch = epochs.find((e) => e.isProjected);

  // Playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveEpochIndex((prev) => (prev + 1) % observedEpochs.length);
      }, 1100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, observedEpochs.length]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveEpochIndex(0);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setActiveEpochIndex((prev) => (prev + 1) % observedEpochs.length);
  };

  const handleNextCandidate = () => {
    const currentIndex = CANDIDATES.findIndex((c) => c.id === currentCandidate.id);
    const nextCandidate = CANDIDATES[(currentIndex + 1) % CANDIDATES.length];
    onSelectCandidate(nextCandidate);
    setActiveEpochIndex(2);
    setIsPlaying(false);
  };

  // Calculate simulated RA/Dec based on mouse move in viewport
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const xFraction = (e.clientX - rect.left) / rect.width;
    const yFraction = (e.clientY - rect.top) / rect.height;

    // Simulated ICRS coordinates based on field center
    const baseRASeconds = 4.2 - xFraction * 14.0;
    const baseDecSeconds = 50.1 + (1 - yFraction) * 35.0;

    const raStr = `RA 04h 32m ${Math.max(0, baseRASeconds).toFixed(1)}s`;
    const decStr = `Dec +16° 24' ${Math.max(0, baseDecSeconds).toFixed(1)}"`;
    setHoverCoord({ ra: raStr, dec: decStr });
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Subheader Toolbar */}
      <div className="w-full bg-[#161c27] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#3e484f]/40">
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Target Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-[#242a36] hover:bg-[#2f3541] px-3 py-1.5 rounded border border-[#3e484f] transition-colors cursor-pointer select-none"
            >
              <span className="font-label-sm text-[11px] text-[#87929a] uppercase tracking-wider">
                Target:
              </span>
              <span className="font-label-md text-xs text-[#8ed5ff] font-medium">
                {currentCandidate.name}
              </span>
              <span className="px-1 py-0.2 rounded bg-[#080e19] text-[#bdcee7] font-label-sm text-[10px] uppercase">
                {currentCandidate.status}
              </span>
              <span className="material-symbols-outlined text-[#87929a] text-[16px] ml-0.5">
                arrow_drop_down
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#161c27] border border-[#3e484f] rounded shadow-xl z-50 py-1 font-label-sm text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase text-[#87929a] border-b border-[#3e484f]/50">
                  Select Astronomical Candidate
                </div>
                {CANDIDATES.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      onSelectCandidate(cand);
                      setDropdownOpen(false);
                      setActiveEpochIndex(cand.epochs.length > 2 ? 2 : 0);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#242a36] transition-colors cursor-pointer ${
                      cand.id === currentCandidate.id ? 'bg-[#242a36] text-[#8ed5ff]' : 'text-[#dde2f3]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{cand.name}</div>
                      <div className="text-[10px] text-[#87929a]">{cand.properMotion} • {cand.distanceEst}</div>
                    </div>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-[#080e19] text-[#bdcee7]">
                      {cand.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Baseline Badge */}
          <div className="flex items-center gap-1.5 bg-[#1a202b] px-3 py-1.5 rounded border border-[#3e484f]/60">
            <span className="material-symbols-outlined text-[#87929a] text-[16px]">
              history
            </span>
            <span className="font-label-sm text-[11px] text-[#bdc8d1]">
              {currentCandidate.baseline}
            </span>
          </div>
        </div>

        {/* Playback Controls & Projected Path */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-[#080e19] rounded p-0.5 shadow-inner border border-[#3e484f]/50">
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded text-[#bdc8d1] hover:text-[#dde2f3] hover:bg-[#242a36] transition-colors flex items-center gap-1 font-label-sm text-xs cursor-pointer"
              title="Reset to Epoch 1"
            >
              <span className="material-symbols-outlined text-[16px]">skip_previous</span>
              <span>Reset</span>
            </button>

            <button
              onClick={handlePlayToggle}
              className="px-3.5 py-1 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-label-sm text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause' : 'Play Trajectory'}</span>
            </button>

            <button
              onClick={handleStep}
              className="px-2.5 py-1 rounded text-[#bdc8d1] hover:text-[#dde2f3] hover:bg-[#242a36] transition-colors flex items-center gap-1 font-label-sm text-xs cursor-pointer"
              title="Advance one epoch"
            >
              <span className="material-symbols-outlined text-[16px]">skip_next</span>
              <span>Step</span>
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none bg-[#1a202b] px-2.5 py-1.5 rounded border border-[#3e484f]/60">
            <input
              type="checkbox"
              checked={showProjectedPath}
              onChange={(e) => setShowProjectedPath(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-[#242a36] text-[#38bdf8] accent-[#38bdf8] cursor-pointer"
            />
            <span className="font-label-sm text-xs text-[#dde2f3]">Show Projected Path</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Astrometric Viewport & Trajectory Analysis */}
      <div className="w-full px-4 sm:px-6 py-4 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* Left: Viewport (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col rounded bg-[#080e19] shadow-md border border-[#3e484f]/60 overflow-hidden relative min-h-[540px]">
            {/* Viewport Top Bar */}
            <div className="px-3 py-1.5 bg-[#161c27] border-b border-[#3e484f]/50 flex items-center justify-between font-label-sm text-xs text-[#bdc8d1]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8ed5ff] animate-pulse"></span>
                <span className="text-[#dde2f3] font-medium uppercase tracking-wider">
                  Astrometric Motion Viewport
                </span>
                <span className="text-[#87929a]">FO-V: {currentCandidate.fov}</span>
              </div>
              <div className="flex items-center gap-3 font-label-sm text-xs text-[#87929a]">
                <span>{hoverCoord ? hoverCoord.ra : `RA ${currentCandidate.centerRA}`}</span>
                <span>{hoverCoord ? hoverCoord.dec : `Dec ${currentCandidate.centerDec}`}</span>
              </div>
            </div>

            {/* Viewport Canvas Stage */}
            <div
              ref={viewportRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative flex-1 w-full overflow-hidden bg-[#080e19] flex items-center justify-center select-none cursor-crosshair group"
            >
              {/* Starfield Image */}
              <img
                src={STARFIELD_IMAGE_URL}
                alt="Realistic deep-sky astronomical survey starfield"
                className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Tint scrim overlay */}
              <div className="absolute inset-0 bg-[#0d131f]/40 pointer-events-none"></div>

              {/* Coordinate Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundSize: '64px 64px',
                  backgroundImage:
                    'radial-gradient(circle, rgba(142, 213, 255, 0.12) 1px, transparent 1px)',
                }}
              ></div>

              {/* Top Left RA/Dec badge */}
              <div className="absolute top-3 left-3 font-label-sm text-[11px] text-[#87929a] bg-[#080e19]/85 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none border border-[#3e484f]/40">
                RA {currentCandidate.centerRA} 10s • Dec {currentCandidate.centerDec} 00&quot;
              </div>

              {/* Bottom Right Scale badge */}
              <div className="absolute bottom-3 right-3 font-label-sm text-[11px] text-[#87929a] bg-[#080e19]/85 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none border border-[#3e484f]/40">
                Scale: 10 arcsec ━━━
              </div>

              {/* Fixed Stars */}
              {currentCandidate.fixedStars.map((star) => (
                <div
                  key={star.id}
                  className="absolute pointer-events-none flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${star.xPercent}%`, top: `${star.yPercent}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-[#3e484f]/30 border border-[#87929a]/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#dde2f3]/80 shadow-[0_0_4px_#dde2f3]"></div>
                  </div>
                  <span className="mt-1 font-label-sm text-[10px] text-[#87929a] bg-[#080e19]/75 px-1 py-0.2 rounded border border-[#3e484f]/30 whitespace-nowrap">
                    {star.name}
                  </span>
                </div>
              ))}

              {/* SVG Vector Trajectory Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
              >
                <defs>
                  <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8ed5ff" stopOpacity="1" />
                  </linearGradient>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" fillOpacity="0.85" />
                  </marker>
                </defs>

                {/* Vectors between observed epochs */}
                {observedEpochs.map((ep, idx) => {
                  if (idx === observedEpochs.length - 1) return null;
                  const nextEp = observedEpochs[idx + 1];
                  const x1 = (ep.xPercent / 100) * 1000;
                  const y1 = (ep.yPercent / 100) * 600;
                  const x2 = (nextEp.xPercent / 100) * 1000;
                  const y2 = (nextEp.yPercent / 100) * 600;
                  return (
                    <line
                      key={`line-${ep.id}-${nextEp.id}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#vectorGrad)"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                    />
                  );
                })}

                {/* Projected path vector to T4 */}
                {showProjectedPath && projectedEpoch && observedEpochs.length > 0 && (
                  <g className="transition-opacity duration-300 opacity-100">
                    <line
                      x1={(observedEpochs[observedEpochs.length - 1].xPercent / 100) * 1000}
                      y1={(observedEpochs[observedEpochs.length - 1].yPercent / 100) * 600}
                      x2={(projectedEpoch.xPercent / 100) * 1000}
                      y2={(projectedEpoch.yPercent / 100) * 600}
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="3,4"
                      strokeOpacity="0.85"
                      markerEnd="url(#arrow)"
                    />
                  </g>
                )}
              </svg>

              {/* Epoch Markers */}
              {observedEpochs.map((ep, idx) => {
                const isActive = activeEpochIndex === idx;
                const isCurrent = idx === observedEpochs.length - 1; // latest confirmed epoch

                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      setActiveEpochIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                      isActive ? 'z-20 scale-105' : 'z-10'
                    }`}
                    style={{ left: `${ep.xPercent}%`, top: `${ep.yPercent}%` }}
                  >
                    {isCurrent ? (
                      /* Highlighted Reticle for current/latest epoch */
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-10 h-10 rounded-full bg-[#38bdf8]/20 animate-ping pointer-events-none"></span>
                        <div className="w-8 h-8 rounded-full bg-[#080e19]/80 border border-[#38bdf8]/40 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"></div>
                        </div>
                        {/* Crosshair aperture corner ticks */}
                        <div className="absolute -top-1 w-2 h-0.5 bg-[#8ed5ff]"></div>
                        <div className="absolute -bottom-1 w-2 h-0.5 bg-[#8ed5ff]"></div>
                        <div className="absolute -left-1 w-0.5 h-2 bg-[#8ed5ff]"></div>
                        <div className="absolute -right-1 w-0.5 h-2 bg-[#8ed5ff]"></div>
                      </div>
                    ) : (
                      /* Standard marker */
                      <div
                        className={`w-6 h-6 rounded-full bg-[#2f3541]/60 border border-[#8ed5ff]/40 flex items-center justify-center group-hover:scale-125 transition-transform ${
                          isActive ? 'ring-2 ring-[#38bdf8]' : ''
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#7bd0ff] shadow-[0_0_6px_#7bd0ff]"></div>
                      </div>
                    )}

                    {/* Marker Tag */}
                    {isCurrent ? (
                      <div className="mt-2 px-2.5 py-1 rounded bg-[#00799e] text-[#e9f6ff] font-label-sm text-xs shadow flex items-center gap-1.5 whitespace-nowrap border border-[#38bdf8]/40">
                        <span className="font-bold tracking-wider">{ep.name}</span>
                        <span className="text-[#8ed5ff] font-semibold uppercase tracking-wider text-[10px] bg-[#080e19]/60 px-1 py-0.2 rounded">
                          Current
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`mt-1.5 px-2 py-0.5 rounded text-[#dde2f3] font-label-sm text-xs shadow flex items-center gap-1 whitespace-nowrap border border-[#3e484f]/60 ${
                          isActive ? 'bg-[#242a36] text-[#8ed5ff]' : 'bg-[#242a36]/90'
                        }`}
                      >
                        <span className="text-[#8ed5ff] font-bold">{ep.id}</span>
                        <span className="text-[#bdc8d1] font-label-sm text-[11px]">
                          ({ep.epochDate})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Projected T4 Marker */}
              {showProjectedPath && projectedEpoch && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-opacity duration-300 opacity-100"
                  style={{
                    left: `${projectedEpoch.xPercent}%`,
                    top: `${projectedEpoch.yPercent}%`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#8ed5ff]/20 border border-[#8ed5ff]/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8ed5ff]/60"></div>
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-[#080e19]/80 text-[#8ed5ff] font-label-sm text-[10px] whitespace-nowrap border border-[#38bdf8]/30">
                    <span>{projectedEpoch.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Coordinate & Astrometric Lock Status Bar */}
            <div className="px-3 py-2 bg-[#161c27] border-t border-[#3e484f]/50 flex items-center justify-between text-[#87929a] font-label-sm text-xs">
              <div className="flex items-center gap-4">
                <span>Coordinate System: ICRS / J2000</span>
                <span className="hidden sm:inline">Pixel Scale: 0.22″/px</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8ed5ff]">
                <span className="material-symbols-outlined text-[15px]">my_location</span>
                <span>Astrometric Lock: {currentCandidate.id}</span>
              </div>
            </div>
          </div>

          {/* Right: Trajectory Analysis Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Trajectory Analysis Card */}
            <div className="bg-[#161c27] border border-[#3e484f]/60 rounded p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-[#87929a] uppercase tracking-wider">
                    Trajectory Analysis
                  </span>
                  <h2 className="font-headline-sm text-base text-[#dde2f3] font-semibold">
                    {currentCandidate.name}
                  </h2>
                </div>
                <span className="px-2 py-1 rounded bg-[#242a36] text-[#8ed5ff] font-label-sm text-[11px] font-medium flex items-center gap-1 border border-[#3e484f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8ed5ff]"></span>
                  Consistent Motion
                </span>
              </div>

              {/* Epoch Table */}
              <div className="flex flex-col gap-1">
                <div className="text-[#87929a] font-label-sm text-[10px] px-2 py-1 grid grid-cols-12 gap-1 uppercase tracking-wider">
                  <span className="col-span-3">Epoch</span>
                  <span className="col-span-5">Coordinates (RA / Dec)</span>
                  <span className="col-span-4 text-right">Displacement</span>
                </div>

                {observedEpochs.map((ep, idx) => {
                  const isActive = activeEpochIndex === idx;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        setActiveEpochIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`epoch-row px-2.5 py-2 rounded grid grid-cols-12 gap-1 items-center font-label-sm text-xs cursor-pointer transition-colors border ${
                        isActive
                          ? 'bg-[#242a36] border-[#38bdf8]/50 text-[#8ed5ff]'
                          : 'bg-[#1a202b] border-transparent text-[#dde2f3] hover:bg-[#242a36]/60'
                      }`}
                    >
                      <div className="col-span-3 flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-[#38bdf8]' : 'bg-[#7bd0ff]'
                          }`}
                        ></span>
                        <span className={isActive ? 'font-bold text-[#8ed5ff]' : 'font-medium'}>
                          {ep.id} ({ep.shortDate})
                        </span>
                      </div>
                      <div className="col-span-5 font-data-display text-[11px] leading-tight text-[#bdc8d1]">
                        <div className={isActive ? 'text-[#8ed5ff] font-medium' : ''}>{ep.ra}</div>
                        <div className="text-[#87929a]">{ep.dec}</div>
                      </div>
                      <div
                        className={`col-span-4 text-right font-data-display text-[11px] ${
                          ep.displacement === 'Baseline' ? 'text-[#87929a]' : 'text-[#8ed5ff] font-semibold'
                        }`}
                      >
                        {ep.displacement === 'Baseline' ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#080e19] text-[#87929a] text-[10px]">
                            Baseline
                          </span>
                        ) : (
                          ep.displacement
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Proper Motion Confirmation Card */}
              <div className="bg-[#1a202b] p-3 rounded border border-[#3e484f]/50 flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#8ed5ff] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] text-[#dde2f3] font-medium">
                      Linear Proper Motion Confirmed
                    </span>
                    <span className="font-data-display text-lg text-[#8ed5ff]">
                      {currentCandidate.properMotion}
                    </span>
                  </div>
                </div>
                <p className="font-body-sm text-xs text-[#bdc8d1] leading-relaxed">
                  {currentCandidate.description}
                </p>
              </div>

              {/* Orbital Inclination & Apparent Magnitude */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#080e19] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="font-label-sm text-[10px] text-[#87929a] block">
                    Orbital Inclination (Est.)
                  </span>
                  <span className="font-data-display text-sm text-[#dde2f3] font-semibold">
                    {currentCandidate.inclinationEst}
                  </span>
                </div>
                <div className="bg-[#080e19] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="font-label-sm text-[10px] text-[#87929a] block">
                    Apparent Magnitude
                  </span>
                  <span className="font-data-display text-sm text-[#dde2f3] font-semibold">
                    {currentCandidate.apparentMag}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleNextCandidate}
                  className="w-full py-2 px-3 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-label-md text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <span>Track Next Candidate</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => {
                    onOpenExport();
                    setExportNotice('Export modal opened');
                    setTimeout(() => setExportNotice(null), 2000);
                  }}
                  className="w-full py-2 px-3 rounded bg-[#1a202b] text-[#dde2f3] hover:bg-[#242a36] border border-[#3e484f]/60 font-label-md text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{exportNotice || 'Export Tracking Data'}</span>
                </button>
              </div>
            </div>

            {/* Catalog Cross-Match Card */}
            <div className="bg-[#161c27] border border-[#3e484f]/60 rounded p-3.5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between font-label-sm text-[11px] text-[#87929a] uppercase tracking-wider">
                <span>Catalog Cross-Match</span>
                <span className="text-[#bdcee7]">
                  {currentCandidate.catalogs.filter((c) => c.detected).length} /{' '}
                  {currentCandidate.catalogs.length} Catalogs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-label-sm text-xs mt-0.5">
                {currentCandidate.catalogs.map((cat) => (
                  <div
                    key={cat.name}
                    className={`flex items-center gap-1.5 text-xs ${
                      cat.detected ? 'text-[#8ed5ff]' : 'text-[#bdc8d1]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cat.detected ? 'bg-[#38bdf8]' : 'bg-[#87929a]'
                      }`}
                    ></span>
                    <span>
                      {cat.name}: {cat.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Status Bar */}
      <div className="w-full bg-[#161c27] border-t border-[#3e484f]/40 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 font-label-sm text-[11px] text-[#bdc8d1]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="text-[#87929a]">Pipeline:</span>
            <span className="text-[#dde2f3] font-medium">{currentCandidate.pipelineFit}</span>
          </span>
          <span className="text-[#3e484f]">•</span>
          <span className="flex items-center gap-1">
            <span className="text-[#87929a]">Confidence:</span>
            <span className="text-[#8ed5ff] font-bold">{currentCandidate.confidence}</span>
          </span>
          <span className="text-[#3e484f]">•</span>
          <span className="flex items-center gap-1">
            <span className="text-[#87929a]">Status:</span>
            <span className="text-[#8ed5ff] font-medium">Motion Vector Validated</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#87929a]">
          <span>Residual RMS: {currentCandidate.residualRMS}</span>
          <span>•</span>
          <span>Solver: TRACE-X Orbit Engine v2.1</span>
        </div>
      </div>
    </div>
  );
};
