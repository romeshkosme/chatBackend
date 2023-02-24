const MessageModel = require("../model/message.model");
const UserModel = require("../model/message.model");
const ChatModel = require("../model/chat.model");

class MessageContoller {
  constructor() {}
  async create(req, res) {
    try {
      const { content, chatId } = req.body;
      if (!chatId || !content) {
        return res.status(400).send("Invalid data.");
      }
      const payload = {
        sender: req.user._id,
        content,
        chat: chatId,
      };
      let message = await MessageModel.create(payload);
      message = await message.populate("sender", "username _id");
      message = await message.populate("chat");
      message = await UserModel.populate(message, {
        path: "chat.user",
        select: "username _id",
      });
      await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
      return res.status(200).send(message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async getAllMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await MessageModel.find({ chat: chatId })
        .populate("sender", "username _id")
        .populate("chat");
      res.status(200).send(messages);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}

module.exports = new MessageContoller();
