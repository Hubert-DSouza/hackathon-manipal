// Curated Prototype Dataset of Infrastructure Nodes & Dependency Edges in Mumbai, India

export const MUMBAI_NODES = [
  {
    id: 'node-drain-1',
    name: 'BKC Low-Lying Storm Drain',
    type: 'drain',
    latitude: 19.0657,
    longitude: 72.8686,
    criticality: 'high',
    description: 'Primary stormwater discharge channel for Bandra Kurla Complex low-lying sector.'
  },
  {
    id: 'node-road-1',
    name: 'BKC Main Arterial Road',
    type: 'road',
    latitude: 19.0665,
    longitude: 72.8695,
    criticality: 'high',
    description: '6-lane commercial hub corridor connecting East-West Bandra flyovers.'
  },
  {
    id: 'node-junc-1',
    name: 'Central BKC Flyover Junction',
    type: 'junction',
    latitude: 19.0680,
    longitude: 72.8710,
    criticality: 'high',
    description: 'Major signalized traffic interchange linking BKC to Kurla and Sion.'
  },
  {
    id: 'node-hosp-1',
    name: 'Lilavati & Asian Heart Hospital Emergency Access',
    type: 'hospital',
    latitude: 19.0630,
    longitude: 72.8640,
    criticality: 'high',
    description: 'Critical ambulance & emergency response corridor for regional trauma centers.'
  },
  {
    id: 'node-drain-2',
    name: 'WEH Khar Culvert Drain',
    type: 'drain',
    latitude: 19.0760,
    longitude: 72.8777,
    criticality: 'high',
    description: 'High-capacity highway drainage culvert under Western Express Highway.'
  },
  {
    id: 'node-road-2',
    name: 'Western Express Highway (WEH Corridor)',
    type: 'road',
    latitude: 19.0780,
    longitude: 72.8785,
    criticality: 'high',
    description: 'North-South arterial highway carrying 250,000+ daily commuter vehicles.'
  },
  {
    id: 'node-bus-1',
    name: 'Kalanagar BEST Bus Terminal',
    type: 'bus_route',
    latitude: 19.0610,
    longitude: 72.8540,
    criticality: 'medium',
    description: 'Central BEST public bus transit interchange hub.'
  },
  {
    id: 'node-pwr-1',
    name: 'Dadar Suburban Power Substation',
    type: 'power_facility',
    latitude: 19.0178,
    longitude: 72.8478,
    criticality: 'high',
    description: '132kV electrical distribution grid supplying Dadar and Matunga.'
  },
  {
    id: 'node-san-1',
    name: 'Dadar Market Pumping Station',
    type: 'waste_facility',
    latitude: 19.0190,
    longitude: 72.8490,
    criticality: 'medium',
    description: 'Municipal solid waste & sewage lift station for market district.'
  },
  {
    id: 'node-water-1',
    name: 'Tansa Water Trunk Pipeline - Colaba Branch',
    type: 'water_facility',
    latitude: 18.9067,
    longitude: 72.8147,
    criticality: 'high',
    description: 'Underground potable water supply line feeding South Mumbai.'
  },
  {
    id: 'node-road-3',
    name: 'Colaba Causeway Arterial',
    type: 'road',
    latitude: 18.9080,
    longitude: 72.8155,
    criticality: 'medium',
    description: 'Commercial heritage boulevard and residential feeder road.'
  },
  {
    id: 'node-tree-1',
    name: 'Juhu Tara Coastal Green Canopy',
    type: 'environment',
    latitude: 19.1024,
    longitude: 72.8261,
    criticality: 'medium',
    description: 'Mature roadside avenue trees buffering overhead distribution power lines.'
  },
  {
    id: 'node-pwr-2',
    name: 'Juhu Overhead Feeder Line',
    type: 'power_facility',
    latitude: 19.1030,
    longitude: 72.8270,
    criticality: 'high',
    description: 'Aerial electricity cable network powering coastal residential & commercial zones.'
  },
  {
    id: 'node-road-4',
    name: 'Juhu Tara Main Road',
    type: 'road',
    latitude: 19.1040,
    longitude: 72.8280,
    criticality: 'high',
    description: 'Key coastal arterial road connecting Bandra to Versova.'
  },
  {
    id: 'node-junc-2',
    name: 'Juhu Circle Interchange',
    type: 'junction',
    latitude: 19.1070,
    longitude: 72.8310,
    criticality: 'high',
    description: 'Major traffic roundabout linking Juhu, Vile Parle and SV Road.'
  },
  {
    id: 'node-hosp-2',
    name: 'Cooper Hospital Emergency Route',
    type: 'hospital',
    latitude: 19.1090,
    longitude: 72.8360,
    criticality: 'high',
    description: 'Municipal general hospital trauma feeder route.'
  }
];

export const MUMBAI_EDGES = [
  {
    id: 'edge-1',
    source_node_id: 'node-drain-1',
    target_node_id: 'node-road-1',
    relationship_type: 'drains',
    description: 'Drain blockage causes water logging on BKC Main Road'
  },
  {
    id: 'edge-2',
    source_node_id: 'node-road-1',
    target_node_id: 'node-junc-1',
    relationship_type: 'connects_to',
    description: 'Flooded road bottlenecks vehicular movement into Central Junction'
  },
  {
    id: 'edge-3',
    source_node_id: 'node-junc-1',
    target_node_id: 'node-hosp-1',
    relationship_type: 'routes_through',
    description: 'Junction gridlock delays ambulance emergency access to hospital'
  },
  {
    id: 'edge-4',
    source_node_id: 'node-junc-1',
    target_node_id: 'node-bus-1',
    relationship_type: 'routes_through',
    description: 'Junction congestion delays BEST bus departures and transit routes'
  },
  {
    id: 'edge-5',
    source_node_id: 'node-drain-2',
    target_node_id: 'node-road-2',
    relationship_type: 'drains',
    description: 'Culvert overflow causes flash water logging on WEH lanes'
  },
  {
    id: 'edge-6',
    source_node_id: 'node-road-2',
    target_node_id: 'node-junc-1',
    relationship_type: 'connects_to',
    description: 'Highway traffic slowdown spills over into BKC flyover interchange'
  },
  {
    id: 'edge-7',
    source_node_id: 'node-pwr-1',
    target_node_id: 'node-san-1',
    relationship_type: 'provides_power_to',
    description: 'Power substation trip halts market sewage pumps'
  },
  {
    id: 'edge-8',
    source_node_id: 'node-san-1',
    target_node_id: 'node-road-3',
    relationship_type: 'serves',
    description: 'Pumping failure causes sanitation overflow onto commercial streets'
  },
  {
    id: 'edge-9',
    source_node_id: 'node-water-1',
    target_node_id: 'node-road-3',
    relationship_type: 'provides_water_to',
    description: 'Trunk line burst causes road collapse & water supply outage'
  },
  {
    id: 'edge-10',
    source_node_id: 'node-tree-1',
    target_node_id: 'node-pwr-2',
    relationship_type: 'depends_on',
    description: 'Fallen tree limb damages overhead power feeder lines'
  },
  {
    id: 'edge-11',
    source_node_id: 'node-tree-1',
    target_node_id: 'node-road-4',
    relationship_type: 'connects_to',
    description: 'Fallen tree trunk blocks Juhu Tara Road traffic lanes'
  },
  {
    id: 'edge-12',
    source_node_id: 'node-pwr-2',
    target_node_id: 'node-junc-2',
    relationship_type: 'provides_power_to',
    description: 'Power failure shuts down traffic signals at Juhu Circle'
  },
  {
    id: 'edge-13',
    source_node_id: 'node-road-4',
    target_node_id: 'node-junc-2',
    relationship_type: 'connects_to',
    description: 'Road obstruction diverts heavy commuter volume onto Juhu Circle'
  },
  {
    id: 'edge-14',
    source_node_id: 'node-junc-2',
    target_node_id: 'node-hosp-2',
    relationship_type: 'routes_through',
    description: 'Juhu Circle gridlock impedes emergency transit to Cooper Hospital'
  }
];
