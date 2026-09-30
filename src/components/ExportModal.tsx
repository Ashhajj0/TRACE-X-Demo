import React, { useState } from 'react';
import { Candidate } from '../data/candidates';

interface ExportModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ candidate, onClose }) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'fits'>('csv');
  const [copied, setCopied] = useState(false);

  const generateCSV = (): string => {
    const headers = [
      'epoch_id',
      'date',
      'ra_icrs',
      'dec_icrs',
      'displacement_arcsec',
      'flux_ujy',
      'snr',
      'status',
    ];
    const rows = candidate.epochs.map((ep) => [
      ep.id,
      ep.epochDate,
      `"${ep.ra}"`,
      `"${ep.dec}"`,
      ep.displacement,
      ep.flux,
      ep.snr,
      ep.isProjected ? 'PROJECTED' : 'OBSERVED',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const generateJSON = (): string => {
    return JSON.stringify(
      {
        target: candidate.name,
        candidate_id: candidate.id,
        classification: candidate.status,
        proper_motion: candidate.properMotion,
        estimated_distance_au: candidate.distanceEst,
        orbital_inclination: candidate.inclinationEst,
        apparent_magnitude: candidate.apparentMag,
        solver: 'TRACE-X Orbit Engine v2.1',
        pipeline: candidate.pipelineFit,
        residual_rms: candidate.residualRMS,
        epochs: candidate.epochs,
        sed_bands: candidate.sedBands,
        catalog_crossmatch: candidate.catalogs,
      },
      null,
      2
    );
  };

  const generateFITSHeader = (): string => {
    return `SIMPLE  =                    T / file conforms to FITS standard
BITPIX  =                  -32 / IEEE single precision floating point
NAXIS   =                    2 / 2-dimensional image
NAXIS1  =                 1024 / Width in pixels
NAXIS2  =                 1024 / Height in pixels
TELESCOP= 'SPHEREx '           / Spectro-Photometer for History of the Universe
INSTRUME= 'SPHEREx-FPA-1'      / Infrared Focal Plane Array 1
OBJECT  = '${candidate.name.padEnd(20, ' ')}' / Candidate Identifier
EQUINOX =              2000.00 / ICRS J2000 Coordinates
RADESYS = 'ICRS    '           / International Celestial Reference System
CRVAL1  =           68.0175000 / Reference RA [deg]
CRVAL2  =           16.4038889 / Reference Dec [deg]
CDELT1  =          -0.00006111 / Pixel scale X: 0.22 arcsec/px
CDELT2  =           0.00006111 / Pixel scale Y: 0.22 arcsec/px
PMRA    =              -0.1240 / Proper motion RA [arcsec/yr]
PMDEC   =               0.0820 / Proper motion Dec [arcsec/yr]
RESIDRMS=               0.0410 / Astrometric residual RMS [arcsec]
SOLVER  = 'TRACE-X v2.1'       / Orbit engine orbital fitting
END`;
  };

  const content =
    format === 'csv'
      ? generateCSV()
      : format === 'json'
      ? generateJSON()
      : generateFITSHeader();

  const handleDownload = () => {
    const ext = format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'txt';
    const mime =
      format === 'csv'
        ? 'text/csv'
        : format === 'json'
        ? 'application/json'
        : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.id}_astrometry_tracking.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161c27] border border-[#3e484f] rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#1a202b] border-b border-[#3e484f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[20px]">
              download
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#87929a] uppercase tracking-wider">
                Export Scientific Telemetry
              </span>
              <h3 className="font-headline-sm text-sm text-[#dde2f3] font-medium">
                {candidate.name} Astrometric Data
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-[#87929a] hover:text-[#dde2f3] hover:bg-[#242a36] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Format Selectors */}
        <div className="px-5 py-2.5 bg-[#080e19] border-b border-[#3e484f] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-label-sm text-xs">
            <span className="text-[#87929a] text-[11px] uppercase mr-1">Format:</span>
            <button
              onClick={() => setFormat('csv')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                format === 'csv'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'bg-[#1a202b] text-[#bdc8d1] hover:text-white'
              }`}
            >
              CSV Table
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                format === 'json'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'bg-[#1a202b] text-[#bdc8d1] hover:text-white'
              }`}
            >
              JSON Object
            </button>
            <button
              onClick={() => setFormat('fits')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                format === 'fits'
                  ? 'bg-[#38bdf8] text-[#00354a] font-semibold'
                  : 'bg-[#1a202b] text-[#bdc8d1] hover:text-white'
              }`}
            >
              FITS VO-Header
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#2f3541] font-label-sm text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 rounded bg-[#38bdf8] text-[#00354a] hover:bg-[#7bd0ff] font-label-sm text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                download
              </span>
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-auto bg-[#0d131f]">
          <pre className="font-data-display text-xs text-[#8ed5ff] leading-relaxed select-all">
            {content}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-[#1a202b] border-t border-[#3e484f] flex items-center justify-between text-[#87929a] font-label-sm text-[11px]">
          <span>Standardized to ICRS J2000 & NASA PDS4 Archival Compliance</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#2f3541] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
