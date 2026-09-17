const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const organizationSchema = mongoose.Schema({
  title: String,
  description: String,
  admin: mongoose.Types.ObjectId,
  member: [mongoose.Types.ObjectId],
});

const boardSchema = mongoose.Schema({
  title: String,
  description: String,
  organization: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const organizationModel = mongoose.model("organization", organizationSchema);
const boardModel = mongoose.model("board", boardSchema);

module.exports = {
  userModel,
  organizationModel,
  boardModel,
};
