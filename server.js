// require('dotenv').config();
// const express = require('express');
// // const { MailtrapClient } = require('mailtrap');
// const nodemailer = require('nodemailer');

// const { validate } = require('deep-email-validator');
// const path = require('path');

// const cors=require("cors");

// const app = express();
// app.use(cors({ origin: true }));

// const PORT = process.env.PORT || 3000;


// // Middleware

// app.use(express.json());





// // Function to verify reCAPTCHA
// // async function verifyRecaptcha(token) {
// //    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
// //    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`;


// //    const response = await fetch(recaptchaUrl, { method: 'POST' });
// //    const result = await response.json();


// //    return result.success;
// // }


// // Endpoint to handle form submission and send email
// app.post('/send-email', async (req, res) => {
//      const { name, email, subject, message, 
//         // 'g-recaptcha-response': recaptchaToken 
//     } = req.body;
  
//      if (!name || !email || !subject || !message 
//         // || !recaptchaToken
//     ) {
//          return res.status(400).json({ status: 'error', message: 'Missing required fields!' });
//      }
  
//     //  const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
//     //  if (!isRecaptchaValid) {
//     //      return res.status(400).json({
//     //          status: 'error',
//     //          message: 'reCAPTCHA verification failed. Please try again.'
//     //      });
//     //  }
  
//      const validationResult = await validate(email);
//      if (!validationResult.valid) {
//          return res.status(400).json({
//              status: 'error',
//              message: 'Email is not valid. Please try again!',
//              reason: validationResult.reason
//          });
//      }
  
//      // ✅ Nodemailer transporter using SMTP
//      const transporter = nodemailer.createTransport({
//          host: process.env.SMTP_HOST,
//          port: process.env.SMTP_PORT,
//          auth: {
//              user: process.env.SMTP_USER,
//              pass: process.env.SMTP_PASS
//          }
//      });
  
//      const mailOptions = {
//          from: ` <${email}>`,
//          form:email,
//          to: process.env.EMAIL_TO,
//          subject: subject,
//          text: `From: ${name}\nEmail: ${email}\n\n${message}`
//      };
  
//      try {
//          const info = await transporter.sendMail(mailOptions);
//          console.log('Email sent: ', info.messageId);
  
//          res.status(200).json({
//              status: 'success',
//              message: 'Email successfully sent'
//          });
//      } catch (error) {
//          console.error('Email send error:', error);
//          res.status(500).json({
//              status: 'error',
//              message: 'Failed to send email due to server error.'
//          });
//      }
//   });
  


// app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { validate } = require('deep-email-validator');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configure CORS properly
const corsOptions = {
    origin: ["http://localhost:3000", "https://portolio-1gj0.onrender.com"], // Add your frontend URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields!' });
    }

    // const validationResult = await validate(email);
    // if (!validationResult.valid) {
    //     return res.status(400).json({
    //         status: 'error',
    //         message: 'Email is not valid. Please try again!',
    //         reason: validationResult.reason
    //     });
    //}

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: ` <${email}>`,
        to: process.env.EMAIL_TO,
        subject: subject,
        text: `From: ${name}\nEmail: ${email}\n\n${message}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);

        res.status(200).json({
            status: 'success',
            message: 'Email successfully sent'
        });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send email due to server error.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
