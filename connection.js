const mongoose = require("mongoose");

const connectToMongoDb = async (url) => {
  mongoose.connect(url);
};

module.exports = {
  connectToMongoDb,
};
