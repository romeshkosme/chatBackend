const UserModel = require("../model/user.model");

class UserController {
  constructor() {}
  async get(req, res) {
    try {
      const { username } = req.query;
      const response = await UserModel.find(
        { username },
        { username: 1, _id: 1 }
      );
      if (response) {
        res.status(200).json({ users: response });
      } else {
        res.status(200).json({ message: "User not found." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
}

module.exports = new UserController();
