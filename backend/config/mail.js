import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Syncro",
      link: "https://syncro.com/",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure that you have provided yor MAILTRAP credentials in the .env file",
    );
    console.error("Error: ", error);
  }
};

const emailVerificationMailgenContent = (username, otp) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're excited to have you on board.",

      action: {
        instructions: "Use this OTP to verify your account:",
        button: {
          color: "#22BC66",
          text: otp,
          link: "#", 
        },
      },

      outro: "This OTP is valid for 5 minutes only.",
    },
  };
};

export { emailVerificationMailgenContent, sendEmail };
