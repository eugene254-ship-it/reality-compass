import { motion } from "framer-motion";
import { useState } from "react";
import { Satellite, X } from "lucide-react";

interface Hotspot {
  id: string;
  label: string;
  region: string;
  country: string;
  cx: number;
  cy: number;
  stage: "theory" | "pilot" | "validated" | "global";
  impact: string;
  detail: string;
  intensity: number; // 0-1
}

const hotspots: Hotspot[] = [
  {
    id: "kenya",
    label: "Terrace Water Harvesting",
    region: "Rift Valley",
    country: "Kenya",
    cx: 545,
    cy: 290,
    stage: "validated",
    impact: "+34% vegetation recovery",
    detail: "Satellite imagery confirms restored vegetation across 12,000 hectares. Soil moisture up 28%.",
    intensity: 0.85,
  },
  {
    id: "brazil",
    label: "Syntropic Agroforestry",
    region: "Cerrado",
    country: "Brazil",
    cx: 310,
    cy: 310,
    stage: "global",
    impact: "+2.1 tons CO₂/ha/yr",
    detail: "Adopted across 8 countries. Carbon capture verified via atmospheric sensors and ground truth.",
    intensity: 1,
  },
  {
    id: "india",
    label: "Solar Micro-Irrigation",
    region: "Thar Desert",
    country: "India",
    cx: 640,
    cy: 220,
    stage: "pilot",
    impact: "+47% crop yield",
    detail: "3 pilot zones active. Energy savings of 60% vs diesel pumps. Scaling assessment underway.",
    intensity: 0.6,
  },
  {
    id: "niger",
    label: "Farmer-Managed Regeneration",
    region: "Sahel Belt",
    country: "Niger",
    cx: 490,
    cy: 240,
    stage: "validated",
    impact: "5M hectares restored",
    detail: "Largest regreening effort in Africa. NDVI index shows sustained improvement over 15 years.",
    intensity: 0.9,
  },
  {
    id: "indonesia",
    label: "Mangrove Carbon Credits",
    region: "Kalimantan",
    country: "Indonesia",
    cx: 730,
    cy: 295,
    stage: "pilot",
    impact: "+18% coastal resilience",
    detail: "Blue carbon initiative covering 4,500 hectares. Storm surge reduction measured at 40%.",
    intensity: 0.55,
  },
  {
    id: "ethiopia",
    label: "Community Health Networks",
    region: "Amhara",
    country: "Ethiopia",
    cx: 555,
    cy: 260,
    stage: "validated",
    impact: "78% coverage increase",
    detail: "Mobile health worker network serving 2.3M people. Maternal mortality down 31%.",
    intensity: 0.75,
  },
  {
    id: "mexico",
    label: "Milpa Polyculture Revival",
    region: "Oaxaca",
    country: "Mexico",
    cx: 210,
    cy: 230,
    stage: "theory",
    impact: "Biodiversity study active",
    detail: "Traditional polyculture methods under scientific evaluation. Early soil diversity metrics promising.",
    intensity: 0.35,
  },
];

const stageColors: Record<string, string> = {
  theory: "var(--stage-theory)",
  pilot: "var(--stage-pilot)",
  validated: "var(--stage-validated)",
  global: "var(--stage-global)",
};

const stageLabels: Record<string, string> = {
  theory: "Theoretical",
  pilot: "Pilot Testing",
  validated: "Field Validated",
  global: "Global Adoption",
};

// Simplified world map path (continents outline)
const WORLD_PATH =
  "M165,120 L175,115 185,118 195,112 205,115 215,118 220,125 225,130 230,128 240,125 245,130 250,135 248,140 242,145 238,150 " +
  "M255,135 L260,130 268,128 275,132 280,128 288,130 295,135 298,140 302,145 308,148 315,145 320,140 325,138 330,142 " +
  "M245,180 L250,175 258,178 265,182 270,188 275,195 280,200 285,210 290,220 295,230 300,240 305,250 310,260 315,270 318,280 320,290 322,300 318,310 312,318 305,325 298,330 290,328 282,322 275,315 270,310 268,300 272,290 278,280 280,270 275,260 268,250 260,240 255,230 250,220 248,210 245,200 243,190 " +
  "M460,100 L470,95 480,92 490,90 500,92 510,95 520,100 530,105 535,110 540,115 545,120 548,128 550,135 555,130 560,125 565,120 570,118 580,120 590,125 600,130 " +
  "M600,130 L608,128 615,125 620,120 628,118 635,120 640,125 648,130 655,135 660,140 665,148 668,155 670,162 672,170 675,178 678,185 680,195 678,205 675,215 670,222 665,228 660,232 655,225 650,218 645,212 640,208 635,205 628,200 620,198 612,200 605,205 598,210 590,215 585,220 580,225 575,230 570,235 " +
  "M460,100 L455,108 450,115 445,120 442,128 440,135 438,142 440,150 445,158 450,165 455,172 460,180 462,188 458,195 " +
  "M458,195 L462,200 468,205 475,208 480,215 485,222 490,230 492,238 488,245 482,250 475,255 468,258 462,260 458,265 455,270 452,278 455,285 460,290 465,295 " +
  "M520,195 L525,200 530,208 535,215 540,222 542,230 538,238 532,245 525,250 520,255 515,260 510,268 508,275 512,282 518,288 525,292 530,295 " +
  "M570,235 L565,242 560,248 558,255 560,262 565,268 570,272 575,278 572,285 568,290 " +
  "M680,195 L685,200 690,208 695,215 700,222 705,225 712,228 718,232 722,238 725,245 728,252 730,260 732,268 730,275 725,282 720,288 715,292 710,298 705,305 700,310 695,315 690,310 685,305 682,298 " +
  "M740,260 L748,255 755,258 760,265 762,272 758,280 752,285 745,288 738,285 735,278 738,270 " +
  "M140,95 L150,90 160,88 170,90 180,95 190,100 200,105 210,108 220,105 230,100 240,95 250,90 260,88 270,90 275,95 " +
  "M330,142 L338,148 345,152 350,158 355,162 362,165 368,170 375,172 380,170 388,165 395,160 400,155 408,150 415,148 422,150 428,155 435,158 440,155 445,150 ";

const WorldMap = () => {
  const [selected, setSelected] = useState<Hotspot | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-lg border border-border card-gradient overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="px-6 pt-5 pb-2 relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Satellite className="w-4 h-4 text-primary" />
            Global Innovation Map
          </h2>
          <p className="text-sm text-muted-foreground">
            Satellite-verified hotspots of emerging breakthroughs
          </p>
        </div>
        <div className="flex items-center gap-4">
          {(["theory", "pilot", "validated", "global"] as const).map((stage) => (
            <div key={stage} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `hsl(${stageColors[stage]})` }}
              />
              <span className="text-[10px] text-muted-foreground">{stageLabels[stage]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <svg viewBox="100 60 700 300" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines for atmosphere */}
          {[100, 140, 180, 220, 260, 300, 340].map((y) => (
            <line
              key={`h-${y}`}
              x1="100"
              y1={y}
              x2="800"
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth={0.3}
              opacity={0.3}
            />
          ))}
          {[150, 250, 350, 450, 550, 650, 750].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="60"
              x2={x}
              y2="360"
              stroke="hsl(var(--border))"
              strokeWidth={0.3}
              opacity={0.3}
            />
          ))}

          {/* Continent outlines */}
          <path
            d={WORLD_PATH}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            opacity={0.25}
          />

          {/* Hotspot glows and points */}
          {hotspots.map((spot, i) => {
            const color = stageColors[spot.stage];
            const isSelected = selected?.id === spot.id;
            return (
              <g key={spot.id}>
                {/* Outer glow */}
                <motion.circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={20 * spot.intensity}
                  fill={`hsl(${color} / 0.08)`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Mid glow */}
                <motion.circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={12 * spot.intensity}
                  fill={`hsl(${color} / 0.15)`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                />
                {/* Core dot */}
                <motion.circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={isSelected ? 5 : 3.5}
                  fill={`hsl(${color})`}
                  stroke={isSelected ? "hsl(var(--foreground))" : "none"}
                  strokeWidth={isSelected ? 1.5 : 0}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                  className="cursor-pointer"
                  onClick={() => setSelected(isSelected ? null : spot)}
                />
                {/* Label */}
                <motion.text
                  x={spot.cx}
                  y={spot.cy - 10 - 8 * spot.intensity}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={8}
                  fontFamily="Space Grotesk"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                  className="cursor-pointer select-none"
                  onClick={() => setSelected(isSelected ? null : spot)}
                >
                  {spot.label}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* Detail card overlay */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 rounded-lg border border-border bg-card/95 backdrop-blur-md p-4 z-20"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: `hsl(${stageColors[selected.stage]})` }}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {stageLabels[selected.stage]}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{selected.label}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {selected.region}, {selected.country}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold"
                style={{ color: `hsl(${stageColors[selected.stage]})` }}
              >
                {selected.impact}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{selected.detail}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WorldMap;
