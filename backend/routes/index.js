var express = require("express");
var router = express.Router();
const controller = require("../controller/usercontro");
const chatcontroller = require("../controller/chatcontro");
const messagecontroller = require("../controller/messagecontroller");

// Make sure chatcontroller.accesschat is defined and exported properly
// Check if controller functions are available

router.get("/quickchat/alluser", controller.SECURE, controller.alluser);
router.post("/quickchat/signup", controller.signup);
router.post("/quickchat/login", controller.login);

// Ensure accesschat is defined in chatcontroller
router.post(
  "/quickchat/chat",
  chatcontroller.SECURE,
  chatcontroller.accesschat
); // Ensure chatcontroller.accesschat exists
router.get(
  "/quickchat/fetchchat",
  chatcontroller.SECURE,
  chatcontroller.fetchchat
);
router.post(
  "/quickchat/group",
  chatcontroller.SECURE,
  chatcontroller.createGroupchat
);
router.put(
  "/quickchat/rename",
  chatcontroller.SECURE,
  chatcontroller.renameGroup
);
router.put(
  "/quickchat/addgroup",
  chatcontroller.SECURE,
  chatcontroller.addgroup
);
router.put(
  "/quickchat/removegroup",
  chatcontroller.SECURE,
  chatcontroller.removefromgroup
);

router.post(
  "/quickchat/sendmessage",
  messagecontroller.SECURE,
  messagecontroller.sendmessage
);

router.get(
  "/quickchat/allmessage/:chatId",
  messagecontroller.SECURE,
  messagecontroller.allmessage
);
module.exports = router;
