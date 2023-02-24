const ChatModel = require("../model/chat.model");
const UserModel = require("../model/user.model");

class ChatController {
  constructor() {}
  async create(req, res) {
    try {
      const { userId } = req.body;
      console.log(req.body);
      if (!userId) {
        console.log("UserId not recieved.");
        return res.sendStatus(400);
      }
      let isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");
      isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "username _id",
      });
      if (isChat && isChat.length > 0) {
        return res.send(isChat[0]);
      } else {
        let createdChat = await ChatModel.create({
          isGroupChat: false,
          users: [req.user._id, userId],
          chatName: "sender",
        });
        let fullChat = await ChatModel.findOne({
          _id: createdChat._id,
        }).populate("users", "-password");
        res.status(200).send(fullChat);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
  async get(req, res) {
    try {
      let Chats = await ChatModel.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      Chats = await UserModel.populate(Chats, {
        path: "latestMessage.sender",
        select: "username _id",
      });
      res.status(200).send(Chats);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
  async createGroup(req, res) {
    try {
      const { users, name } = req.body;
      if ((!users || !name) && users.length < 2) {
        return res.status(400).send({ message: "Group criteria not met." });
      }
      const groupChat = await ChatModel.create({
        chatName: name,
        users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });
      const getGroupChat = await ChatModel.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      return res.status(200).json({ chat: getGroupChat });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
  async addToGroup(req, res) {
    try {
      const { userId, groupId } = req.body;
      const added = await ChatModel.findOneAndUpdate(
        { _id: groupId },
        { $push: { userId } },
        { new: true }
      );
      if (!added) {
        return res.status(404).send("Chat not found.");
      } else {
        return res.status(200).send("User added to the group.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
  async removeFromGroup(req, res) {
    try {
      const { userId, groupId } = req.body;
      const removed = await ChatModel.findOneAndUpdate(
        { _id: groupId },
        { $pull: { userId } },
        { new: true }
      );
      if (!removed) {
        return res.status(404).send("Chat not found.");
      } else {
        return res.status(200).send("User removed from the group.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
}

module.exports = new ChatController();
