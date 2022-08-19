const nodemailer = require("nodemailer");

const tranporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: process.env.ELASTIC_USER,
    pass: process.env.ELASTIC_API_KEY,
  },
});

module.exports = tranporter;
