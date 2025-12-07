export interface DDragonVersion {
  [key: string]: string;
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
  abilityPower?: number;
  abilityHaste?: number;
  lethality?: number;
  magicPen?: number; // Flat
  percentMagicPen?: number;
  armorPen?: number; // Percent
  lifesteal?: number;
  omnivamp?: number;
  physicalVamp?: number;
  tenacity?: number;
  healShieldPower?: number;
}

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: ChampionImage;
  tags: string[];
  partype: string;
  stats: ChampionStats;
}

export interface ChampionResponse {
  type: string;
  format: string;
  version: string;
  data: { [key: string]: ChampionData };
}

export interface ItemStats {
  FlatHPPoolMod?: number;
  FlatMPPoolMod?: number;
  PercentHPPoolMod?: number;
  PercentMPPoolMod?: number;
  FlatHPRegenMod?: number;
  PercentHPRegenMod?: number;
  FlatMPRegenMod?: number;
  PercentMPRegenMod?: number;
  FlatArmorMod?: number;
  PercentArmorMod?: number;
  FlatSpellBlockMod?: number;
  PercentSpellBlockMod?: number;
  FlatPhysicalDamageMod?: number;
  PercentPhysicalDamageMod?: number;
  FlatMagicDamageMod?: number;
  PercentMagicDamageMod?: number;
  FlatMovementSpeedMod?: number;
  PercentMovementSpeedMod?: number;
  FlatAttackSpeedMod?: number;
  PercentAttackSpeedMod?: number;
  FlatCritChanceMod?: number;
  PercentCritChanceMod?: number;
  PercentLifeStealMod?: number;
  FlatHasteMod?: number;
}

export interface ItemImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ItemData {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  image: ItemImage;
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  tags: string[];
  maps: { [key: string]: boolean };
  stats: ItemStats;
}

export interface ItemResponse {
  type: string;
  version: string;
  basic: any;
  data: { [key: string]: ItemData };
  groups: any[];
  tree: any[];
}

export interface RuneReforged {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: {
    runes: {
      id: number;
      key: string;
      icon: string;
      name: string;
      shortDesc: string;
      longDesc: string;
    }[];
  }[];
}
