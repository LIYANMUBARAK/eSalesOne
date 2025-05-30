import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.host,
  port: Number(process.env.port),
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

export default transport;
