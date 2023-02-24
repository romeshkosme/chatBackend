const mongoose = require("mongoose");

function connectDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected!"))
    .catch((err) => {
        console.log(err)
    })
}

module.exports = connectDb;