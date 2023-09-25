import fs from 'fs';
import CartService from "#services/CartServices.js";
import Cart from "#models/Cart.js"
import { NotFoundError } from "#errors/customErrors.js"
import { jest } from '@jest/globals'

const pathCart = './data/cart-test.json';
const pathCartBackup = './data/cart-test-backup.json';
const pathProduct = './data/products-test.json'
describe('CartService', () => {

    beforeEach(() => {
        fs.copyFileSync(pathCartBackup, pathCart);
    })
    describe('addCart method', () => {
        it('should add a new cart object to the cart array when the cart array is not empty', async () => {
            // Arrange

            const productService = {
                getProductById: jest.fn(),
                updateProductStock: jest.fn()
            };
            const cartService = new CartService(pathCart, productService);
            cartService.cart = [{ id: 1, product: [] }];

            // Act
            await cartService.addCart();

            // Assert
            expect(cartService.cart.length).toBe(2);
            expect(cartService.cart[1]).toBeInstanceOf(Cart);
        });
    });

    describe('add product to cart', () => {
        it('should add a product to an existing cart with available stock', async () => {
            // Arrange
            const productServiceMock = {
                getProductById: jest.fn().mockResolvedValue(
                    {
                        "id": 1,
                        "title": "Laptop",
                        "status": true,
                        "category": "Laptops",
                        "description": "High-performance laptop with 16GB RAM and 512GB SSD",
                        "price": 1200,
                        "thumbnail": "sin imagen",
                        "code": "LP123",
                        "stock": 50
                    }
                ),
                updateProductStock: jest.fn()
            };
            const cartService = new CartService(pathCart, productServiceMock);
            cartService.cart = [{ id: 1, products: [] }];

            // Act
            await cartService.addProductToCart(1, 1);

            // Assert
            expect(cartService.cart[0].products.length).toBe(1);
            expect(cartService.cart[0].products[0].product).toBe(1);
            expect(cartService.cart[0].products[0].quantity).toBe(1);
            expect(productServiceMock.updateProductStock).toHaveBeenCalledWith(1, -1);
        });


        it('should throw a NotFoundError when adding a product to a cart that does not exist', async () => {
            // Arrange
            const productServiceMock = {
                getProductById: jest.fn().mockResolvedValue({
                    "id": 1,
                    "title": "Laptop",
                    "status": true,
                    "category": "Laptops",
                    "description": "High-performance laptop with 16GB RAM and 512GB SSD",
                    "price": 1200,
                    "thumbnail": "sin imagen",
                    "code": "LP123",
                    "stock": 5
                }),
                updateProductStock: jest.fn()
            };
            const cartService = new CartService(pathCart, productServiceMock);

            // Act & Assert
            await expect(cartService.addProductToCart(1, 1)).rejects.toThrowError('Cart with ID 1 does not exist!');
        });

        it('should throw a NotFoundError when adding a product that does not exist to a cart', async () => {
            // Arrange
            const productServiceMock = {
                getProductById: jest.fn().mockRejectedValue(new NotFoundError(`Product with ID 1 not found!`)),
                updateProductStock: jest.fn()
            };
            const cartService = new CartService(pathCart, productServiceMock);
            cartService.cart = [{ id: 1, products: [] }];

            // Act & Assert
            await expect(cartService.addProductToCart(1, 1)).rejects.toThrowError('Product with ID 1 not found!');
        });

    })

    describe('getCarts', () => {
        it('should return the correct cart object if there are multiple carts in the cart array', async () => {

            const productService = {
                getProductById: jest.fn(),
                updateProductStock: jest.fn()
            };

            const cartService = new CartService(pathCart, productService);
            cartService.cart = [
                {
                    "id": 1,
                    "products": []
                },
                {
                    "id": 2,
                    "products": []
                },
                {
                    "id": 3,
                    "products": []
                }
            ]
            const result = await cartService.getCartById(3);

            expect(result).toEqual({ "id": 3, "products": [] });
        });
    })
})
