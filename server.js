const app = require("./app");
const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://Jack:naYLGJxh3pr3vGm4@cluster0.7awa50v.mongodb.net/contactsList?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });

// naYLGJxh3pr3vGm4
