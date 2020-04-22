const mongoose = require("mongoose");
const dbPassword = require("../credentials/db/db.credential");

mongoose.connect(
    `mongodb+srv://fmrocha:${dbPassword}@biblio-sym-cluster-weh7r.gcp.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

// mongodb+srv://fmrocha:fu43LRFfAQ0lI3vM@biblio-sym-cluster-weh7r.gcp.mongodb.net/data
