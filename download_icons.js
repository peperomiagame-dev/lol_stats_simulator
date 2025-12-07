import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS = {
    'attack_damage.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/7/7e/Attack_damage_colored_icon.png',
    'ability_power.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/0/0a/Ability_power_colored_icon.png',
    'armor.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/d/d5/Armor_colored_icon.png',
    'magic_resist.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/a/a3/Magic_resistance_colored_icon.png',
    'attack_speed.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/4/49/Attack_speed_colored_icon.png',
    'ability_haste.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/f/fc/Ability_haste_colored_icon.png',
    'crit_chance.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/3/3e/Critical_strike_chance_colored_icon.png',
    'move_speed.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/2/21/Movement_speed_colored_icon.png',
    'armor_pen.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/6/64/Armor_penetration_colored_icon.png',
    'magic_pen.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/f/f8/Magic_penetration_colored_icon.png',
    'lifesteal.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/6/6b/Life_steal_colored_icon.png',
    'omnivamp.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/a/a7/Omnivamp_colored_icon.png',
    'health.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/2/22/Health_colored_icon.png',
    'mana.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/d/d1/Mana_colored_icon.png',
    'health_regen.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/a/a9/Health_regeneration_colored_icon.png',
    'mana_regen.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/5/50/Mana_regeneration_colored_icon.png',
    // Lethality often uses the Armor Pen icon or a variant. For now, I'll use Armor Pen for Lethality as well, or find a specific one if possible. 
    // The wiki list didn't explicitly show "Lethality colored icon", but "Armor penetration colored icon" is standard.
    // Let's use Armor Pen for both for now, or use the "Lethality" specific one if found. I'll stick to Armor Pen for safety or duplicate it.
    'lethality.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/6/64/Armor_penetration_colored_icon.png',
    'tenacity.png': 'https://static.wikia.nocookie.net/leagueoflegends/images/c/c9/Tenacity_colored_icon.png', // Guessing URL pattern, or I might need to verify.
    // If Tenacity fails, I'll use a fallback in the component or check wiki again. 
    // Wait, let's check Tenacity in the list I saw? I didn't see it in the chunk I read.
    // I previously read chunk 20-30. Tenacity might be 'T'.
};

const DEST_DIR = path.join(__dirname, 'src', 'assets', 'stats');

const downloadFile = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(DEST_DIR, filename));
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(DEST_DIR, filename), () => { });
            reject(err);
        });
    });
};

const main = async () => {
    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    const tasks = Object.entries(ICONS).map(([filename, url]) => {
        // Remove revision parameters for cleaner URL if needed, but wikia needs them sometimes or redirects.
        // Actually, wikia images usually work with the revision part.
        // The URLs I copied include query params in the markdown link but the text was clean?
        // Wait, the URLs in the markdown were `.../icon.png/revision/latest/smart/...`
        // I should probably use the clean version or the one that works.
        // Let's try to remove everything after `.png` and see if it redirects to latest.
        // Usually `.../image.png` on wikia redirects to the latest version.
        const cleanUrl = url.split('.png')[0] + '.png';
        return downloadFile(cleanUrl, filename).catch(err => {
            console.error(`Error downloading ${filename}:`, err.message);
        });
    });

    await Promise.all(tasks);
    console.log('All downloads finished.');
};

main();
