export default class Product {
    constructor(id, title, status, category, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.status = status || true;
        this.category = category;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}