export const spliceTextHelper = (text: string): string => {
    if (text.length <= 12) return text;

    const newText = text.trim().split(/\s+/)

    return newText.slice(0, 20).join(' ') + '...'
   
};
