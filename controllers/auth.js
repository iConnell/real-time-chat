const { UnauthorisedError, BadRequestError } = require("../errors");
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
    throw new UnauthorisedError("Username or password incorrect");
  }

  if (!user.isActive) {
    return res
      .status(401)
      .json({ msg: "Verify your account before you proceed" });
  }

  const token = await user.createToken();
  res.status(200).json({ token });
};

const changePassword = async (req, res) => {
  const { username } = req.user;

  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    throw new BadRequestError("Enter old and new password");
  }

  const user = await User.findOne({ username });

  const isMatch = await user.checkPassword(password);

  if (!isMatch) {
    throw new UnauthorisedError("Wrong password");
  }

  user.password = newPassword;
  user.save();

  res.status(200).send("Password Changed Successfully");
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("You must enter your email");
  }

  try {
    const user = await User.findOne({ email });
    const resetPasswordToken = await user.createToken();

    await emailTransport.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `
        <div>
          <h3>Hi! You cannot seem to remember your password.</h3>
          <h4>Don"t worry, we've got you covered</h4>
          <h4>Click the link below to reset your password</h4>
          <a href="${process.env.HOST}/auth/reset-password/${resetPasswordToken}">Reset Password</a>
        </div>
      `,
    });
  } catch (error) {
    // pass
  }

  res
    .status(200)
    .send("A Password reset email will be sent if user with that email exists");
};

const resetPasswordConfirm = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const { username } = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);

  const { password, password1 } = req.body;
  if (!password || !password1) {
    throw new BadRequestError("Enter new password");
  }

  if (password !== password1) {
    throw new BadRequestError("Passwords must match");
  }

  const user = await User.findOne({ username });

  user.password = password;
  user.save();
  res.status(200).send("Password changed successfully");
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
  changePassword,
  resetPassword,
  resetPasswordConfirm,
  deleteAllUsers,
};
