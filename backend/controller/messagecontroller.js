const Message = require("../Model/messageModel");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Chat = require("../Model/Chatmodel");
exports.SECURE = async function (req, res, next) {
  try {
    const token = req.headers.authorization; // changed to lowercase 'authorization'
    console.log(token);
    if (!token) {
      throw new Error("you are not loging");
    }
    const chektoken = jwt.verify(token, "CHATAPP");
    console.log(chektoken.user);
    const chekuser = await User.findById(chektoken.user);
    if (!chekuser) {
      throw new Error("you are not vaild user");
    }
    req.user = chekuser;
    next();
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.sendmessage = async function (req, res, next) {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request", req.body);
    return res.status(400).json({ error: "Invalid data" });
  }

  // 🔥 Step 1: Check if chatId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid chat ID format" });
  }

  try {
    // 🔥 Step 2: Check if chat exists
    let chatExists = await Chat.findById(chatId);

    if (!chatExists) {
      console.log("Chat not found. Creating new chat...");

      chatExists = await Chat.create({
        users: [req.user._id], // ⚡ Modify this to add correct user IDs
      });

      console.log("New chat created:", chatExists._id);
    }

    // 🔥 Step 3: Create a new message
    var newMessage = new Message({
      sender: req.user._id,
      content: content,
      chat: chatExists._id, // Use the correct chat ID
    });

    // Save message first
    let message = await newMessage.save();

    // 🔥 Step 4: Populate chat correctly
    message = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    // 🔥 Step 5: Update latest message in chat
    await Chat.findByIdAndUpdate(chatExists._id, {
      latestMessage: message._id,
    });

    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.allmessage = async function (req, res, next) {
  try {
    const { chatId } = req.params;
    console.log("Chat ID received:", chatId);

    const message = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
