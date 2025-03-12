const Chat = require("../Model/Chatmodel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../Model/userModel");

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

exports.accesschat = async function (req, res, next) {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("letestMessage");

  isChat = await User.populate(isChat, {
    path: "letestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
exports.fetchchat = async function (req, res, next) {
  try {
    console.log("Request Headers:", req.headers);
    console.log("Decoded User from Middleware:", req.user);

    if (!req.user?._id) {
      return res.status(400).json({ error: "User not found in request" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id.toString());

    let results = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("letestMessage")
      .sort({ updatedAt: -1 });

    // Populate latestMessage sender details
    results = await User.populate(results, {
      path: "letestMessage.sender",
      select: "name pic email",
    });

    console.log("Fetched chats:", results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.createGroupchat = async function (req, res, next) {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill the all fields" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("more than 2 users required for group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const FullgroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(FullgroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
exports.renameGroup = async function (req, res) {
  try {
    const { chatId, chatName } = req.body;

    console.log("Rename Request Received:", { chatId, chatName });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      console.log("Chat not found or rename failed");
      return res
        .status(404)
        .json({ message: "Chat not found or rename failed" });
    }

    console.log("Rename Successful, sending response:", updatedChat);
    return res.status(200).json(updatedChat); // ✅ Ensure correct status and response
  } catch (error) {
    console.error("Rename Group Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.addgroup = async function (req, res, next) {
  try {
    const { chatId, userId } = req.body;
    console.log("Adding User:", userId, "to Chat:", chatId);

    const chat = await Chat.findById(chatId);
    console.log("Chat Found:", chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log("Admin ID:", chat.groupAdmin.toString());
    console.log("Requesting User ID:", req.user._id.toString());

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admins can add someone!" });
    }

    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User already in the group" });
    }

    chat.users.push(userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    console.log("Updated Chat:", updatedChat);
    return res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Add User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removefromgroup = async function (req, res, next) {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error(error.message);
  } else {
    res.json(removed);
  }
};
