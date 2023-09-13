import fs from 'fs';

export const readFile = (path) => {
    if (fs.existsSync(path)) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (error) {
            throw new Error('Error reading file: ' + error);
        }
    }
    return [];
};

export const writeFile = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
    } catch (error) {
        throw new Error('Error writing to file: ' + error);
    }
}