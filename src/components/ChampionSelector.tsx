import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DDragonService } from '../services/ddragon';
import type { ChampionData } from '../types/ddragon';
import { hiraToKata } from '../utils/text';
import './ChampionSelector.css';

interface ChampionSelectorProps {
    onSelect: (champion: ChampionData) => void;
    selectedChampionId?: string;
    lang: string;
}

export const ChampionSelector: React.FC<ChampionSelectorProps> = ({ onSelect, selectedChampionId, lang }) => {
    const [champions, setChampions] = useState<ChampionData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        DDragonService.getChampions(lang).then((res) => {
            const sorted = Object.values(res.data).sort((a, b) => a.name.localeCompare(b.name));
            setChampions(sorted);
        });
    }, [lang]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const filteredChampions = champions.filter(c => {
        const search = searchTerm.toLowerCase();
        const searchKata = hiraToKata(searchTerm);
        return c.name.toLowerCase().includes(search) ||
            c.name.includes(searchKata) ||
            c.id.toLowerCase().includes(search);
    });

    const selectedChampion = champions.find(c => c.id === selectedChampionId);

    const labels = {
        select: lang === 'ja_JP' ? 'チャンピオンを選択' : 'Select Champion',
        search: lang === 'ja_JP' ? 'チャンピオンを検索...' : 'Search champion...',
    };

    const modalContent = isOpen ? (
        <div className="champion-selector-modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="champion-selector-modal glass-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{labels.select}</h3>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="search-container" style={{ position: 'relative', margin: 'var(--spacing-sm) var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder={labels.search}
                        className="search-input"
                        style={{ margin: 0, width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="champions-grid">
                    {filteredChampions.map(champion => (
                        <div
                            key={champion.id}
                            className={`champion-option ${selectedChampionId === champion.id ? 'active' : ''}`}
                            onClick={() => {
                                onSelect(champion);
                                setIsOpen(false);
                                setSearchTerm('');
                            }}
                            title={champion.name}
                        >
                            <img
                                src={DDragonService.getImageUrl('champion', champion.image.full)}
                                alt={champion.name}
                                loading="lazy"
                            />
                            <div className="champion-info-overlay">
                                <span className="champion-name-overlay">{champion.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="champion-selector-container">
            {/* Trigger Button - now looks like a big card or the add item button */}
            <div
                className="champion-trigger glass-panel"
                onClick={() => setIsOpen(true)}
                title={labels.select}
            >
                {selectedChampion ? (
                    <div className="trigger-content-selected">
                        <img
                            src={DDragonService.getImageUrl('champion', selectedChampion.image.full)}
                            alt={selectedChampion.name}
                            className="champion-icon-lg"
                        />
                        <span className="champion-name-display">{selectedChampion.name}</span>
                    </div>
                ) : (
                    <div className="trigger-content-empty">
                        <span className="plus-icon">+</span>
                        <span className="btn-label">{labels.select}</span>
                    </div>
                )}
            </div>

            {modalContent && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
};
