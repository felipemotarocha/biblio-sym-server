const express = require("express");
const Genre = require("../../models/genre/genre.model");

const router = new express.Router();

router.get("/", async (req, res) => {
	try {
		const genres = await Genre.find({});

		if (req.query.sortBy === "alphabetical") {
			const sortedGenres = genres.sort(function (a, b) {
				var textA = a.title.toUpperCase();
				var textB = b.title.toUpperCase();
				return textA < textB ? -1 : textA > textB ? 1 : 0;
			});

			res.status(200).send(sortedGenres);
			return;
		}

		res.status(200).send(genres);
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
		const existentGenre = await Genre.findOne({ title });
		if (existentGenre) {
			throw new Error("This genre already exists.");
		}

		const genre = new Genre({ title: title.toLowerCase() });
		await genre.save();

		const genres = await Genre.find({});

		res.status(201).send({ addedGenre: genre, allGenres: genres });
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
