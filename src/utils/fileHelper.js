import fs from 'fs/promises'; // This imports the promise-based version of fs

export const readFile = async (path) => {
    try {
        if (await fs.stat(path)) {
            const data = await fs.readFile(path, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist
            return [];
        }
        throw new Error(`Error reading file: ${error.message}`);
    }
};

export const writeFile = async (path, data) => {
    try {
        await fs.writeFile(path, JSON.stringify(data));
    } catch (error) {
        throw new Error(`Error writing to file: ${error.message}`);
    }
};
