const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.SECURE = async function (req, res, next) {
  try {
    const token = req.headers.authorization; // changed to lowercase 'authorization'
    console.log(token);
    if (!token) {
      throw new Error("you are not loging");
    }
    const chektoken = await jwt.verify(token, "CHATAPP");
    console.log(chektoken.user);
    const chekuser = await User.findById(chektoken.user);
    if (!chekuser) {
      throw new Error("you are not vaild user");
    }
    next();
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.alluser = async function (req, res, next) {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword);
  res.send(users);
};
exports.signup = async (req, res) => {
  try {
    const { name, email, pass, pic } = req.body;

    if (!name || !email || !pass || !pic) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(pass, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    // Save the user
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error); // Log detailed error for debugging
    res.status(500).json({
      message: error.message || "Error occurred during registration.",
    });
  }
};

exports.login = async function (req, res, next) {
  try {
    const { email, pass } = req.body; // Change 'pass' to the correct field
    if (!email || !pass) {
      throw new Error("Enter valid Details");
    }

    // Find user by email
    const loginuser = await User.findOne({ email: req.body.email });
    if (!loginuser) {
      throw new Error("User does not exist");
    }

    // Compare the password entered by the user with the hashed password in the database
    const checkPass = bcrypt.compareSync(pass, loginuser.password); // Correct the key 'pass' here
    if (!checkPass) {
      throw new Error("Wrong password");
    }

    // Generate JWT token
    const token = jwt.sign({ user: loginuser._id }, "CHATAPP");

    // Send success response
    res.status(200).json({
      status: "success",
      data: loginuser,
      token,
    });
  } catch (error) {
    // Send error response
    res.status(404).json({
      status: "fail",
      error: error.message,
    });
  }
};
