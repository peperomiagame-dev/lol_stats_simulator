import React from 'react';
import { DDragonService } from '../services/ddragon';
import type { ItemData } from '../types/ddragon';
import './Inventory.css';

interface InventoryProps {
    items: (ItemData | null)[];
    onRemoveItem: (index: number) => void;
    lang: string;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onRemoveItem, lang }) => {
    // Ensure we always display 6 slots
    const slots = [...items, ...Array(6 - items.length).fill(null)].slice(0, 6);

    const labels = {
        title: lang === 'ja_JP' ? 'インベントリ' : 'Inventory',
        remove: lang === 'ja_JP' ? 'クリックして削除' : 'Click to remove',
    };

    return (
        <div className="inventory-container glass-panel">
            <div className="inventory-grid">
                {slots.map((item, index) => (
                    <div key={index} className="inventory-slot">
                        {item ? (
                            <div className="item-content" onClick={() => onRemoveItem(index)} title={labels.remove}>
                                <img
                                    src={DDragonService.getImageUrl('item', item.image.full)}
                                    alt={item.name}
                                />
                            </div>
                        ) : (
                            <div className="empty-slot" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
