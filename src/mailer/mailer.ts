import { createTransport } from "nodemailer";
import { nodemailerPassword, nodemailerUser } from "../constants.js";

export const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerPassword,
  },
});
