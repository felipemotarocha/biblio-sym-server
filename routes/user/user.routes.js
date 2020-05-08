const express = require("express");
const auth = require("../../middlewares/auth/auth.middleware");
const User = require("../../models/user/user.model");
const Book = require("../../models/book/book.model");

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

router.get("/my-books", auth, async ({ user }, res) => {
	try {
		const booksPromises = user.books.map(async ({ bookId }) => await Book.findById(bookId));
		const books = await Promise.all(booksPromises);
		res.send(books);
	} catch (err) {
		res.send();
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

router.post("/sign-in", async ({ body: { email, password } }, res) => {
	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (err) {
		res.status(404).send(err);
	}
});

router.post("/sign-out", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

		await req.user.save();

		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Add Books
router.post("/add-books", auth, async ({ body: { books }, user }, res) => {
	try {
		books.forEach(({ _id, title, author, genre, image }) => {
			user.books = user.books.concat({ _id, title, author, genre, image });
		});
		await user.save();
		res.status(200).send(user.books);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Google OAuth
router.post("/oauth/google", async ({ body: { email, name, googleId } }, res) => {
	try {
		const foundUser = await User.findOne({ email });
		// User doesn't have an account
		if (!foundUser) {
			const newUser = new User({ googleId, email, name });
			const token = await newUser.generateAuthToken();
			res.status(200).send({ user: newUser, token });
		}
		// User already has an account
		if (!foundUser.googleId) {
			foundUser.googleId = googleId;
			await foundUser.save();
		}
		const token = await foundUser.generateAuthToken();
		res.status(200).send({ user: foundUser, token });
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
