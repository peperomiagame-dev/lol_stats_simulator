import { useEffect, useState } from 'react';
import { DDragonService } from './services/ddragon';
import type { ChampionData, ChampionStats, ItemData } from './types/ddragon';
import { ChampionSelector } from './components/ChampionSelector';
import { LevelSelector } from './components/LevelSelector';
import { ItemSelector } from './components/ItemSelector';
import { Inventory } from './components/Inventory';
import { StatsDisplay } from './components/StatsDisplay';
import { calculateChampionStats } from './utils/statsCalculator';
import { ShardSelector } from './components/ShardSelector';
import type { ShardSelection } from './components/ShardSelector';
import './index.css';

// Localization Map
const APP_LABELS: { [key: string]: { [key: string]: string } } = {
  'en_US': {
    'Champion': 'Champion',
    'Level': 'Level',
    'Build': 'Build',
    'Stat Shards': 'Stat Shards',
    'Patch': 'Patch',
    'SelectChampionPlaceholder': 'Select a champion to view stats',
    'FooterDisclaimer': "LoL Stats Simulator. Isn't endorsed by Riot Games.",
  },
  'ja_JP': {
    'Champion': 'チャンピオン',
    'Level': 'レベル',
    'Build': 'ビルド',
    'Stat Shards': 'シャード',
    'Patch': 'パッチ',
    'SelectChampionPlaceholder': 'チャンピオンを選択してステータスを表示',
    'FooterDisclaimer': "LoL Stats Simulator. Riot Gamesの推奨ではありません。",
  }
};

function App() {
  const [version, setVersion] = useState<string>('');
  const [lang, setLang] = useState<string>('ja_JP');
  const [selectedChampion, setSelectedChampion] = useState<ChampionData | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [items, setItems] = useState<(ItemData | null)[]>([]);
  const [shards, setShards] = useState<ShardSelection>({ offense: 'adaptive', flex: 'adaptive', defense: 'healthFlat' });
  const [currentStats, setCurrentStats] = useState<ChampionStats | null>(null);

  const t = (key: string) => APP_LABELS[lang]?.[key] || APP_LABELS['en_US'][key] || key;

  useEffect(() => {
    DDragonService.getLatestVersion().then(setVersion);
  }, []);

  useEffect(() => {
    if (selectedChampion) {
      const stats = calculateChampionStats(selectedChampion.stats, level, items, shards);
      setCurrentStats(stats);
    } else {
      setCurrentStats(null);
    }
  }, [selectedChampion, level, items, shards]);

  const handleAddItem = (item: ItemData) => {
    if (items.length < 6) {
      setItems([...items, item]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="container flex-center" style={{ justifyContent: 'space-between', height: '80px' }}>
          <h1 className="logo text-gradient">LoL Stats Sim</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Language</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="lang-select glass-panel"
                style={{ padding: '4px 8px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
              >
                <option value="ja_JP">日本語</option>
                <option value="en_US">English</option>
              </select>
            </div>
            <span className="version-tag">{t('Patch')} {version}</span>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <div className="controls-section glass-panel" style={{
          marginBottom: 'var(--spacing-lg)',
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-lg)',
          alignItems: 'flex-start',
          paddingLeft: 'calc(var(--spacing-lg) + var(--spacing-md))',
        }}>
          <div style={{ minWidth: '300px' }}>
            <h2 className="section-title">{t('Champion')}</h2>
            <ChampionSelector
              onSelect={setSelectedChampion}
              selectedChampionId={selectedChampion?.id}
              lang={lang}
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <h2 className="section-title">{t('Level')}</h2>
            <LevelSelector level={level} onChange={setLevel} lang={lang} />
          </div>

          <div style={{ minWidth: '150px' }}>
            <h2 className="section-title">{t('Stat Shards')}</h2>
            <ShardSelector selection={shards} onChange={setShards} lang={lang} />
          </div>

          <div style={{ minWidth: '300px' }}>
            <h2 className="section-title">{t('Build')}</h2>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
              <Inventory items={items} onRemoveItem={handleRemoveItem} lang={lang} />
              <ItemSelector onSelect={handleAddItem} lang={lang} />
            </div>
          </div>
        </div>

        {selectedChampion && currentStats ? (
          <div className="stats-section">
            <div className="champion-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <img
                src={DDragonService.getImageUrl('champion', selectedChampion.image.full)}
                alt={selectedChampion.name}
                style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-primary)' }}
              />
              <div>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{selectedChampion.name}</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedChampion.title}</p>
              </div>
            </div>

            <StatsDisplay stats={currentStats} lang={lang} />
          </div>
        ) : (
          <div className="glass-panel placeholder-content">
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              {t('SelectChampionPlaceholder')}
            </p>
          </div>
        )}
      </main>

      <footer className="main-footer">
        <div className="container">
          <p>&copy; 2025 {t('FooterDisclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
