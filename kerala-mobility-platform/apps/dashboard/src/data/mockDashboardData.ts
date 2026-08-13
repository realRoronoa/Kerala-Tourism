import type { StatMetric, HeatmapZone, OriginDestinationPair, ModeShare, ZoneStatistic, DownloadLink } from '../types/dashboard.types';

export const MOCK_STATS: StatMetric[] = [
  { id: '1', label: 'Total Trips', value: '12,450', iconName: 'activity' },
  { id: '2', label: 'Verified Trips', value: '9,820 (78.8%)', iconName: 'check-circle' },
  { id: '3', label: 'Pending Verification', value: '2,630', iconName: 'clock' },
  { id: '4', label: 'Verification Accuracy Rate', value: '94.2%', iconName: 'map-pin' },
];

export const MOCK_HEATMAP_ZONES: HeatmapZone[] = [
  { id: 'tvm', district: 'Thiruvananthapuram', congestionStatus: 'High', value: 82 },
  { id: 'klm', district: 'Kollam', congestionStatus: 'Moderate', value: 55 },
  { id: 'pta', district: 'Pathanamthitta', congestionStatus: 'Low', value: 30 },
  { id: 'alp', district: 'Alappuzha', congestionStatus: 'Moderate', value: 48 },
  { id: 'ktm', district: 'Kottayam', congestionStatus: 'Moderate', value: 60 },
  { id: 'idk', district: 'Idukki', congestionStatus: 'Low', value: 25 },
  { id: 'ekm', district: 'Ernakulam', congestionStatus: 'Critical', value: 95 },
  { id: 'tcr', district: 'Thrissur', congestionStatus: 'Very High', value: 88 },
  { id: 'pkd', district: 'Palakkad', congestionStatus: 'High', value: 75 },
  { id: 'mpm', district: 'Malappuram', congestionStatus: 'Very High', value: 85 },
  { id: 'kkd', district: 'Kozhikode', congestionStatus: 'High', value: 78 },
  { id: 'wyd', district: 'Wayanad', congestionStatus: 'Low', value: 20 },
  { id: 'knr', district: 'Kannur', congestionStatus: 'Moderate', value: 50 },
  { id: 'ksr', district: 'Kasaragod', congestionStatus: 'Low', value: 35 },
];

export const MOCK_OD_PAIRS: OriginDestinationPair[] = [
  { id: 'od1', origin: 'Ernakulam', destination: 'Thiruvananthapuram', volume: 45000 },
  { id: 'od2', origin: 'Thrissur', destination: 'Ernakulam', volume: 38000 },
  { id: 'od3', origin: 'Kozhikode', destination: 'Malappuram', volume: 32000 },
  { id: 'od4', origin: 'Kollam', destination: 'Thiruvananthapuram', volume: 29000 },
  { id: 'od5', origin: 'Palakkad', destination: 'Thrissur', volume: 25000 },
];

export const MOCK_MODE_SHARE: ModeShare[] = [
  { mode: 'Bus / KSRTC', percentage: 42, colorClass: 'bg-red-600' },
  { mode: 'Car / Taxi', percentage: 28, colorClass: 'bg-blue-600' },
  { mode: 'Auto / Two-Wheeler', percentage: 18, colorClass: 'bg-yellow-500' },
  { mode: 'Walking', percentage: 8, colorClass: 'bg-green-500' },
  { mode: 'Train / Metro', percentage: 4, colorClass: 'bg-cyan-500' },
];

export const MOCK_ZONE_STATS: ZoneStatistic[] = [
  { id: 'z1', zoneName: 'Edappally Junction, EKM', totalTrips: 125000, avgDistanceKm: 12.4, congestionPercentage: 92 },
  { id: 'z2', zoneName: 'Thampanoor, TVM', totalTrips: 98000, avgDistanceKm: 8.5, congestionPercentage: 88 },
  { id: 'z3', zoneName: 'Vyttila Mobility Hub, EKM', totalTrips: 150000, avgDistanceKm: 15.2, congestionPercentage: 85 },
  { id: 'z4', zoneName: 'Sakthan Thampuran Nagar, TCR', totalTrips: 75000, avgDistanceKm: 10.1, congestionPercentage: 79 },
  { id: 'z5', zoneName: 'Mananchira, KKD', totalTrips: 68000, avgDistanceKm: 7.8, congestionPercentage: 76 },
];

export const MOCK_DOWNLOADS: DownloadLink[] = [
  { id: 'dl1', title: 'Monthly Mobility Report (July 2026)', type: 'PDF', size: '4.2 MB', url: '#' },
  { id: 'dl2', title: 'Statewide OD Matrix Raw Data', type: 'ZIP', size: '128 MB', url: '#' },
  { id: 'dl3', title: 'Traffic Analysis Zones Shapefiles', type: 'SHP', size: '15.6 MB', url: '#' },
  { id: 'dl4', title: 'GTFS Realtime Feed Documentation', type: 'HTML', size: 'Online', url: '#' },
];
