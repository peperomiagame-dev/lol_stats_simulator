import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DDragonService } from '../services/ddragon';
import type { ItemData } from '../types/ddragon';
import { hiraToKata } from '../utils/text';
import './ItemSelector.css';

interface ItemSelectorProps {
    onSelect: (item: ItemData) => void;
    lang: string;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({ onSelect, lang }) => {
    const [items, setItems] = useState<ItemData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        DDragonService.getItems(lang).then((res) => {
            // Filter out items that are not purchasable or are for specific maps
            const rawItems = Object.values(res.data).filter(item => {
                // Exclude specific unwanted items by name or tag
                if (item.name.includes('身代わり') || item.tags.includes('Trinket') || item.name.includes('ワード')) return false;

                // Include specific evolved items even if not purchasable
                // Muramana (3042), Seraph's Embrace (3040), Fimbulwinter (3121)
                const evolvedIds = ['3042', '3040', '3121'];
                if (evolvedIds.includes(item.image.full.replace('.png', ''))) return true;

                return item.gold.purchasable &&
                    item.maps['11'] &&
                    !item.tags.includes('Consumable') &&
                    item.name !== '';
            });

            // Deduplicate items by name (keeps the first occurrence, usually the base one)
            // Using a Map to ensure uniqueness by name
            const uniqueItemsMap = new Map();
            rawItems.forEach(item => {
                const normalizedName = item.name.trim();
                if (!uniqueItemsMap.has(normalizedName)) {
                    uniqueItemsMap.set(normalizedName, item);
                }
            });

            const validItems = Array.from(uniqueItemsMap.values())
                .sort((a, b) => a.gold.total - b.gold.total);

            setItems(validItems);
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

    const filteredItems = items.filter(item => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        const searchKata = hiraToKata(search);

        // Special case: "Experimental Hexplate" (実験的ヘクスプレート) has "namida" in colloq, exclude it if searching for "namida"
        // unless the user specifically types "hex" or "plate"
        if ((search === '涙' || search === 'namida' || search === 'なみだ') && item.name.includes('ヘクスプレート')) {
            return false;
        }

        return item.name.toLowerCase().includes(search) ||
            item.name.includes(searchKata) ||
            (item.colloq && item.colloq.toLowerCase().includes(search));
    });

    const labels = {
        add: lang === 'ja_JP' ? 'アイテムを追加' : 'Add Item',
        select: lang === 'ja_JP' ? 'アイテムを選択' : 'Select Item',
        search: lang === 'ja_JP' ? 'アイテムを検索...' : 'Search items...',
    };

    const modalContent = isOpen ? (
        <div className="item-selector-modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="item-selector-modal glass-panel" onClick={e => e.stopPropagation()}>
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

                <div className="items-grid">
                    {filteredItems.map(item => (
                        <div
                            key={item.name} // Using name as key since we deduplicated by name
                            className="item-option"
                            onClick={() => {
                                onSelect(item);
                                setIsOpen(false);
                                setSearchTerm('');
                            }}
                            title={`${item.name} (${item.gold.total}g)`}
                        >
                            <img
                                src={DDragonService.getImageUrl('item', item.image.full)}
                                alt={item.name}
                                loading="lazy"
                            />
                            {/* Cost display removed as requested */}
                            <div className="item-info-overlay">
                                <span className="item-name-overlay">{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="item-selector-container">
            <button className="add-item-btn glass-panel" onClick={() => setIsOpen(true)}>
                <span className="plus-icon">+</span>
                <span className="btn-label">{labels.add}</span>
            </button>

            {modalContent && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
};
