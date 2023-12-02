import { Router } from 'express';

import * as viewController from '../controllers/ViewController.js';

const router = Router();

router.get('/', viewController.renderHomePage);
router.get("/cart/:cid", viewController.getCartById);
router.get("/product/:pid", viewController.getProductsById);

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts")
});

router.get("/chat", async (req, res) => {
    res.render("chat")
});

router.get("/login", async (req, res) => {
    const messages = req.flash("error");
    res.render("login", { messages: messages});
})

router.get("/register", async (req, res) => {
    res.render("register");
});

router.get("/noAuthorized", async (req, res) => {
    res.render("noAuthorized");
});

export default router;