const https = require('https');

const url = 'https://ddragon.leagueoflegends.com/cdn/15.24.1/data/ja_JP/item.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const items = Object.values(json.data);

            console.log('--- Searching for "涙" (Namida) ---');
            const tears = items.filter(i => i.name.includes('涙'));
            tears.forEach(t => {
                console.log(`ID: ${t.image.full}, Name: "${t.name}", Maps: ${JSON.stringify(t.maps)}, Purchasable: ${t.gold.purchasable}`);
            });

            console.log('\n--- Searching for "Hexplate" ---');
            const hex = items.filter(i => i.name.includes('ヘクスプレート'));
            hex.forEach(h => {
                console.log(`ID: ${h.image.full}, Name: "${h.name}", Colloq: "${h.colloq}"`);
            });

            console.log('\n--- Checking for duplicates of "女神の涙" on Map 11 ---');
            const srTears = items.filter(i => i.name === '女神の涙' && i.maps['11']);
            srTears.forEach(t => {
                console.log(`ID: ${t.image.full}, Name: "${t.name}", Purchasable: ${t.gold.purchasable}`);
            });
        } catch (e) {
            console.error('Parse error:', e);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
