import React from 'react';

const trashSvgClass = "w-24 h-24 md:w-32 md:h-32 overflow-visible drop-shadow-[0_14px_12px_rgba(0,0,0,0.34)]";

const GroundShadow = ({ cx = 50, cy = 90, rx = 28, ry = 7, opacity = 0.2 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#111827" opacity={opacity} />
);

// ==========================================
// ORGANIK
// ==========================================

export const AppleCore = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow />
    <g transform="rotate(-9 50 50)">
      <path d="M46 19 C50 13 58 13 63 19 C60 23 54 25 50 25 C47 25 43 23 40 20 C30 7 17 15 19 28 C20 40 33 39 42 32 C46 29 50 27 54 30 C64 39 80 38 82 26 C84 13 68 7 58 20" fill="#ef4444" />
      <path d="M39 23 C46 18 56 18 62 25 C60 38 58 54 58 72 C58 82 53 89 48 88 C43 87 40 80 40 71 C40 55 38 38 39 23 Z" fill="#f8fafc" />
      <path d="M45 25 C50 20 57 22 59 29 C55 35 45 35 41 29 C42 27 43 26 45 25 Z" fill="#fff7ed" />
      <path d="M41 72 C32 69 21 72 20 81 C19 91 34 94 45 82 C48 78 50 77 54 81 C65 94 82 91 80 80 C78 70 66 69 58 73 C55 78 51 83 47 83 C44 83 42 78 41 72 Z" fill="#dc2626" />
      <path d="M42 22 C34 14 25 16 23 25" stroke="#fca5a5" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M57 20 C58 13 62 7 69 9" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M62 10 C70 5 76 8 78 15 C70 17 64 15 62 10 Z" fill="#22c55e" />
      <path d="M45 42 C48 39 51 42 49 45 C47 47 43 45 45 42 Z M51 56 C54 53 57 56 55 59 C53 61 49 59 51 56 Z M44 67 C47 64 50 67 48 70 C46 72 42 70 44 67 Z" fill="#713f12" opacity="0.9" />
      <path d="M47 32 C44 45 44 63 47 78" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
    </g>
  </svg>
);

export const BananaPeel = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={30} ry={6} />
    <g transform="rotate(8 50 54)">
      <path d="M45 13 C49 6 56 7 60 14 C57 19 51 22 46 19 Z" fill="#65a30d" />
      <path d="M50 20 C68 43 79 63 86 86 C76 89 63 82 59 72 C56 61 53 39 50 20 Z" fill="#facc15" />
      <path d="M50 21 C38 41 28 64 16 86 C27 89 39 82 42 72 C45 61 48 38 50 21 Z" fill="#eab308" />
      <path d="M50 21 C53 42 55 64 53 90 C46 89 42 83 44 74 C47 61 50 39 50 21 Z" fill="#fef08a" />
      <path d="M61 70 C70 77 76 80 84 82" stroke="#fde047" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <path d="M40 70 C30 78 23 82 16 83" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M49 29 C50 49 50 68 49 84" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="67" cy="62" r="3" fill="#92400e" opacity="0.75" />
      <circle cx="34" cy="70" r="2.5" fill="#78350f" opacity="0.65" />
      <path d="M58 19 C55 24 48 25 44 20" stroke="#bef264" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const DryLeaf = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow cx={49} cy={88} rx={27} />
    <g transform="rotate(-17 50 50)">
      <path d="M50 86 C50 74 42 69 33 61 C20 50 16 36 25 20 C40 15 55 19 65 29 C78 42 79 61 62 75 C57 80 53 83 50 86 Z" fill="#ca8a04" />
      <path d="M28 22 C36 20 46 24 54 31 C42 32 31 39 24 51 C20 40 21 30 28 22 Z" fill="#f59e0b" opacity="0.85" />
      <path d="M52 83 C50 65 48 45 31 23" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M47 60 C40 55 33 50 26 48 M49 50 C56 45 63 39 69 33 M43 39 C38 35 32 31 27 29 M54 67 C61 64 66 60 70 55" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M31 25 C46 23 67 43 67 59" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M50 86 C49 91 47 94 43 96" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="58" cy="36" r="2" fill="#a16207" opacity="0.8" />
      <circle cx="38" cy="57" r="2.5" fill="#854d0e" opacity="0.65" />
    </g>
  </svg>
);

export const FishBone = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow cy={77} rx={34} ry={5} opacity={0.15} />
    <g transform="rotate(11 50 50)">
      <path d="M17 52 C11 48 8 44 6 39 C16 38 22 42 27 50 C22 58 15 62 6 61 C8 57 12 54 17 52 Z" fill="#cbd5e1" />
      <path d="M25 51 C38 47 61 47 79 50" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
      <path d="M78 50 C84 40 94 40 94 50 C94 60 84 61 78 50 Z" fill="#e2e8f0" />
      <circle cx="86" cy="48" r="2" fill="#0f172a" />
      <path d="M33 50 C31 43 28 38 23 34 M33 52 C31 59 28 64 23 68 M48 49 C47 40 43 34 39 29 M48 52 C47 61 44 68 40 73 M63 50 C62 42 59 37 54 33 M63 52 C63 59 61 64 57 69" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M27 48 C42 46 61 46 75 49" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M84 46 C87 47 89 49 91 51" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </g>
  </svg>
);


// ==========================================
// NON-ORGANIK
// ==========================================

export const PlasticBottle = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={24} />
    <g transform="rotate(8 50 52)">
      <rect x="42" y="8" width="18" height="9" rx="3" fill="#2563eb" />
      <rect x="44" y="17" width="14" height="9" rx="2" fill="#bfdbfe" opacity="0.85" />
      <path d="M43 25 C42 31 33 35 30 44 C26 57 29 74 32 86 C39 91 58 93 70 86 C72 72 75 57 70 44 C67 35 58 31 57 25 Z" fill="#93c5fd" opacity="0.62" />
      <path d="M36 45 C45 40 57 40 66 45 L67 61 C59 66 41 65 33 60 Z" fill="#dbeafe" opacity="0.7" />
      <path d="M34 72 C44 77 58 77 68 72" stroke="#eff6ff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M36 50 C45 55 55 47 66 52 M33 63 C43 58 55 68 69 62" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M40 33 C35 47 35 70 39 84" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.52" />
      <path d="M58 31 C66 44 68 66 63 84" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.25" />
      <path d="M44 12 H58" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </g>
  </svg>
);

export const SodaCan = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={25} />
    <g transform="rotate(-7 50 50)">
      <path d="M34 21 C43 15 58 15 67 21 C70 38 70 62 66 81 C57 88 42 88 32 81 C31 62 30 38 34 21 Z" fill="#ef4444" />
      <path d="M37 18 C45 12 58 12 65 18 C62 24 40 25 34 20 C35 19 36 18 37 18 Z" fill="#e5e7eb" />
      <path d="M32 80 C42 84 56 84 66 80 L64 87 C56 93 41 92 34 86 Z" fill="#94a3b8" />
      <path d="M39 30 C48 35 56 26 65 32 L66 50 C56 43 47 56 35 49 Z" fill="#f97316" opacity="0.92" />
      <path d="M35 54 C44 62 55 44 66 54" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M39 20 C49 23 57 22 64 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M40 27 C35 43 36 65 39 79" stroke="#fecaca" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M49 16 C55 15 59 16 60 19 C55 20 51 20 47 18 Z" fill="#64748b" />
      <path d="M47 18 C48 14 53 13 57 15" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="63" cy="69" r="2.5" fill="#991b1b" opacity="0.45" />
    </g>
  </svg>
);

export const PlasticBag = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow cy={91} rx={31} />
    <g transform="rotate(5 50 56)">
      <path d="M31 39 C27 50 22 71 27 89 C38 96 63 96 75 88 C79 70 74 50 69 39 C63 43 56 46 49 45 C42 44 36 42 31 39 Z" fill="#e5e7eb" opacity="0.88" />
      <path d="M31 39 C24 27 27 19 38 24 C42 27 40 35 38 43 C35 42 33 41 31 39 Z" fill="#f8fafc" opacity="0.92" />
      <path d="M69 39 C77 27 74 19 63 24 C59 27 60 36 62 43 C65 42 67 41 69 39 Z" fill="#cbd5e1" opacity="0.9" />
      <path d="M35 43 C44 49 57 49 66 42" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M36 58 C45 54 55 64 65 59 M34 74 C44 82 57 80 69 72" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M42 50 C39 62 39 78 43 88 M60 48 C65 62 63 79 58 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" />
      <circle cx="51" cy="66" r="11" stroke="#60a5fa" strokeWidth="3" fill="#dbeafe" opacity="0.55" />
      <path d="M44 66 H58 M51 59 V73" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
    </g>
  </svg>
);

export const CoffeeCup = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={24} />
    <g transform="rotate(-6 50 53)">
      <path d="M28 28 C39 22 62 22 73 28 L68 84 C59 91 41 91 34 84 Z" fill="#fff7ed" />
      <path d="M28 28 C40 34 61 34 73 28 L71 21 C59 14 41 14 29 21 Z" fill="#f1f5f9" />
      <path d="M34 50 C43 56 58 56 68 50 L66 67 C57 73 42 73 35 67 Z" fill="#92400e" />
      <path d="M35 53 C44 58 58 58 67 53" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M38 32 C35 48 36 68 40 83" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M64 33 C65 47 64 67 61 83" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M43 17 C43 10 49 9 50 4 C55 10 49 12 51 17 M55 17 C56 10 62 10 62 4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M36 21 C46 24 57 24 67 21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx="57" cy="62" r="2" fill="#78350f" opacity="0.5" />
    </g>
  </svg>
);


// ==========================================
// B3 (BERBAHAYA & BERACUN)
// ==========================================

export const UsedBattery = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={23} />
    <g transform="rotate(7 50 52)">
      <rect x="41" y="11" width="18" height="8" rx="2" fill="#475569" />
      <path d="M34 19 C43 16 58 16 67 20 L65 84 C58 91 42 91 35 84 Z" fill="#111827" />
      <path d="M35 50 C43 54 57 54 66 50 L65 84 C58 91 42 91 35 84 Z" fill="#eab308" />
      <path d="M40 30 C46 27 56 27 61 30 L60 42 C54 45 45 45 39 42 Z" fill="#f8fafc" opacity="0.9" />
      <path d="M53 31 L45 39 H50 L47 48 L58 36 H52 Z" fill="#ef4444" />
      <path d="M40 55 C46 59 56 59 62 55" stroke="#fde047" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M40 22 C37 40 38 65 41 82" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M45 84 C43 92 48 98 54 95 C58 93 57 88 55 85" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M48 91 C51 90 53 91 55 94" stroke="#86efac" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  </svg>
);

export const BrokenBulb = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={25} />
    <g transform="rotate(-8 50 52)">
      <path d="M40 68 L61 68 L58 84 C52 91 44 90 41 84 Z" fill="#94a3b8" />
      <path d="M41 72 H60 M42 77 H59 M43 82 H57" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 69 C35 60 28 55 27 43 C26 28 38 18 51 15 C66 21 72 34 66 47 C62 55 58 59 58 68 Z" fill="#e0f2fe" opacity="0.76" />
      <path d="M51 15 L45 31 L57 34 L40 51 L49 45 L45 63" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />
      <path d="M45 68 L45 51 M56 68 L56 47 M45 51 C49 46 52 47 56 47" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 43 C33 29 43 22 51 19" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M71 23 L78 16 M74 34 L84 31 M29 23 L22 17" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <path d="M64 49 L76 53 L66 59" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  </svg>
);

export const Insecticide = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={25} />
    <g transform="rotate(6 50 52)">
      <path d="M37 30 C45 27 56 27 64 30 L67 84 C58 91 43 91 34 84 Z" fill="#c2410c" />
      <path d="M40 21 H61 L63 31 C56 35 45 35 38 31 Z" fill="#ea580c" />
      <path d="M45 15 H57 L58 21 H44 Z" fill="#111827" />
      <rect x="49" y="8" width="5" height="8" rx="2" fill="#94a3b8" />
      <path d="M35 45 C44 49 57 49 66 45 L66 66 C57 70 42 70 35 66 Z" fill="#fef08a" />
      <circle cx="50" cy="55" r="6" fill="#111827" />
      <path d="M41 62 H59 M43 49 L57 63 M57 49 L43 63" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M41 35 C38 50 39 68 42 82" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M61 34 C64 48 64 66 60 83" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <circle cx="68" cy="14" r="3" fill="#86efac" />
      <circle cx="78" cy="17" r="4" fill="#86efac" opacity="0.7" />
      <circle cx="87" cy="10" r="5" fill="#86efac" opacity="0.4" />
      <path d="M65 18 C73 21 80 23 88 22" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  </svg>
);

export const ChemicalBottle = () => (
  <svg viewBox="0 0 100 100" className={trashSvgClass}>
    <GroundShadow rx={25} />
    <g transform="rotate(-5 50 52)">
      <rect x="43" y="9" width="15" height="11" rx="2" fill="#334155" />
      <path d="M44 20 H57 V34 C65 39 72 48 72 58 V85 C62 92 39 92 29 85 V58 C29 48 36 39 44 34 Z" fill="#a855f7" opacity="0.88" />
      <path d="M33 55 C42 61 59 61 68 55 V82 C59 88 41 88 33 82 Z" fill="#7e22ce" opacity="0.8" />
      <path d="M36 61 C45 65 56 65 65 61 L65 76 C56 80 45 80 36 76 Z" fill="#f8fafc" opacity="0.9" />
      <path d="M50 64 L44 74 H57 Z" fill="#111827" />
      <path d="M36 48 C45 53 57 53 66 48" stroke="#f3e8ff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx="48" cy="40" r="4" fill="#d8b4fe" />
      <circle cx="57" cy="35" r="2.5" fill="#f5d0fe" />
      <circle cx="42" cy="51" r="2" fill="#f5d0fe" opacity="0.8" />
      <path d="M38 42 C34 54 35 72 39 84" stroke="#e9d5ff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M59 22 H44" stroke="#64748b" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </g>
  </svg>
);

export const TRASH_TYPES = [
  // Organik
  { id: 'organik-apple', category: 'Organik', Component: AppleCore, name: 'Sisa Apel', description: 'Sisa apel bekas gigitan yang cepat membusuk dan sangat baik untuk dijadikan pupuk kompos penyubur tanaman.' },
  { id: 'organik-banana', category: 'Organik', Component: BananaPeel, name: 'Kulit Pisang', description: 'Kulit pisang yang dibuang dapat terurai secara alami dengan cepat di tanah dan kaya akan nutrisi.' },
  { id: 'organik-leaf', category: 'Organik', Component: DryLeaf, name: 'Daun Kering', description: 'Guguran daun kering dari pohon yang mudah hancur dan menjadi humus alami di ekosistem.' },
  { id: 'organik-fish', category: 'Organik', Component: FishBone, name: 'Tulang Ikan', description: 'Sisa tulang dari konsumsi ikan yang termasuk material organik dan dapat diurai oleh mikroorganisme.' },
  // Non-Organik
  { id: 'nonorganik-bottle', category: 'Non Organik', Component: PlasticBottle, name: 'Botol Plastik', description: 'Botol minuman berbahan dasar plastik PET yang membutuhkan waktu ratusan tahun untuk terurai. Sebaiknya didaur ulang.' },
  { id: 'nonorganik-can', category: 'Non Organik', Component: SodaCan, name: 'Kaleng Minuman', description: 'Kaleng bekas minuman bersoda yang terbuat dari aluminium. Sangat bernilai untuk dilebur dan didaur ulang kembali.' },
  { id: 'nonorganik-bag', category: 'Non Organik', Component: PlasticBag, name: 'Kantong Plastik', description: 'Kantong kresek sekali pakai yang sering menyumbat saluran air dan membahayakan hewan laut jika terbuang sembarangan.' },
  { id: 'nonorganik-cup', category: 'Non Organik', Component: CoffeeCup, name: 'Gelas Kertas', description: 'Gelas kopi sekali pakai yang berlapis plastik kedap air di dalamnya, sehingga sulit terurai dan butuh penanganan khusus.' },
  // B3
  { id: 'b3-battery', category: 'B3', Component: UsedBattery, name: 'Baterai Bekas', description: 'Baterai bekas pakai mengandung logam berat berbahaya seperti timbal dan merkuri yang bisa sangat meracuni tanah.' },
  { id: 'b3-bulb', category: 'B3', Component: BrokenBulb, name: 'Lampu Pecah', description: 'Lampu bohlam atau neon bekas dapat melepaskan gas dan serbuk kimia beracun yang membahayakan jika terhirup.' },
  { id: 'b3-spray', category: 'B3', Component: Insecticide, name: 'Racun Serangga', description: 'Kaleng bekas pestisida yang sisa cairan racunnya sangat mematikan bagi keseimbangan ekosistem dan satwa liar.' },
  { id: 'b3-chemical', category: 'B3', Component: ChemicalBottle, name: 'Cairan Kimia', description: 'Botol cairan kimia pembersih yang korosif dan bisa mencemari sumber mata air bersih jika dibuang ke selokan.' },
];
