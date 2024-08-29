export const convertToMathNotation = (input) => {
    const superscriptMap = {
        '¹': '1',
        '²': '2',
        '³': '3',
        '⁴': '4',
        '⁵': '5',
        '⁶': '6',
        '⁷': '7',
        '⁸': '8',
        '⁹': '9'
    };
    const match = input.match(/^(\d+)([¹²³⁴⁵⁶⁷⁸⁹]+)$/);
    if (!match) {
        return input;
    }

    const base = match[1]; //return the base value part
    const superscriptPart = match[2];//return the superscript part

    //replace the superscript part with the numbers
    const superscriptNumber = superscriptPart.split('').map(char => superscriptMap[char] || '').join('');

    return `${base}^${superscriptNumber}`;
};


