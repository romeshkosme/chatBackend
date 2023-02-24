const UserModel = require("../model/user.model");
const { createHash, compareHash, createJwt } = require("../helper/utils");

class AuthController {
  constructor() {}
  async register(req, res) {
    try {
      let { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (user) {
        res.status(409).json({ message: "Username already registered." });
        return;
      }
      password = await createHash(password);
      const newUser = await UserModel.create({
        username,
        password,
      });
      const token = await createJwt({ username, _id: newUser._id });
      res.status(200).json({
        token,
        user: { username, _id: newUser._id },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (!user) {
        res.status(401).json({ message: "User not registered." });
        return;
      }
      const pwdCompare = await compareHash(password, user.password);
      if (pwdCompare) {
        const token = await createJwt({
          username: user.username,
          _id: user._id,
        });
        res.status(200).json({ token, user: { username, _id: user._id } });
      } else {
        res.status(401).json({ message: "Invalid credential." });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
}

module.exports = new AuthController();
