/**
 * Converts Hiragana characters in a string to Katakana.
 * Useful for matching Japanese input against Katakana names.
 */
export const hiraToKata = (str: string): string => {
    return str.replace(/[\u3041-\u3096]/g, (match) => {
        const chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
};
