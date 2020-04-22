const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../../middlewares/auth/auth.middleware");
const User = require("../../models/user/user.model");

const router = new express.Router();

router.get("/", async (req, res) => {
    try {
        res.status(200).send(await User.find({}));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/", async ({ body: { name, email, password } }, res) => {
    try {
        const user = new User({ name, email, password });
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/login", async ({ body: { email, password } }, res) => {
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (err) {
        res.status(404).send(err);
    }
});

router.post("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );

        await req.user.save();

        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
