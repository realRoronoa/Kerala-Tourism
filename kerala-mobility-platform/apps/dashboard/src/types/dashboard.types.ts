export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  iconName: string;
}

export interface HeatmapZone {
  id: string;
  district: string;
  congestionStatus: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  value: number;
}

export interface OriginDestinationPair {
  id: string;
  origin: string;
  destination: string;
  volume: number;
}

export interface ModeShare {
  mode: string;
  percentage: number;
  colorClass: string;
}

export interface ZoneStatistic {
  id: string;
  zoneName: string;
  totalTrips: number;
  avgDistanceKm: number;
  congestionPercentage: number;
}

export interface DownloadLink {
  id: string;
  title: string;
  type: 'PDF' | 'ZIP' | 'SHP' | 'HTML';
  size: string;
  url: string;
}
