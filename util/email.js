const nodemailer = require('nodemailer');
const google = require('googleapis');
const htmlToText = require('html-to-text');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Setting OAuth2 Client
const oAuth2Client = new google.Auth.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = class Email {
    constructor(user, url) {
      this.to = user.email;
      this.url = url;
      this.from = `Administrator <${process.env.EMAIL_USER}>`;
    }

    async newTransport() {

        const accessToken = await oAuth2Client.getAccessToken();

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL_USER,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken
            },
        });
    }

    //Send the actual email
    async send(subject, html) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
        }

        //3) Create a transport and send email
        const tranporter = await this.newTransport();
        await tranporter.sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('Welcome To The InternDigger', '<p>We are glad to welcome you as a part of our family!</p>')
    }

    async verifyEmail() {
        const html = `Please click this email to confirm your email: <a href="${this.url}">${this.url}</a>`
        await this.send('Verify your Email', html);
    }
}