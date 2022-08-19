const { UnauthorizedError, BadRequestError } = require("../errors");
const User = require("../models/User");
const emailTransport = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { password, password2 } = req.body;

  if (password !== password2) {
    throw new BadRequestError("The two passwords must match");
  }

  delete req.body.password2;

  const user = await User.create({ ...req.body });

  const verificationToken = await user.createToken();

  const verificationUrl = `${process.env.HOST}/api/auth/verify/${verificationToken}`;

  await emailTransport.sendMail({
    from: process.env.FROM_EMAIL,
    to: req.body.email,
    subject: "Verify Your account",
    html: `Click <a href='${verificationUrl}'> Here </a> to confirm your email address`,
  });

  res.status(201).json({ msg: `Verification email sent to ${req.body.email}` });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  await User.findOneAndUpdate(
    {
      _id: payload.id,
      username: payload.username,
    },
    { isActive: true }
  );

  res.status(200).json({ msg: "Account verified" });
};

// Todo: Username or email login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("You must enter username and password");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthorizedError("Username or Password incorrect");
  }

  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    throw new UnauthorizedError("Username or password incorrect");
  }

  if (!user.isActive) {
    return res
      .status(401)
      .json({ msg: "Verify your account before you proceed" });
  }

  const token = await user.createToken();
  res.status(200).json({ token });
};

// For testing purposes
const deleteAllUsers = async (req, res) => {
  const del = await User.deleteMany({});

  res.status(200).json(del);
};

module.exports = {
  login,
  register,
  verifyEmail,
  deleteAllUsers,
};
