const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    usenewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Established connection to the database."))
  .catch((err) =>
    console.log("Something went wrong when connecting to the database.", err)
  );
