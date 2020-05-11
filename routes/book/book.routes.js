const express = require("express");
const auth = require("../../middlewares/auth/auth.middleware");
const Book = require("../../models/book/book.model");
const Genre = require("../../models/genre/genre.model");

const router = new express.Router();

router.get("/all", async (req, res) => {
    try {
        res.status(200).send(await Book.find({}));
    } catch ({ message }) {
        status(400).send(message);
    }
});

router.get("/:id", async ({ params: { id } }, res) => {
    try {
        const book = await Book.findById(id);
        if (!book) {
            throw new Error("Book not found.");
        }
        res.status(200).send(book);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.get("/:genre", async ({ params: { genre } }, res) => {
    try {
        res.status(200).send(await Book.findByGenre(genre));
    } catch ({ message }) {
        res.status(404).send(message);
    }
});

router.post("/", async ({ body }, res) => {
    try {
        const { title, genre } = body;
        const registeredBook = await Book.findOne({ title });

        if (registeredBook) {
            throw new Error("This book already exists in the database.");
        }

        // Checking if entered Genre ID is valid
        await Genre.findById(genre).catch((err) => {
            throw new Error("This genre does not exist.");
        });

        const book = new Book(body);
        await book.save();
        res.status(200).send(book);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post(
    "/add/:bookId",
    async ({ body: { quantity }, params: { bookId } }, res) => {
        try {
            const book = await Book.findById(bookId);
            book.availableForLoan += quantity;
            await book.save();
            res.status(200).send(book);
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.post("/new-loan", auth, async ({ body: { books }, user }, res) => {
    try {
        for (let book of books) {
            const currentBook = await Book.findById(book._id);
            currentBook.availableForLoan -= 1;
            currentBook.onLoan += 1;
            await currentBook.save();

            // Adding book to the user account
            const { _id, title, author, genre, image } = currentBook;
            user.books = user.books.concat({
                _id,
                title,
                author,
                genre,
                image,
            });

            await user.save();
        }

        res.status(200).send(user.books);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
