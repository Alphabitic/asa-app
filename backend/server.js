const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to DB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connecté aux bases de données"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/recruiter", require("./routes/api/recruiter"));
app.use("/api/listing", require("./routes/api/listing"));
app.use("/api/applicant", require("./routes/api/applicant"));
app.use("/api/application", require("./routes/api/application"));
app.use("/api/rating", require("./routes/api/rating"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
  console.log(`Serveur connecté sur le port ${PORT}`);
});

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname,"frontend", "./frontend/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "frontend", "./frontend/build", "index.html"));
});
