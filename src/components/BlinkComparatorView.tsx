import React, { useState, useEffect, useRef } from 'react';
import { Candidate, CANDIDATES, STARFIELD_IMAGE_URL } from '../data/candidates';

interface BlinkComparatorViewProps {
  currentCandidate: Candidate;
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigateToTracking: () => void;
}

export const BlinkComparatorView: React.FC<BlinkComparatorViewProps> = ({
  currentCandidate,
  onSelectCandidate,
  onNavigateToTracking,
}) => {
  const [blinkMode, setBlinkMode] = useState<'blink' | 'side-by-side' | 'difference'>('blink');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(0);
  const [blinkSpeedMs, setBlinkSpeedMs] = useState<number>(600); // 600ms per epoch
  const [colorFilter, setColorFilter] = useState<'infrared' | 'negative' | 'thermal'>('infrared');
  const [showTargetReticle, setShowTargetReticle] = useState<boolean>(true);
  const [apertureTarget, setApertureTarget] = useState<{ xPercent: number; yPercent: number; label: string } | null>(null);

  const observedEpochs = currentCandidate.epochs.filter((e) => !e.isProjected);
  const currentEpoch = observedEpochs[activeEpochIndex] || observedEpochs[0];

  // Blinking timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && blinkMode === 'blink') {
      interval = setInterval(() => {
        setActiveEpochIndex((prev) => (prev + 1) % observedEpochs.length);
      }, blinkSpeedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, blinkMode, blinkSpeedMs, observedEpochs.length]);

  // Set default aperture to current candidate epoch
  useEffect(() => {
    if (currentEpoch) {
      setApertureTarget({
        xPercent: currentEpoch.xPercent,
        yPercent: currentEpoch.yPercent,
        label: `${currentCandidate.name} (${currentEpoch.id})`,
      });
    }
  }, [currentCandidate, activeEpochIndex, currentEpoch]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setApertureTarget({
      xPercent: x,
      yPercent: y,
      label: `Aperture (${x.toFixed(1)}%, ${y.toFixed(1)}%)`,
    });
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Subheader Toolbar */}
      <div className="w-full bg-[#161c27] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-[#3e484f]/40">
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#242a36] px-3 py-1.5 rounded border border-[#3e484f]">
            <span className="font-label-sm text-[11px] text-[#87929a] uppercase">Target:</span>
            <span className="font-label-md text-xs text-[#8ed5ff] font-medium">
              {currentCandidate.name}
            </span>
            <span className="px-1 py-0.2 rounded bg-[#080e19] text-[#bdcee7] font-label-sm text-[10px] uppercase">
              {currentCandidate.status}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#080e19] p-0.5 rounded border border-[#3e484f]/50">
            <button
              onClick={() => setBlinkMode('blink')}
              className={`px-3 py-1 rounded font-label-sm text-xs transition-colors cursor-pointer ${
                blinkMode === 'blink'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3]'
              }`}
            >
              Sequential Blink
            </button>
            <button
              onClick={() => {
                setBlinkMode('side-by-side');
                setIsPlaying(false);
              }}
              className={`px-3 py-1 rounded font-label-sm text-xs transition-colors cursor-pointer ${
                blinkMode === 'side-by-side'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3]'
              }`}
            >
              3-Epoch Matrix
            </button>
            <button
              onClick={() => {
                setBlinkMode('difference');
                setIsPlaying(false);
              }}
              className={`px-3 py-1 rounded font-label-sm text-xs transition-colors cursor-pointer ${
                blinkMode === 'difference'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f3]'
              }`}
            >
              Difference (T3 − T1)
            </button>
          </div>
        </div>

        {/* Playback & Speed Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {blinkMode === 'blink' && (
            <>
              <div className="flex items-center bg-[#080e19] rounded p-0.5 border border-[#3e484f]/50">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 rounded bg-[#242a36] text-[#8ed5ff] hover:bg-[#2f3541] font-label-sm text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlaying ? 'Pause Blink' : 'Start Blink'}</span>
                </button>
              </div>

              {/* Epoch Selector Buttons */}
              <div className="flex items-center gap-1 bg-[#1a202b] p-0.5 rounded border border-[#3e484f]/40 font-label-sm text-xs">
                {observedEpochs.map((ep, idx) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setActiveEpochIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      activeEpochIndex === idx
                        ? 'bg-[#38bdf8] text-[#00354a] font-bold'
                        : 'text-[#bdc8d1] hover:text-white'
                    }`}
                  >
                    {ep.id}
                  </button>
                ))}
              </div>

              {/* Blink Rate Slider */}
              <div className="flex items-center gap-2 bg-[#1a202b] px-3 py-1 rounded border border-[#3e484f]/50 font-label-sm text-xs text-[#bdc8d1]">
                <span className="text-[#87929a] text-[10px] uppercase">Rate:</span>
                <input
                  type="range"
                  min="250"
                  max="1200"
                  step="50"
                  value={blinkSpeedMs}
                  onChange={(e) => setBlinkSpeedMs(Number(e.target.value))}
                  className="w-20 accent-[#38bdf8] cursor-pointer"
                />
                <span className="font-data-display text-[11px] text-[#8ed5ff] w-12 text-right">
                  {(1000 / blinkSpeedMs).toFixed(1)} Hz
                </span>
              </div>
            </>
          )}

          {/* Target Reticle Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none bg-[#1a202b] px-2.5 py-1.5 rounded border border-[#3e484f]/60 font-label-sm text-xs text-[#dde2f3]">
            <input
              type="checkbox"
              checked={showTargetReticle}
              onChange={(e) => setShowTargetReticle(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-[#242a36] text-[#38bdf8] accent-[#38bdf8] cursor-pointer"
            />
            <span>Guide Reticle</span>
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 py-4 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* Main Visual Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col rounded bg-[#080e19] border border-[#3e484f]/60 overflow-hidden min-h-[540px]">
            {/* Stage Header */}
            <div className="px-3 py-1.5 bg-[#161c27] border-b border-[#3e484f]/50 flex items-center justify-between font-label-sm text-xs text-[#bdc8d1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[16px]">
                  compare
                </span>
                <span className="text-[#dde2f3] font-medium uppercase tracking-wider">
                  {blinkMode === 'blink'
                    ? `Sequential Blink Stage: ${currentEpoch.name}`
                    : blinkMode === 'side-by-side'
                    ? 'Synchronized 3-Epoch Baseline Matrix'
                    : 'Astrometric Difference Subtraction (T3 - T1)'}
                </span>
              </div>

              {/* Palette Stretch Selector */}
              <div className="flex items-center gap-1.5 font-label-sm text-[11px]">
                <span className="text-[#87929a] hidden sm:inline">Palette:</span>
                <button
                  onClick={() => setColorFilter('infrared')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    colorFilter === 'infrared'
                      ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f]'
                      : 'text-[#87929a] hover:text-[#dde2f3]'
                  }`}
                >
                  SPHEREx IR
                </button>
                <button
                  onClick={() => setColorFilter('negative')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    colorFilter === 'negative'
                      ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f]'
                      : 'text-[#87929a] hover:text-[#dde2f3]'
                  }`}
                >
                  Negative Plate
                </button>
                <button
                  onClick={() => setColorFilter('thermal')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    colorFilter === 'thermal'
                      ? 'bg-[#242a36] text-[#8ed5ff] border border-[#3e484f]'
                      : 'text-[#87929a] hover:text-[#dde2f3]'
                  }`}
                >
                  Thermal Heat
                </button>
              </div>
            </div>

            {/* Stage Body */}
            <div className="relative flex-1 w-full overflow-hidden bg-[#080e19] flex items-center justify-center select-none">
              {/* MODE 1: Sequential Blink View */}
              {blinkMode === 'blink' && (
                <div
                  onClick={handleStageClick}
                  className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                >
                  <img
                    src={STARFIELD_IMAGE_URL}
                    alt="Blink Starfield"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-100 ${
                      colorFilter === 'negative'
                        ? 'invert contrast-125 brightness-90'
                        : colorFilter === 'thermal'
                        ? 'hue-rotate-180 contrast-150 saturate-200'
                        : 'opacity-85'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0d131f]/30 pointer-events-none"></div>

                  {/* Fixed Reference Stars - stationary across all epochs */}
                  {currentCandidate.fixedStars.map((star) => (
                    <div
                      key={star.id}
                      className="absolute pointer-events-none flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${star.xPercent}%`, top: `${star.yPercent}%` }}
                    >
                      <div className="w-5 h-5 rounded-full border border-dashed border-[#87929a]/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/90"></div>
                      </div>
                      <span className="font-label-sm text-[9px] text-[#87929a] bg-[#080e19]/80 px-1 rounded mt-0.5">
                        {star.name} (Stationary)
                      </span>
                    </div>
                  ))}

                  {/* The Moving Target: Changes position based on active epoch! */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                    style={{ left: `${currentEpoch.xPercent}%`, top: `${currentEpoch.yPercent}%` }}
                  >
                    {/* The Target Star Dot */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#38bdf8]/30 animate-ping"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]"></div>
                    </div>

                    {showTargetReticle && (
                      <div className="mt-2 flex flex-col items-center">
                        <div className="w-10 h-10 border border-[#38bdf8] rounded-full absolute -top-3"></div>
                        <div className="px-2 py-0.5 rounded bg-[#00799e] text-white font-label-sm text-[10px] shadow border border-[#38bdf8]">
                          {currentCandidate.name} • {currentEpoch.id}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Epoch Indicator Overlay */}
                  <div className="absolute top-4 left-4 bg-[#080e19]/90 border border-[#38bdf8] px-3 py-1.5 rounded backdrop-blur-sm pointer-events-none">
                    <span className="font-label-sm text-[10px] text-[#87929a] uppercase block">
                      Active Epoch Frame
                    </span>
                    <span className="font-headline-sm text-sm text-[#8ed5ff] font-bold">
                      {currentEpoch.name}
                    </span>
                    <div className="text-[11px] text-[#bdc8d1] font-data-display mt-0.5">
                      {currentEpoch.ra} • {currentEpoch.dec}
                    </div>
                  </div>

                  {/* Clyde Tombaugh Astrometry Note */}
                  <div className="absolute bottom-4 left-4 font-label-sm text-[10px] text-[#87929a] bg-[#080e19]/80 px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none border border-[#3e484f]/40">
                    Astrometric Alignment: Fixed Stars Residual &lt; 0.012″
                  </div>
                </div>
              )}

              {/* MODE 2: Side-by-Side 3-Epoch Matrix */}
              {blinkMode === 'side-by-side' && (
                <div className="grid grid-cols-3 w-full h-full gap-1 p-2 bg-[#080e19]">
                  {observedEpochs.map((ep, idx) => (
                    <div
                      key={ep.id}
                      className="relative h-full rounded border border-[#3e484f] overflow-hidden flex flex-col bg-[#0d131f]"
                    >
                      <div className="px-2 py-1 bg-[#1a202b] border-b border-[#3e484f] font-label-sm text-[11px] text-[#8ed5ff] flex items-center justify-between">
                        <span>{ep.id}</span>
                        <span className="text-[#87929a] text-[10px]">{ep.shortDate}</span>
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <img
                          src={STARFIELD_IMAGE_URL}
                          alt={ep.name}
                          className={`absolute inset-0 w-full h-full object-cover ${
                            colorFilter === 'negative' ? 'invert' : ''
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[#0d131f]/40"></div>

                        {/* Candidate dot in this specific epoch */}
                        <div
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                          style={{ left: `${ep.xPercent}%`, top: `${ep.yPercent}%` }}
                        >
                          <div className="w-7 h-7 rounded-full border border-[#38bdf8] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"></div>
                          </div>
                          <span className="mt-1 font-label-sm text-[9px] bg-[#00799e] text-white px-1 rounded">
                            {ep.displacement}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODE 3: Astrometric Difference (T3 - T1) */}
              {blinkMode === 'difference' && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="relative w-full h-full max-h-[480px] rounded border border-[#38bdf8]/40 overflow-hidden bg-[#0d131f] flex items-center justify-center">
                    <img
                      src={STARFIELD_IMAGE_URL}
                      alt="Difference starfield"
                      className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-200 opacity-20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#080e19]/90"></div>

                    {/* Negative dipole at T1 */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{
                        left: `${observedEpochs[0].xPercent}%`,
                        top: `${observedEpochs[0].yPercent}%`,
                      }}
                    >
                      <div className="w-6 h-6 rounded-full border border-dashed border-[#f87171] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#f87171]"></div>
                      </div>
                      <span className="font-label-sm text-[9px] text-[#f87171] bg-[#080e19] px-1 rounded mt-1 border border-[#f87171]/40">
                        Negative Dipole (T1 Baseline)
                      </span>
                    </div>

                    {/* Positive dipole at T3 */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{
                        left: `${observedEpochs[2].xPercent}%`,
                        top: `${observedEpochs[2].yPercent}%`,
                      }}
                    >
                      <div className="w-7 h-7 rounded-full border border-[#38bdf8] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"></div>
                      </div>
                      <span className="font-label-sm text-[9px] text-[#38bdf8] bg-[#00799e] text-white px-1.5 py-0.2 rounded mt-1">
                        Positive Dipole (T3 Detection)
                      </span>
                    </div>

                    {/* Connecting dipole displacement vector */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
                      <line
                        x1={(observedEpochs[0].xPercent / 100) * 1000}
                        y1={(observedEpochs[0].yPercent / 100) * 600}
                        x2={(observedEpochs[2].xPercent / 100) * 1000}
                        y2={(observedEpochs[2].yPercent / 100) * 600}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                    </svg>

                    <div className="absolute top-4 left-4 bg-[#080e19]/90 border border-[#3e484f] p-3 rounded">
                      <span className="font-label-sm text-[10px] text-[#87929a] uppercase block">
                        Residual Image Metric
                      </span>
                      <span className="font-data-display text-sm text-[#8ed5ff]">
                        Net Proper Displacement: +1.42″
                      </span>
                      <p className="text-[11px] text-[#bdc8d1] max-w-sm mt-1">
                        Fixed stars cancel to background noise RMS = 0.041″. Only real moving sources persist as characteristic bipolar difference signatures.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Bottom Bar */}
            <div className="px-3 py-2 bg-[#161c27] border-t border-[#3e484f]/50 flex items-center justify-between text-[#87929a] font-label-sm text-xs">
              <div>Survey: SPHEREx Band 1 (0.75 μm) All-Sky Cadence</div>
              <div className="text-[#8ed5ff]">Astrometric Blink Calibration: PASSED</div>
            </div>
          </div>

          {/* Right Column: Aperture Photometry & Analysis (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Aperture Photometry Card */}
            <div className="bg-[#161c27] border border-[#3e484f]/60 rounded p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-[#87929a] uppercase tracking-wider">
                    Instrument Photometry
                  </span>
                  <h3 className="font-headline-sm text-sm text-[#dde2f3] font-semibold">
                    Aperture Extraction (r = 3.5 px)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#080e19] text-[#8ed5ff] font-label-sm text-[11px] border border-[#3e484f]">
                  SNR: {currentEpoch.snr}σ
                </span>
              </div>

              {/* Photometry Readings */}
              <div className="grid grid-cols-2 gap-2 font-label-sm text-xs">
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Integrated Flux</span>
                  <span className="font-data-display text-sm text-[#8ed5ff]">
                    {currentEpoch.flux.toFixed(1)} μJy
                  </span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Sky Background</span>
                  <span className="font-data-display text-sm text-[#dde2f3]">
                    1.42 ± 0.08 μJy/px
                  </span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">FWHM Gaussian Fit</span>
                  <span className="font-data-display text-sm text-[#dde2f3]">1.82″ (Diffraction)</span>
                </div>
                <div className="bg-[#1a202b] p-2.5 rounded border border-[#3e484f]/40">
                  <span className="text-[10px] text-[#87929a] block uppercase">Centroid Uncertainty</span>
                  <span className="font-data-display text-sm text-[#8ed5ff]">± 0.018″</span>
                </div>
              </div>

              {/* Physical Interpretation */}
              <div className="bg-[#1a202b] p-3 rounded border border-[#3e484f]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#8ed5ff] font-label-sm text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Blink Test Confirmation</span>
                </div>
                <p className="text-xs text-[#bdc8d1] leading-relaxed">
                  Target candidate shows genuine translational motion across consecutive 6-month survey sweeps. Static reference stars A and B show zero net displacement, validating instrument pointing stability.
                </p>
              </div>

              {/* Action: Transfer to Trajectory Tracking */}
              <button
                onClick={onNavigateToTracking}
                className="w-full py-2.5 px-3 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-label-md text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Analyze Orbit Vector in Tracking View</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Historical Technique Context */}
            <div className="bg-[#161c27] border border-[#3e484f]/60 rounded p-3.5 shadow-sm space-y-2">
              <span className="font-label-sm text-[10px] text-[#87929a] uppercase tracking-wider block">
                Historical Context & Discovery Method
              </span>
              <p className="text-xs text-[#bdc8d1] leading-relaxed">
                The optical blink comparator was invented by Carl Pulfrich in 1904 and famously utilized by Clyde Tombaugh in 1930 to discover Pluto at Lowell Observatory. In TRACE-X, the method is combined with infrared multi-band spectrophotometry from SPHEREx.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
