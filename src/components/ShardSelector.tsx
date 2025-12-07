import React from 'react';
import './ShardSelector.css';

// Community Dragon Base URL for Stat Mods
const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods';

export type ShardType = 'adaptive' | 'attackSpeed' | 'abilityHaste' | 'moveSpeed' | 'healthScaling' | 'healthFlat' | 'tenacity';

export interface ShardOption {
    id: string;
    type: ShardType;
    icon: string;
    label: string; // Detail text (e.g. "+9 Adaptive")
    value: number; // For simple values, or 0 if complex logic needed
}

export interface ShardSelection {
    offense: ShardType;
    flex: ShardType;
    defense: ShardType;
}

interface ShardSelectorProps {
    selection: ShardSelection;
    onChange: (selection: ShardSelection) => void;
    lang: string;
}

const SHARD_ICONS: Record<ShardType, string> = {
    adaptive: `${CDRAGON_BASE}/statmodsadaptiveforceicon.png`,
    attackSpeed: `${CDRAGON_BASE}/statmodsattackspeedicon.png`,
    abilityHaste: `${CDRAGON_BASE}/statmodscdrscalingicon.png`,
    moveSpeed: `${CDRAGON_BASE}/statmodsmovementspeedicon.png`,
    healthScaling: `${CDRAGON_BASE}/statmodshealthscalingicon.png`,
    healthFlat: `${CDRAGON_BASE}/statmodshealthplusicon.png`, // Using Health Plus for flat health
    tenacity: `${CDRAGON_BASE}/statmodstenacityicon.png`,
};

export const ShardSelector: React.FC<ShardSelectorProps> = ({ selection, onChange, lang }) => {

    // Labels for tooltips
    const getLabels = (type: ShardType) => {
        if (lang === 'ja_JP') {
            switch (type) {
                case 'adaptive': return 'アダプティブフォース +9';
                case 'attackSpeed': return '攻撃速度 +10%';
                case 'abilityHaste': return 'スキルヘイスト +8';
                case 'moveSpeed': return '移動速度 +2%';
                case 'healthScaling': return '体力 +10~180 (Lvに応じて)';
                case 'healthFlat': return '体力 +65';
                case 'tenacity': return '行動妨害耐性 +10%';
            }
        } else {
            switch (type) {
                case 'adaptive': return '+9 Adaptive Force';
                case 'attackSpeed': return '+10% Attack Speed';
                case 'abilityHaste': return '+8 Ability Haste';
                case 'moveSpeed': return '+2% Move Speed';
                case 'healthScaling': return '+10-180 Health (based on level)';
                case 'healthFlat': return '+65 Health';
                case 'tenacity': return '+10% Tenacity';
            }
        }
    };

    const renderRow = (rowKey: keyof ShardSelection, options: ShardType[]) => (
        <div className="shard-row">
            {options.map((type) => (
                <div
                    key={type}
                    className={`shard-option ${selection[rowKey] === type ? 'active' : ''}`}
                    onClick={() => onChange({ ...selection, [rowKey]: type })}
                    title={getLabels(type)}
                >
                    <img src={SHARD_ICONS[type]} alt={type} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="shard-selector glass-panel">
            <div className="shard-rows-container">
                {/* Row 1: Offense */}
                {renderRow('offense', ['adaptive', 'attackSpeed', 'abilityHaste'])}

                {/* Row 2: Flex */}
                {renderRow('flex', ['adaptive', 'moveSpeed', 'healthScaling'])}

                {/* Row 3: Defense */}
                {renderRow('defense', ['healthFlat', 'tenacity', 'healthScaling'])}
            </div>
        </div>
    );
};
