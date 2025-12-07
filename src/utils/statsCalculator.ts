import type { ChampionStats, ItemData } from '../types/ddragon';
import type { ShardSelection } from '../components/ShardSelector';

// Formula: Base + Growth * (Level - 1) * (0.7025 + 0.0175 * (Level - 1))
const calculateStatAtLevel = (base: number, growth: number, level: number): number => {
    if (level === 1) return base;
    return base + growth * (level - 1) * (0.7025 + 0.0175 * (level - 1));
};

// Attack Speed is special. 
// Formula: BaseAS * (1 + (Growth% * (Level - 1) * (0.7025 + 0.0175 * (Level - 1))))
const calculateASAtLevel = (base: number, growth: number, level: number): number => {
    if (level === 1) return base;
    const bonusPercent = (growth / 100) * (level - 1) * (0.7025 + 0.0175 * (level - 1));
    return base * (1 + bonusPercent);
};

export const calculateChampionStats = (
    baseStats: ChampionStats,
    level: number,
    items: (ItemData | null)[] = [],
    shards: ShardSelection = { offense: 'adaptive', flex: 'adaptive', defense: 'healthFlat' }
): ChampionStats => {
    // 1. Calculate base stats at level
    const stats: ChampionStats = {
        hp: calculateStatAtLevel(baseStats.hp, baseStats.hpperlevel, level),
        hpperlevel: baseStats.hpperlevel,
        mp: calculateStatAtLevel(baseStats.mp, baseStats.mpperlevel, level),
        mpperlevel: baseStats.mpperlevel,
        movespeed: baseStats.movespeed,
        armor: calculateStatAtLevel(baseStats.armor, baseStats.armorperlevel, level),
        armorperlevel: baseStats.armorperlevel,
        spellblock: calculateStatAtLevel(baseStats.spellblock, baseStats.spellblockperlevel, level),
        spellblockperlevel: baseStats.spellblockperlevel,
        attackrange: baseStats.attackrange,
        hpregen: calculateStatAtLevel(baseStats.hpregen, baseStats.hpregenperlevel, level),
        hpregenperlevel: baseStats.hpregenperlevel,
        mpregen: calculateStatAtLevel(baseStats.mpregen, baseStats.mpregenperlevel, level),
        mpregenperlevel: baseStats.mpregenperlevel,
        crit: calculateStatAtLevel(baseStats.crit, baseStats.critperlevel, level),
        critperlevel: baseStats.critperlevel,
        attackdamage: calculateStatAtLevel(baseStats.attackdamage, baseStats.attackdamageperlevel, level),
        attackdamageperlevel: baseStats.attackdamageperlevel,
        attackspeed: calculateASAtLevel(baseStats.attackspeed, baseStats.attackspeedperlevel, level),
        attackspeedperlevel: baseStats.attackspeedperlevel,
    };

    // 2. Aggregate Item Stats
    let flatHp = 0;
    let flatMp = 0;
    let flatArmor = 0;
    let flatSpellBlock = 0;
    let flatPhysicalDamage = 0;
    let flatMagicDamage = 0;
    let flatMovementSpeed = 0;
    let percentAttackSpeed = 0;
    let flatCritChance = 0;
    let flatAbilityHaste = 0;

    // Advanced Stats Variables
    let percentBaseHpRegen = 0;
    let percentBaseMpRegen = 0;
    let flatLethality = 0;
    let flatMagicPen = 0;
    let percentMagicPen = 0;
    let percentArmorPen = 0;
    let percentLifesteal = 0;
    let percentOmnivamp = 0;
    let percentTenacity = 0;
    let percentHealShieldPower = 0;

    items.forEach(item => {
        if (!item) return;
        const s = item.stats;

        // Even if stats object is empty, we might need to parse description
        if (s) {
            flatHp += s.FlatHPPoolMod || 0;
            flatMp += s.FlatMPPoolMod || 0;
            flatArmor += s.FlatArmorMod || 0;
            flatSpellBlock += s.FlatSpellBlockMod || 0;
            flatPhysicalDamage += s.FlatPhysicalDamageMod || 0;
            flatMagicDamage += s.FlatMagicDamageMod || 0;
            flatMovementSpeed += s.FlatMovementSpeedMod || 0;
            percentAttackSpeed += s.PercentAttackSpeedMod || 0;
            flatCritChance += s.FlatCritChanceMod || 0;
            percentLifesteal += s.PercentLifeStealMod || 0; // Some items have it in stats

            if (s.FlatHasteMod) {
                flatAbilityHaste += s.FlatHasteMod;
            }
        }

        // Parse description for missing stats (Regen, Haste, Lethality, etc.)
        if (item.description) {
            // Ability Haste
            const hasteMatch = item.description.match(/<attention>(\d+)<\/attention>\s*(?:Ability Haste|スキルヘイスト)/i) ||
                item.description.match(/スキルヘイスト\s*<attention>(\d+)<\/attention>/i);
            if (hasteMatch && (!s || !s.FlatHasteMod)) {
                flatAbilityHaste += parseInt(hasteMatch[1], 10);
            }

            // Base HP Regen
            const hpRegenMatch = item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Base Health Regen|基本体力自動回復)/i) ||
                item.description.match(/基本体力自動回復\s*<attention>(\d+)%<\/attention>/i);
            if (hpRegenMatch) {
                percentBaseHpRegen += parseInt(hpRegenMatch[1], 10) / 100;
            }

            // Base Mana Regen
            const mpRegenMatch = item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Base Mana Regen|基本マナ自動回復)/i) ||
                item.description.match(/基本マナ自動回復\s*<attention>(\d+)%<\/attention>/i);
            if (mpRegenMatch) {
                percentBaseMpRegen += parseInt(mpRegenMatch[1], 10) / 100;
            }

            // Lethality
            const lethalityMatch = item.description.match(/(?:Lethality|脅威)\s*<attention>(\d+)<\/attention>/i) ||
                item.description.match(/<attention>(\d+)<\/attention>\s*(?:Lethality|脅威)/i);
            if (lethalityMatch) {
                flatLethality += parseInt(lethalityMatch[1], 10);
            }

            // Magic Pen (Flat)
            const flatMagicPenMatch = item.description.match(/(?:Magic Penetration|魔法防御貫通)\s*<attention>(\d+)<\/attention>(?!%)/i);
            if (flatMagicPenMatch) {
                flatMagicPen += parseInt(flatMagicPenMatch[1], 10);
            }

            // Magic Pen %
            const magicPenMatch = item.description.match(/(?:Magic Penetration|魔法防御貫通)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Magic Penetration|魔法防御貫通)/i);
            if (magicPenMatch) {
                percentMagicPen = Math.max(percentMagicPen, parseInt(magicPenMatch[1], 10) / 100);
            }

            // Armor Pen %
            const armorPenMatch = item.description.match(/(?:Armor Penetration|物理防御貫通)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Armor Penetration|物理防御貫通)/i);
            if (armorPenMatch) {
                percentArmorPen = Math.max(percentArmorPen, parseInt(armorPenMatch[1], 10) / 100);
            }

            // Lifesteal
            const lifestealMatch = item.description.match(/(?:Life Steal|ライフ スティール)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Life Steal|ライフ スティール)/i);
            if (lifestealMatch && (!s || !s.PercentLifeStealMod)) {
                percentLifesteal += parseInt(lifestealMatch[1], 10) / 100;
            }

            // Omnivamp
            const omnivampMatch = item.description.match(/(?:Omnivamp|オムニヴァンプ)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Omnivamp|オムニヴァンプ)/i);
            if (omnivampMatch) {
                percentOmnivamp += parseInt(omnivampMatch[1], 10) / 100;
            }

            // Tenacity
            const tenacityMatch = item.description.match(/(?:Tenacity|行動妨害耐性)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Tenacity|行動妨害耐性)/i);
            if (tenacityMatch) {
                percentTenacity += parseInt(tenacityMatch[1], 10) / 100;
            }

            // Heal & Shield Power
            const healShieldMatch = item.description.match(/(?:Heal and Shield Power|体力回復量とシールド量)\s*<attention>(\d+)%<\/attention>/i) ||
                item.description.match(/<attention>(\d+)%<\/attention>\s*(?:Heal and Shield Power|体力回復量とシールド量)/i);
            if (healShieldMatch) {
                percentHealShieldPower += parseInt(healShieldMatch[1], 10) / 100;
            }
        }
    });

    // 3. Aggregate Shard Stats
    let shardAdaptiveCount = 0;

    // Process Shards
    const allShards = [shards.offense, shards.flex, shards.defense];

    allShards.forEach(shard => {
        switch (shard) {
            case 'adaptive':
                shardAdaptiveCount++;
                break;
            case 'attackSpeed':
                percentAttackSpeed += 0.10;
                break;
            case 'abilityHaste':
                flatAbilityHaste += 8;
                break;
            case 'moveSpeed':
                // For simplicity, add to Move Speed. Real game does flat first then %, but pure % bonus here is ok.
                // However, movespeed var here is currently flat. We need to handle % MS properly.
                // Assuming baseStats.movespeed is base, flatMovementSpeed is items (boots).
                // Shard is 2% bonus.
                break;
            case 'healthFlat':
                flatHp += 65;
                break;
            case 'healthScaling':
                // 10-180 based on level (linear approx: 10 + (170/17)*(level-1))
                flatHp += 10 + (10 * (level - 1));
                break;
            case 'tenacity':
                percentTenacity += 0.10;
                break;
        }
    });


    // 4. Apply Item & Shard Stats
    stats.hp += flatHp;
    stats.mp += flatMp;
    stats.armor += flatArmor;
    stats.spellblock += flatSpellBlock;
    // stats.attackdamage += flatPhysicalDamage; // Wait to apply AD until after Adaptive Force

    // Calculate Bonus AD and Bonus AP to determine Adaptive Force
    // Bonus AD from items
    const bonusAdFromItems = flatPhysicalDamage;
    const apFromItems = flatMagicDamage;

    // Adaptive Force Logic: 1 Adaptive = 0.6 AD or 1 AP
    // Check which one is higher: Bonus AD or AP? (Default is AD if equal? Actually historically AP if equal unless champion specific, but usually checks bonus)
    // Actually, it compares Bonus AD vs AP.
    const adaptiveValue = shardAdaptiveCount * 9; // 9 Adaptive Force per shard

    let adaptiveAd = 0;
    let adaptiveAp = 0;

    if (bonusAdFromItems >= apFromItems) {
        // Gain AD
        adaptiveAd = adaptiveValue * 0.6;
    } else {
        // Gain AP
        adaptiveAp = adaptiveValue;
    }

    // Apply AD
    stats.attackdamage += flatPhysicalDamage + adaptiveAd;

    // Apply AP (start with 0 + items + adaptive)
    let totalAp = flatMagicDamage + adaptiveAp;

    // Apply Movement Speed (Base + Flat) * %Multiplier
    // We need to calculate base + flat first
    let moveSpeedTotal = stats.movespeed + flatMovementSpeed;

    // Apply Shard Move Speed (2% per shard)
    const msShardCount = allShards.filter(s => s === 'moveSpeed').length;
    if (msShardCount > 0) {
        moveSpeedTotal = moveSpeedTotal * (1 + (0.02 * msShardCount));
    }
    stats.movespeed = moveSpeedTotal;

    stats.crit += flatCritChance;

    // Apply Regen Bonuses
    stats.hpregen = stats.hpregen * (1 + percentBaseHpRegen);
    stats.mpregen = stats.mpregen * (1 + percentBaseMpRegen);

    // Recalculate Attack Speed
    const growthBonus = (baseStats.attackspeedperlevel / 100) * (level - 1) * (0.7025 + 0.0175 * (level - 1));
    stats.attackspeed = baseStats.attackspeed * (1 + growthBonus + percentAttackSpeed);

    return {
        ...stats,
        abilityPower: totalAp,
        abilityHaste: flatAbilityHaste,
        lethality: flatLethality,
        magicPen: flatMagicPen,
        percentMagicPen: percentMagicPen,
        armorPen: percentArmorPen,
        lifesteal: percentLifesteal,
        omnivamp: percentOmnivamp,
        tenacity: percentTenacity,
        healShieldPower: percentHealShieldPower,
    };
};
