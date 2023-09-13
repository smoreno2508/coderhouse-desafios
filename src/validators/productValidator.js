export const validateProduct = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || typeof price !== 'number' || !thumbnail || !code || typeof stock !== 'number') {
        throw new Error('Todos los campos son obligatorios!!');
    }

    if (price < 0 ) {
        throw new Error('El precio deben ser un valor positivo.');
    }

    if (stock < 0) {
        throw new Error('El stock deben ser un valor positivo.');
    }

    if (title.length < 3) {
        throw new Error('El nombre del producto debe tener al menos 3 caracteres');
    }
};