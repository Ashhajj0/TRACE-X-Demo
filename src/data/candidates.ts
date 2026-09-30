export interface EpochData {
  id: string;
  name: string;
  epochDate: string;
  shortDate: string;
  ra: string;
  dec: string;
  displacement: string;
  daysDelta: number;
  xPercent: number;
  yPercent: number;
  flux: number;
  snr: number;
  isProjected?: boolean;
}

export interface FixedStar {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  mag: number;
  color: string;
}

export interface CatalogMatch {
  name: string;
  status: string;
  detected: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  status: 'Uncatalogued' | 'Validated' | 'Low SNR' | 'Asteroid FP' | 'KBO Object';
  statusBadge: string;
  baseline: string;
  fov: string;
  centerRA: string;
  centerDec: string;
  constellation: string;
  properMotion: string;
  properMotionVal: number; // in arcsec/year
  distanceEst: string;
  distanceAU: number;
  inclinationEst: string;
  apparentMag: string;
  orbitalPeriodEst: string;
  semiMajorAxis: string;
  confidence: string;
  residualRMS: string;
  description: string;
  pipelineFit: string;
  catalogs: CatalogMatch[];
  epochs: EpochData[];
  fixedStars: FixedStar[];
  sedBands: {
    band: string;
    wavelength: string;
    fluxUJy: number;
    errorUJy: number;
  }[];
}

export const STARFIELD_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1WR_2o8WwPcO_8gY9ALIEI7tf7Un-XkqQRg0Caj0_RZawZTdIrdZNny1NdMMKP0Tqc8YDKE0RDkr_dQPJcqiRDzEYIigyMQSzatxnnBFNbO2pi7S27R0Kz0rvMUGblvpIMnL498WY279lo6PpUoaiKE8Fexxj8qPAweDOt4WFQoX1TDeXRgr2-JmQ7fTzLrUBclgll3-HnQcfONCqcDfJnMTssWBsq-VyZ4-dl7KoNNplcbQggjHUrfWOg';

export const CANDIDATES: Candidate[] = [
  {
    id: 'TX-09',
    name: 'Candidate TX-09',
    status: 'Uncatalogued',
    statusBadge: 'Uncatalogued',
    baseline: 'Baseline: 3 Epochs (Oct 2025 – Jul 2026)',
    fov: "4.8' × 3.2'",
    centerRA: '04h 32m',
    centerDec: "+16° 24'",
    constellation: 'Taurus',
    properMotion: '1.86 arcsec/year',
    properMotionVal: 1.86,
    distanceEst: '> 350 AU',
    distanceAU: 382,
    inclinationEst: '24.6° ± 1.8°',
    apparentMag: '21.8 m_AB',
    orbitalPeriodEst: '~7,450 yr',
    semiMajorAxis: '380 - 440 AU',
    confidence: '94.2%',
    residualRMS: '0.041″',
    pipelineFit: 'Astrometric centroid fit (Point Spread Function 2D Gaussian)',
    description:
      'Apparent angular speed is consistent with a distant, slow-moving outer solar system body (estimated heliocentric distance > 350 AU). Parallax component negligible over 9-month span.',
    catalogs: [
      { name: 'Gaia DR3', status: 'Non-detection', detected: false },
      { name: 'CatWISE', status: 'Below SNR 3σ', detected: false },
      { name: 'Pan-STARRS1', status: 'Null', detected: false },
      { name: 'SPHEREx Band 1', status: 'Detected', detected: true },
    ],
    fixedStars: [
      { id: 'star_a', name: 'Fixed Star A', xPercent: 22, yPercent: 25, mag: 16.2, color: '#dde2f3' },
      { id: 'star_b', name: 'Fixed Star B', xPercent: 82, yPercent: 67, mag: 17.5, color: '#dde2f3' },
      { id: 'star_c', name: 'Field Star C', xPercent: 55, yPercent: 18, mag: 18.9, color: '#94a3b8' },
      { id: 'star_d', name: 'Field Star D', xPercent: 12, yPercent: 78, mag: 19.3, color: '#94a3b8' },
    ],
    epochs: [
      {
        id: 'T1',
        name: 'T1 (14 Oct 2025)',
        epochDate: '14 Oct 2025',
        shortDate: "Oct '25",
        ra: '04h 32m 04.2s',
        dec: "+16° 23' 50.1\"",
        displacement: 'Baseline',
        daysDelta: 0,
        xPercent: 28,
        yPercent: 68.3,
        flux: 42.8,
        snr: 8.4,
      },
      {
        id: 'T2',
        name: 'T2 (02 Mar 2026)',
        epochDate: '02 Mar 2026',
        shortDate: "Mar '26",
        ra: '04h 32m 03.5s',
        dec: "+16° 24' 02.4\"",
        displacement: '+140d: 0.71″',
        daysDelta: 140,
        xPercent: 48,
        yPercent: 50.8,
        flux: 44.1,
        snr: 9.1,
      },
      {
        id: 'T3',
        name: 'T3 (19 Jul 2026)',
        epochDate: '19 Jul 2026',
        shortDate: "Jul '26",
        ra: '04h 32m 02.8s',
        dec: "+16° 24' 15.0\"",
        displacement: '+278d: 1.42″',
        daysDelta: 278,
        xPercent: 68,
        yPercent: 33.3,
        flux: 43.6,
        snr: 8.9,
      },
      {
        id: 'T4',
        name: 'Projected Orbit (T4 - Nov 2026)',
        epochDate: '28 Nov 2026',
        shortDate: "Nov '26",
        ra: '04h 32m 02.1s',
        dec: "+16° 24' 26.2\"",
        displacement: '+410d: 2.10″',
        daysDelta: 410,
        xPercent: 84,
        yPercent: 19.3,
        flux: 43.0,
        snr: 8.5,
        isProjected: true,
      },
    ],
    sedBands: [
      { band: 'SPHEREx 0.75 μm', wavelength: '0.75 μm', fluxUJy: 1.2, errorUJy: 0.2 },
      { band: 'SPHEREx 1.50 μm', wavelength: '1.50 μm', fluxUJy: 3.4, errorUJy: 0.3 },
      { band: 'SPHEREx 2.50 μm', wavelength: '2.50 μm', fluxUJy: 8.9, errorUJy: 0.4 },
      { band: 'SPHEREx 4.00 μm', wavelength: '4.00 μm', fluxUJy: 14.8, errorUJy: 0.6 },
    ],
  },
  {
    id: 'TX-10',
    name: 'Candidate TX-10',
    status: 'Validated',
    statusBadge: 'Confirmed Vector',
    baseline: 'Baseline: 4 Epochs (Aug 2025 – Sep 2026)',
    fov: "5.1' × 3.4'",
    centerRA: '05h 18m',
    centerDec: "+21° 09'",
    constellation: 'Orion',
    properMotion: '1.41 arcsec/year',
    properMotionVal: 1.41,
    distanceEst: '> 460 AU',
    distanceAU: 465,
    inclinationEst: '31.2° ± 2.1°',
    apparentMag: '22.4 m_AB',
    orbitalPeriodEst: '~9,800 yr',
    semiMajorAxis: '450 - 520 AU',
    confidence: '96.8%',
    residualRMS: '0.032″',
    pipelineFit: 'Astrometric centroid fit (Point Spread Function 2D Gaussian + MCMC)',
    description:
      'High ecliptic inclination object with exceptionally low proper motion. Consistent with extreme trans-Neptunian orbital clustering predicted by outer planet dynamical perturbations.',
    catalogs: [
      { name: 'Gaia DR3', status: 'Non-detection', detected: false },
      { name: 'CatWISE', status: 'Non-detection', detected: false },
      { name: 'Pan-STARRS1', status: 'Null', detected: false },
      { name: 'SPHEREx Band 1', status: 'Detected', detected: true },
    ],
    fixedStars: [
      { id: 'star_a', name: 'Reference HD 34812', xPercent: 30, yPercent: 20, mag: 15.8, color: '#dde2f3' },
      { id: 'star_b', name: 'Reference TYC 182-1', xPercent: 75, yPercent: 80, mag: 17.1, color: '#dde2f3' },
      { id: 'star_c', name: 'Field Star E', xPercent: 40, yPercent: 70, mag: 19.0, color: '#94a3b8' },
    ],
    epochs: [
      {
        id: 'T1',
        name: 'T1 (12 Aug 2025)',
        epochDate: '12 Aug 2025',
        shortDate: "Aug '25",
        ra: '05h 18m 22.1s',
        dec: "+21° 08' 44.0\"",
        displacement: 'Baseline',
        daysDelta: 0,
        xPercent: 24,
        yPercent: 74,
        flux: 31.2,
        snr: 7.2,
      },
      {
        id: 'T2',
        name: 'T2 (18 Jan 2026)',
        epochDate: '18 Jan 2026',
        shortDate: "Jan '26",
        ra: '05h 18m 21.6s',
        dec: "+21° 08' 56.2\"",
        displacement: '+159d: 0.58″',
        daysDelta: 159,
        xPercent: 44,
        yPercent: 56,
        flux: 32.0,
        snr: 7.8,
      },
      {
        id: 'T3',
        name: 'T3 (14 Jun 2026)',
        epochDate: '14 Jun 2026',
        shortDate: "Jun '26",
        ra: '05h 18m 21.0s',
        dec: "+21° 09' 08.9\"",
        displacement: '+306d: 1.18″',
        daysDelta: 306,
        xPercent: 64,
        yPercent: 38,
        flux: 31.8,
        snr: 7.5,
      },
      {
        id: 'T4',
        name: 'Projected Orbit (T4 - Nov 2026)',
        epochDate: '05 Nov 2026',
        shortDate: "Nov '26",
        ra: '05h 18m 20.4s',
        dec: "+21° 09' 21.1\"",
        displacement: '+450d: 1.74″',
        daysDelta: 450,
        xPercent: 80,
        yPercent: 22,
        flux: 31.5,
        snr: 7.4,
        isProjected: true,
      },
    ],
    sedBands: [
      { band: 'SPHEREx 0.75 μm', wavelength: '0.75 μm', fluxUJy: 0.8, errorUJy: 0.15 },
      { band: 'SPHEREx 1.50 μm', wavelength: '1.50 μm', fluxUJy: 2.1, errorUJy: 0.25 },
      { band: 'SPHEREx 2.50 μm', wavelength: '2.50 μm', fluxUJy: 5.7, errorUJy: 0.35 },
      { band: 'SPHEREx 4.00 μm', wavelength: '4.00 μm', fluxUJy: 9.9, errorUJy: 0.5 },
    ],
  },
  {
    id: 'TX-14',
    name: 'Candidate TX-14 (Sednoid Class)',
    status: 'Validated',
    statusBadge: 'High Inclination',
    baseline: 'Baseline: 3 Epochs (Nov 2025 – Aug 2026)',
    fov: "4.5' × 3.0'",
    centerRA: '03h 14m',
    centerDec: "+08° 42'",
    constellation: 'Cetus',
    properMotion: '1.15 arcsec/year',
    properMotionVal: 1.15,
    distanceEst: '> 520 AU',
    distanceAU: 524,
    inclinationEst: '48.2° ± 3.4°',
    apparentMag: '23.1 m_AB',
    orbitalPeriodEst: '~12,000 yr',
    semiMajorAxis: '500 - 620 AU',
    confidence: '91.5%',
    residualRMS: '0.048″',
    pipelineFit: 'Astrometric centroid fit (Point Spread Function 2D Gaussian)',
    description:
      'Ultra-distant detached sednoid class body. Extremely low angular displacement consistent with aphelion distance approaching 800 AU.',
    catalogs: [
      { name: 'Gaia DR3', status: 'Non-detection', detected: false },
      { name: 'CatWISE', status: 'Non-detection', detected: false },
      { name: 'Pan-STARRS1', status: 'Null', detected: false },
      { name: 'SPHEREx Band 1', status: 'Detected', detected: true },
    ],
    fixedStars: [
      { id: 'star_a', name: 'Fixed Star Alpha', xPercent: 20, yPercent: 30, mag: 16.8, color: '#dde2f3' },
      { id: 'star_b', name: 'Fixed Star Beta', xPercent: 78, yPercent: 60, mag: 17.9, color: '#dde2f3' },
    ],
    epochs: [
      {
        id: 'T1',
        name: 'T1 (04 Nov 2025)',
        epochDate: '04 Nov 2025',
        shortDate: "Nov '25",
        ra: '03h 14m 15.2s',
        dec: "+08° 41' 58.0\"",
        displacement: 'Baseline',
        daysDelta: 0,
        xPercent: 32,
        yPercent: 65,
        flux: 22.4,
        snr: 6.1,
      },
      {
        id: 'T2',
        name: 'T2 (22 Mar 2026)',
        epochDate: '22 Mar 2026',
        shortDate: "Mar '26",
        ra: '03h 14m 14.8s',
        dec: "+08° 42' 06.2\"",
        displacement: '+138d: 0.44″',
        daysDelta: 138,
        xPercent: 50,
        yPercent: 49,
        flux: 23.1,
        snr: 6.4,
      },
      {
        id: 'T3',
        name: 'T3 (10 Aug 2026)',
        epochDate: '10 Aug 2026',
        shortDate: "Aug '26",
        ra: '03h 14m 14.4s',
        dec: "+08° 42' 14.5\"",
        displacement: '+279d: 0.88″',
        daysDelta: 279,
        xPercent: 68,
        yPercent: 33,
        flux: 22.8,
        snr: 6.2,
      },
      {
        id: 'T4',
        name: 'Projected Orbit (T4 - Dec 2026)',
        epochDate: '15 Dec 2026',
        shortDate: "Dec '26",
        ra: '03h 14m 14.0s',
        dec: "+08° 42' 22.1\"",
        displacement: '+406d: 1.28″',
        daysDelta: 406,
        xPercent: 82,
        yPercent: 20,
        flux: 22.5,
        snr: 6.0,
        isProjected: true,
      },
    ],
    sedBands: [
      { band: 'SPHEREx 0.75 μm', wavelength: '0.75 μm', fluxUJy: 0.4, errorUJy: 0.1 },
      { band: 'SPHEREx 1.50 μm', wavelength: '1.50 μm', fluxUJy: 1.1, errorUJy: 0.2 },
      { band: 'SPHEREx 2.50 μm', wavelength: '2.50 μm', fluxUJy: 3.2, errorUJy: 0.3 },
      { band: 'SPHEREx 4.00 μm', wavelength: '4.00 μm', fluxUJy: 6.4, errorUJy: 0.4 },
    ],
  },
  {
    id: 'TX-04',
    name: 'Candidate TX-04 (Main Belt Fast Interloper)',
    status: 'Asteroid FP',
    statusBadge: 'Fast Asteroid (Non-Planet X)',
    baseline: 'Baseline: 3 Epochs (Oct 2025 – Dec 2025)',
    fov: "6.0' × 4.0'",
    centerRA: '02h 11m',
    centerDec: "+11° 15'",
    constellation: 'Aries',
    properMotion: '28.4 arcsec/year',
    properMotionVal: 28.4,
    distanceEst: '2.8 AU (Main Asteroid Belt)',
    distanceAU: 2.8,
    inclinationEst: '7.1° ± 0.4°',
    apparentMag: '18.4 m_AB',
    orbitalPeriodEst: '4.6 yr',
    semiMajorAxis: '2.77 AU',
    confidence: '99.1% (Classified Asteroid)',
    residualRMS: '0.021″',
    pipelineFit: 'Ephemeris Fit against Minor Planet Center (MPC)',
    description:
      'High proper motion immediately rules out trans-Neptunian origin. Cross-matched with inner Solar System asteroid orbital catalog.',
    catalogs: [
      { name: 'Gaia DR3', status: 'Detection (SNR 24)', detected: true },
      { name: 'CatWISE', status: 'Detected', detected: true },
      { name: 'Pan-STARRS1', status: 'Detected', detected: true },
      { name: 'SPHEREx Band 1', status: 'Detected', detected: true },
    ],
    fixedStars: [
      { id: 'star_a', name: 'Guide Star 112', xPercent: 25, yPercent: 40, mag: 14.5, color: '#dde2f3' },
      { id: 'star_b', name: 'Guide Star 114', xPercent: 70, yPercent: 70, mag: 15.2, color: '#dde2f3' },
    ],
    epochs: [
      {
        id: 'T1',
        name: 'T1 (01 Oct 2025)',
        epochDate: '01 Oct 2025',
        shortDate: "Oct '25",
        ra: '02h 11m 40.0s',
        dec: "+11° 14' 10.0\"",
        displacement: 'Baseline',
        daysDelta: 0,
        xPercent: 20,
        yPercent: 80,
        flux: 320.0,
        snr: 28.4,
      },
      {
        id: 'T2',
        name: 'T2 (01 Nov 2025)',
        epochDate: '01 Nov 2025',
        shortDate: "Nov '25",
        ra: '02h 11m 28.5s',
        dec: "+11° 15' 12.0\"",
        displacement: '+31d: 2.41″',
        daysDelta: 31,
        xPercent: 48,
        yPercent: 48,
        flux: 315.0,
        snr: 27.9,
      },
      {
        id: 'T3',
        name: 'T3 (01 Dec 2025)',
        epochDate: '01 Dec 2025',
        shortDate: "Dec '25",
        ra: '02h 11m 16.0s',
        dec: "+11° 16' 18.0\"",
        displacement: '+61d: 4.88″',
        daysDelta: 61,
        xPercent: 76,
        yPercent: 22,
        flux: 318.0,
        snr: 28.1,
      },
    ],
    sedBands: [
      { band: 'SPHEREx 0.75 μm', wavelength: '0.75 μm', fluxUJy: 84.0, errorUJy: 2.0 },
      { band: 'SPHEREx 1.50 μm', wavelength: '1.50 μm', fluxUJy: 92.0, errorUJy: 2.1 },
      { band: 'SPHEREx 2.50 μm', wavelength: '2.50 μm', fluxUJy: 76.0, errorUJy: 1.8 },
      { band: 'SPHEREx 4.00 μm', wavelength: '4.00 μm', fluxUJy: 68.0, errorUJy: 1.5 },
    ],
  },
  {
    id: 'TX-07',
    name: 'Candidate TX-07 (Sub-Stellar IR Source)',
    status: 'Low SNR',
    statusBadge: 'Cold Brown Dwarf Candidate',
    baseline: 'Baseline: 3 Epochs (Sep 2025 – May 2026)',
    fov: "4.8' × 3.2'",
    centerRA: '06h 45m',
    centerDec: "-02° 14'",
    constellation: 'Monoceros',
    properMotion: '0.92 arcsec/year',
    properMotionVal: 0.92,
    distanceEst: '~18 - 25 pc (Interstellar)',
    distanceAU: 4500,
    inclinationEst: 'Galactic Plane',
    apparentMag: '24.2 m_AB',
    orbitalPeriodEst: 'N/A (Galactic)',
    semiMajorAxis: 'Interstellar',
    confidence: '78.4%',
    residualRMS: '0.062″',
    pipelineFit: 'Point Spread Function with high infrared color temperature fit',
    description:
      'Very strong mid-infrared excess at 4.0 μm with undetectable optical emission. Potential nearby Y-dwarf or cold planetary-mass rogue object.',
    catalogs: [
      { name: 'Gaia DR3', status: 'Non-detection', detected: false },
      { name: 'CatWISE', status: 'Tentative (SNR 2.8σ)', detected: false },
      { name: 'Pan-STARRS1', status: 'Null', detected: false },
      { name: 'SPHEREx Band 1', status: 'Detected', detected: true },
    ],
    fixedStars: [
      { id: 'star_a', name: 'Star Alpha', xPercent: 30, yPercent: 35, mag: 16.5, color: '#dde2f3' },
      { id: 'star_b', name: 'Star Beta', xPercent: 80, yPercent: 65, mag: 17.2, color: '#dde2f3' },
    ],
    epochs: [
      {
        id: 'T1',
        name: 'T1 (18 Sep 2025)',
        epochDate: '18 Sep 2025',
        shortDate: "Sep '25",
        ra: '06h 45m 12.0s',
        dec: "-02° 14' 22.0\"",
        displacement: 'Baseline',
        daysDelta: 0,
        xPercent: 30,
        yPercent: 65,
        flux: 15.2,
        snr: 4.8,
      },
      {
        id: 'T2',
        name: 'T2 (15 Jan 2026)',
        epochDate: '15 Jan 2026',
        shortDate: "Jan '26",
        ra: '06h 45m 11.7s',
        dec: "-02° 14' 16.5\"",
        displacement: '+119d: 0.30″',
        daysDelta: 119,
        xPercent: 49,
        yPercent: 51,
        flux: 15.8,
        snr: 5.1,
      },
      {
        id: 'T3',
        name: 'T3 (20 May 2026)',
        epochDate: '20 May 2026',
        shortDate: "May '26",
        ra: '06h 45m 11.4s',
        dec: "-02° 14' 11.0\"",
        displacement: '+244d: 0.61″',
        daysDelta: 244,
        xPercent: 68,
        yPercent: 36,
        flux: 15.4,
        snr: 4.9,
      },
    ],
    sedBands: [
      { band: 'SPHEREx 0.75 μm', wavelength: '0.75 μm', fluxUJy: 0.1, errorUJy: 0.05 },
      { band: 'SPHEREx 1.50 μm', wavelength: '1.50 μm', fluxUJy: 0.4, errorUJy: 0.1 },
      { band: 'SPHEREx 2.50 μm', wavelength: '2.50 μm', fluxUJy: 2.8, errorUJy: 0.3 },
      { band: 'SPHEREx 4.00 μm', wavelength: '4.00 μm', fluxUJy: 12.4, errorUJy: 0.7 },
    ],
  },
];
