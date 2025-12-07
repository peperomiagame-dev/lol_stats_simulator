import React from 'react';
import './LevelSelector.css';

interface LevelSelectorProps {
    level: number;
    onChange: (level: number) => void;
    lang: string;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ level, onChange }) => {
    return (
        <div className="level-selector glass-panel">
            <div className="level-controls">
                <button
                    className="level-btn"
                    onClick={() => onChange(Math.max(1, level - 1))}
                    disabled={level <= 1}
                >
                    -
                </button>
                <span className="current-level">{level}</span>
                <button
                    className="level-btn"
                    onClick={() => onChange(Math.min(18, level + 1))}
                    disabled={level >= 18}
                >
                    +
                </button>
            </div>
            <input
                type="range"
                min="1"
                max="18"
                value={level}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="level-slider"
            />
        </div>
    );
};
