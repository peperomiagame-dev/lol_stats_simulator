import React from 'react';
import type { ChampionStats } from '../types/ddragon';
import './StatsDisplay.css';

interface StatsDisplayProps {
    stats: ChampionStats;
    lang: string;
}

const LABELS: { [key: string]: { [key: string]: string } } = {
    'en_US': {
        'Attack Damage': 'Attack Damage',
        'Ability Power': 'Ability Power',
        'Armor': 'Armor',
        'Magic Resist': 'Magic Resist',
        'Attack Speed': 'Attack Speed',
        'Ability Haste': 'Ability Haste',
        'Crit Chance': 'Crit Chance',
        'Move Speed': 'Move Speed',
        'Lethality': 'Lethality',
        'Armor Pen': 'Armor Pen',
        'Magic Pen': 'Magic Pen',
        'Magic Pen Flat': 'Magic Pen (Flat)',
        'Lifesteal': 'Lifesteal',
        'Omnivamp': 'Omnivamp',
        'Tenacity': 'Tenacity',
        'Heal/Shield': 'Heal/Shield Power',
        'Health': 'Health',
        'Mana': 'Mana',
        'HP Regen': 'HP Regen',
        'Mana Regen': 'Mana Regen',
        'Range': 'Range',
    },
    'ja_JP': {
        'Attack Damage': '攻撃力',
        'Ability Power': '魔力',
        'Armor': '物理防御',
        'Magic Resist': '魔法防御',
        'Attack Speed': '攻撃速度',
        'Ability Haste': 'スキルヘイスト',
        'Crit Chance': 'クリティカル率',
        'Move Speed': '移動速度',
        'Lethality': '脅威',
        'Armor Pen': '物理防御貫通',
        'Magic Pen': '魔法防御貫通 (%)',
        'Magic Pen Flat': '魔法防御貫通 (固定)',
        'Lifesteal': 'ライフスティール',
        'Omnivamp': 'オムニヴァンプ',
        'Tenacity': '行動妨害耐性',
        'Heal/Shield': '回復/シールド',
        'Health': '体力',
        'Mana': 'マナ',
        'HP Regen': '体力自動回復',
        'Mana Regen': 'マナ自動回復',
        'Range': '射程',
    }
};

// Community Dragon & Wiki Base URLs
const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods';
const WIKI_BASE = 'https://static.wikia.nocookie.net/leagueoflegends/images';

const ICON_URLS: { [key: string]: string } = {
    // Verified Community Dragon Paths (Safe, Official)
    armor: `${CDRAGON_BASE}/statmodsarmoricon.png`,
    magicResist: `${CDRAGON_BASE}/statmodsmagicresicon.png`,
    attackSpeed: `${CDRAGON_BASE}/statmodsattackspeedicon.png`,
    abilityHaste: `${CDRAGON_BASE}/statmodscdrscalingicon.png`,
    health: `${CDRAGON_BASE}/statmodshealthscalingicon.png`,
    moveSpeed: `${CDRAGON_BASE}/statmodsmovementspeedicon.png`,
    tenacity: `${CDRAGON_BASE}/statmodstenacityicon.png`,

    // Wiki Fallbacks (Authorized by User)
    // Used for stats where CDragon lacks a direct, colorful icon.
    attackDamage: `${WIKI_BASE}/7/7e/Attack_damage_colored_icon.png`,
    abilityPower: `${WIKI_BASE}/0/0a/Ability_power_colored_icon.png`,
    critChance: `${WIKI_BASE}/3/3e/Critical_strike_chance_colored_icon.png`,
    lethality: `${WIKI_BASE}/6/64/Armor_penetration_colored_icon.png`,
    armorPen: `${WIKI_BASE}/6/64/Armor_penetration_colored_icon.png`,
    magicPenFlat: `${WIKI_BASE}/f/f8/Magic_penetration_colored_icon.png`,
    magicPen: `${WIKI_BASE}/f/f8/Magic_penetration_colored_icon.png`,
    lifesteal: `${WIKI_BASE}/6/6b/Life_steal_colored_icon.png`,
    omnivamp: `${WIKI_BASE}/a/a7/Omnivamp_colored_icon.png`,
    healShield: `${WIKI_BASE}/8/89/Heal_and_shield_power_colored_icon.png`,
    mana: `${WIKI_BASE}/d/d1/Mana_colored_icon.png`,
    hpRegen: `${WIKI_BASE}/a/a9/Health_regeneration_colored_icon.png`,
    manaRegen: `${WIKI_BASE}/5/50/Mana_regeneration_colored_icon.png`,
    range: '/range_icon.svg'
};

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, lang }) => {
    const t = (key: string) => {
        return LABELS[lang]?.[key] || LABELS['en_US'][key] || key;
    };

    const formatStat = (val: number | string, decimals: number = 0) => {
        if (typeof val === 'string') return val;
        if (decimals === 0) return Math.round(val);
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    };

    const statItems: { label: string; itemKey: string; value: number | string; iconUrl: string }[] = [
        // ゲーム内ステータス画面に近い順序
        // リソース
        { label: 'Health', itemKey: 'Health', value: formatStat(stats.hp), iconUrl: ICON_URLS.health },
        { label: 'Mana', itemKey: 'Mana', value: formatStat(stats.mp), iconUrl: ICON_URLS.mana },

        // 基本攻撃ステータス
        { label: 'Attack Damage', itemKey: 'Attack Damage', value: formatStat(stats.attackdamage), iconUrl: ICON_URLS.attackDamage },
        { label: 'Ability Power', itemKey: 'Ability Power', value: formatStat(stats.abilityPower || 0), iconUrl: ICON_URLS.abilityPower },

        // 速度系
        { label: 'Attack Speed', itemKey: 'Attack Speed', value: formatStat(stats.attackspeed, 2), iconUrl: ICON_URLS.attackSpeed },
        { label: 'Crit Chance', itemKey: 'Crit Chance', value: `${Math.round(stats.crit * 100)}%`, iconUrl: ICON_URLS.critChance },

        // 防御
        { label: 'Armor', itemKey: 'Armor', value: formatStat(stats.armor), iconUrl: ICON_URLS.armor },
        { label: 'Magic Resist', itemKey: 'Magic Resist', value: formatStat(stats.spellblock), iconUrl: ICON_URLS.magicResist },

        // 移動・射程
        { label: 'Move Speed', itemKey: 'Move Speed', value: formatStat(stats.movespeed), iconUrl: ICON_URLS.moveSpeed },
        { label: 'Range', itemKey: 'Range', value: formatStat(stats.attackrange), iconUrl: ICON_URLS.range },

        // スキル関連
        { label: 'Ability Haste', itemKey: 'Ability Haste', value: formatStat(stats.abilityHaste || 0), iconUrl: ICON_URLS.abilityHaste },

        // リソース再生
        { label: 'HP Regen', itemKey: 'HP Regen', value: formatStat(stats.hpregen, 1), iconUrl: ICON_URLS.hpRegen },
        { label: 'Mana Regen', itemKey: 'Mana Regen', value: formatStat(stats.mpregen, 1), iconUrl: ICON_URLS.manaRegen },

        // 貫通系
        { label: 'Lethality', itemKey: 'Lethality', value: formatStat(stats.lethality || 0), iconUrl: ICON_URLS.lethality },
        { label: 'Armor Pen', itemKey: 'Armor Pen', value: `${Math.round((stats.armorPen || 0) * 100)}%`, iconUrl: ICON_URLS.armorPen },
        { label: 'Magic Pen Flat', itemKey: 'Magic Pen Flat', value: formatStat(stats.magicPen || 0), iconUrl: ICON_URLS.magicPenFlat },
        { label: 'Magic Pen', itemKey: 'Magic Pen', value: `${Math.round((stats.percentMagicPen || 0) * 100)}%`, iconUrl: ICON_URLS.magicPen },

        // 吸血・回復系
        { label: 'Lifesteal', itemKey: 'Lifesteal', value: `${Math.round((stats.lifesteal || 0) * 100)}%`, iconUrl: ICON_URLS.lifesteal },
        { label: 'Omnivamp', itemKey: 'Omnivamp', value: `${Math.round((stats.omnivamp || 0) * 100)}%`, iconUrl: ICON_URLS.omnivamp },
        { label: 'Heal/Shield', itemKey: 'Heal/Shield', value: `${Math.round((stats.healShieldPower || 0) * 100)}%`, iconUrl: ICON_URLS.healShield },

        // その他
        { label: 'Tenacity', itemKey: 'Tenacity', value: `${Math.round((stats.tenacity || 0) * 100)}%`, iconUrl: ICON_URLS.tenacity },
    ];

    return (
        <div className="stats-grid glass-panel">
            {statItems.map((item, index) => (
                <div key={index} className="stat-item" title={t(item.itemKey)}>
                    <div className="stat-icon-wrapper">
                        <img
                            src={item.iconUrl}
                            alt={t(item.itemKey)}
                            className="stat-icon-img"
                        />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{item.value}</span>
                        <span className="stat-label">{t(item.itemKey)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
