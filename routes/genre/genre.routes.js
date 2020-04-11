const express = require("express");
const Genre = require("../../models/genre/genre.model");

const router = new express.Router();

router.get("/", async (req, res) => {
    try {
        res.status(200).send(await Genre.find({}));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/books", async (req, res) => {
    try {
        const genresWithBooks = await Genre.getGenresWithBooks();
        res.status(200).send(genresWithBooks);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/:genre/books", async ({ params }, res) => {
    try {
        const genre = await Genre.find({});
        await genre.populate("books").execPopulate();
        res.status(200).send(genre);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/", async ({ body: { title } }, res) => {
    try {
        const genre = new Genre({ title });
        await genre.save();
        res.status(201).send(genre);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete("/:genre", async ({ params: { genre } }, res) => {
    try {
        const genreToDelete = await Genre.findOneAndDelete({ title: genre });
        if (!genreToDelete) {
            throw new Error("Genre not found.");
        }
        res.status(200).send(genreToDelete);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

module.exports = router;
