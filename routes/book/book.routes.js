const express = require("express");
const Book = require("../../models/book/book.model");

const router = new express.Router();

router.get("/", async (req, res) => {
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
        const { title, availableForLoan } = body;

        const registeredBook = await Book.findOne({ title });

        if (registeredBook) {
            registeredBook.availableForLoan += availableForLoan;
            await registeredBook.save();
            res.status(200).send(registeredBook);
        } else {
            const book = new Book(body);
            await book.save();
            res.status(200).send(book);
        }
    } catch ({ message }) {
        res.status(400).send(message);
    }
});

router.post('/new-loan', async ({ body: { bookIds } }, res) => {
    try {
        for (let bookId of bookIds) {
            const book = await Book.findById(bookId);
            book.availableForLoan -= 1;
            book.onLoan += 1;
            await book.save();
        }

        res.status(200).send();
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = router;
