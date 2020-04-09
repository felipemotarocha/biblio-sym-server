const mongoose = require("mongoose");
const dbPassword = require("../credentials/db/db.credential");

mongoose.connect(
    `mongodb+srv://fmrocha:${dbPassword}@biblio-sym-cluster-weh7r.gcp.mongodb.net/data`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);
