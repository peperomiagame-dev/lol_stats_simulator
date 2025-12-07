import https from 'https';

const BASE_URLS = [
    'https://raw.githubusercontent.com/noxelisdev/LoL_DDragon/main/img',
    'https://raw.githubusercontent.com/noxelisdev/LoL_DDragon/master/img',
    'https://raw.githubusercontent.com/noxelisdev/LoL_DDragon/main/img/stats',
    'https://raw.githubusercontent.com/noxelisdev/LoL_DDragon/master/img/stats',
];

const FILES = [
    'CriticalStrike.png',
    'CalculatedCritChance.png',
    'CritChance.png',
    'stat_mods/CriticalStrike.png',
    'Health.png',
    'Mana.png',
    'Range.png',
    'AttackDamage.png',
];

const checkUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`FOUND: ${url}`);
                resolve(true);
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
};

const main = async () => {
    for (const base of BASE_URLS) {
        for (const file of FILES) {
            await checkUrl(`${base}/${file}`);
        }
    }
};

main();
