const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
});

genreSchema.virtual("books", {
    ref: "Book",
    localField: "title",
    foreignField: "genre",
});

genreSchema.statics.getGenresWithBooks = async () => {
    const genres = await Genre.find({});
    return Promise.all(
        genres.map(async (genre) => {
            await genre.populate("books").execPopulate();
            return { genre: genre.title, books: genre.books };
        })
    );
};

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
