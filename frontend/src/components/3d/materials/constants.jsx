export const MATERIAL_TYPES = {
  RACK_FRAME: 'rack_frame',
  RAIL: 'rail',
  RAIL_HOLE: 'rail_hole',
  SIDE_PANEL: 'side_panel',
  TOP_PLATE: 'top_plate',
  BOTTOM_PLATE: 'bottom_plate',
  DEVICE_CHASSIS: 'device_chassis',
  DEVICE_PANEL: 'device_panel',
  DEVICE_PANEL_SELECTED: 'device_panel_selected',
  DRIVE_TRAY: 'drive_tray',
  DRIVE_TRAY_HANDLE: 'drive_tray_handle',
  LED_INDICATOR: 'led_indicator',
  LED_ERROR: 'led_error',
  SFP_PORT: 'sfp_port',
  RJ45_PORT: 'rj45_port',
  VENT_HOLE: 'vent_hole',
  BACK_PANEL: 'back_panel',
  PSU_MODULE: 'psu_module',
  FAN_MODULE: 'fan_module',
  TEXT_LABEL: 'text_label',
};

export const MATERIAL_CONFIGS = {
  [MATERIAL_TYPES.RACK_FRAME]: {
    color: '#2a2a2a',
    metalness: 0.85,
    roughness: 0.4,
    envMapIntensity: 1.0,
  },
  [MATERIAL_TYPES.RAIL]: {
    color: '#3a3a3a',
    metalness: 0.9,
    roughness: 0.25,
    envMapIntensity: 1.2,
  },
  [MATERIAL_TYPES.RAIL_HOLE]: {
    color: '#000000',
    metalness: 0.0,
    roughness: 0.9,
  },
  [MATERIAL_TYPES.SIDE_PANEL]: {
    color: '#1a1a1a',
    metalness: 0.7,
    roughness: 0.6,
    envMapIntensity: 0.8,
  },
  [MATERIAL_TYPES.TOP_PLATE]: {
    color: '#222222',
    metalness: 0.8,
    roughness: 0.35,
    envMapIntensity: 1.0,
  },
  [MATERIAL_TYPES.BOTTOM_PLATE]: {
    color: '#222222',
    metalness: 0.8,
    roughness: 0.35,
    envMapIntensity: 1.0,
  },
  [MATERIAL_TYPES.DEVICE_CHASSIS]: {
    color: '#333333',
    metalness: 0.4,
    roughness: 0.85,
  },
  [MATERIAL_TYPES.DEVICE_PANEL]: {
    color: '#555555',
    metalness: 0.15,
    roughness: 0.75,
  },
  [MATERIAL_TYPES.DEVICE_PANEL_SELECTED]: {
    color: '#666666',
    metalness: 0.2,
    roughness: 0.7,
  },
  [MATERIAL_TYPES.DRIVE_TRAY]: {
    color: '#0f172a',
    metalness: 0.3,
    roughness: 0.8,
  },
  [MATERIAL_TYPES.DRIVE_TRAY_HANDLE]: {
    color: '#334155',
    metalness: 0.5,
    roughness: 0.5,
  },
  [MATERIAL_TYPES.LED_INDICATOR]: {
    color: '#10b981',
    emissive: '#10b981',
    emissiveIntensity: 0.8,
    metalness: 0.0,
    roughness: 0.3,
    toneMapped: false,
  },
  [MATERIAL_TYPES.LED_ERROR]: {
    color: '#ef4444',
    emissive: '#ef4444',
    emissiveIntensity: 1.0,
    metalness: 0.0,
    roughness: 0.2,
    toneMapped: false,
  },
  [MATERIAL_TYPES.SFP_PORT]: {
    color: '#3b82f6',
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.6,
  },
  [MATERIAL_TYPES.RJ45_PORT]: {
    color: '#1e293b',
    metalness: 0.6,
    roughness: 0.4,
  },
  [MATERIAL_TYPES.VENT_HOLE]: {
    color: '#1a202c',
    metalness: 0.2,
    roughness: 0.9,
  },
  [MATERIAL_TYPES.BACK_PANEL]: {
    color: '#64748b',
    metalness: 0.8,
    roughness: 0.3,
    transparent: true,
    opacity: 0.35,
  },
  [MATERIAL_TYPES.PSU_MODULE]: {
    color: '#475569',
    metalness: 0.85,
    roughness: 0.35,
  },
  [MATERIAL_TYPES.FAN_MODULE]: {
    color: '#1e293b',
    metalness: 0.4,
    roughness: 0.7,
  },
  [MATERIAL_TYPES.TEXT_LABEL]: {
    color: '#ffffff',
    metalness: 0.0,
    roughness: 1.0,
  },
};

export const DEVICE_TYPE_COLORS = {
  server: '#3b82f6',
  switch: '#22c55e',
  router: '#f59e0b',
  firewall: '#ef4444',
  storage: '#8b5cf6',
  default: '#3b82f6',
};

export const STATUS_COLORS = {
  running: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  offline: '#6b7280',
  maintenance: '#8b5cf6',
  fault: '#ef4444',
};
