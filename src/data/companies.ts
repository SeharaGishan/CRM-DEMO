import { Company } from "@/lib/types";

const colors = [
  "#2563EB,#7C3AED",
  "#059669,#22C55E",
  "#EA580C,#F59E0B",
  "#DB2777,#EC4899",
  "#0891B2,#06B6D4",
  "#4F46E5,#818CF8",
  "#B45309,#F59E0B",
  "#0D9488,#2DD4BF",
];

function color(i: number) {
  return colors[i % colors.length];
}

export const companies: Company[] = [
  { id: "co-1", name: "Ceylon Spice Traders", industry: "Import / Export", size: "51-200", website: "ceylonspicetraders.lk", avatarColor: color(0) },
  { id: "co-2", name: "Horizon Apparel Group", industry: "Manufacturing", size: "500+", website: "horizonapparel.com", avatarColor: color(1) },
  { id: "co-3", name: "BlueWave Logistics", industry: "Logistics", size: "201-500", website: "bluewavelogistics.com", avatarColor: color(2) },
  { id: "co-4", name: "NextGen Retail Holdings", industry: "Retail", size: "51-200", website: "nextgenretail.com", avatarColor: color(3) },
  { id: "co-5", name: "Vantage Financial Services", industry: "Finance", size: "201-500", website: "vantagefs.com", avatarColor: color(4) },
  { id: "co-6", name: "Coral Bay Resorts", industry: "Hospitality", size: "201-500", website: "coralbayresorts.lk", avatarColor: color(5) },
  { id: "co-7", name: "Metro Health Diagnostics", industry: "Healthcare", size: "51-200", website: "metrohealthdx.com", avatarColor: color(6) },
  { id: "co-8", name: "Orbit Telecom Services", industry: "Telecommunications", size: "500+", website: "orbittelecom.com", avatarColor: color(7) },
  { id: "co-9", name: "GreenField AgroTech", industry: "Agriculture", size: "11-50", website: "greenfieldagro.lk", avatarColor: color(0) },
  { id: "co-10", name: "Skyline Constructions", industry: "Construction", size: "201-500", website: "skylinecon.com", avatarColor: color(1) },
  { id: "co-11", name: "Prime Freight Solutions", industry: "Logistics", size: "51-200", website: "primefreight.com", avatarColor: color(2) },
  { id: "co-12", name: "Emerald Isle Exports", industry: "Import / Export", size: "11-50", website: "emeraldisle.lk", avatarColor: color(3) },
  { id: "co-13", name: "Cinnamon Grand Tea Co.", industry: "Agriculture", size: "51-200", website: "cinnamongrandtea.lk", avatarColor: color(4) },
  { id: "co-14", name: "Aurora Digital Media", industry: "Marketing", size: "11-50", website: "auroradigital.com", avatarColor: color(5) },
];
