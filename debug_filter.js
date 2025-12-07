const https = require('https');

const url = 'https://ddragon.leagueoflegends.com/cdn/15.24.1/data/ja_JP/item.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const items = Object.values(json.data);

            console.log('--- Hexplate Data ---');
            const hex = items.filter(i => i.name.includes('ヘクスプレート'));
            hex.forEach(h => {
                console.log(`Name: ${h.name}, Colloq: "${h.colloq}", Tags: ${h.tags}`);
            });

            console.log('\n--- Evolved Items Data ---');
            const evolvedNames = ['ムラマナ', 'セラフィム', 'フィンブル'];
            const evolved = items.filter(i => evolvedNames.some(n => i.name.includes(n)));
            evolved.forEach(e => {
                console.log(`Name: ${e.name}, ID: ${e.image.full}, Purchasable: ${e.gold.purchasable}, InStore: ${e.inStore}, Hide: ${e.hideFromAll}`);
            });

            console.log('\n--- Wards/Dolls Data ---');
            const unwanted = items.filter(i => i.name.includes('ワード') || i.name.includes('人形') || i.name.includes('身代わり'));
            unwanted.forEach(u => {
                console.log(`Name: ${u.name}, Tags: ${u.tags}, ID: ${u.image.full}`);
            });

        } catch (e) {
            console.error('Parse error:', e);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
