const nodemailer=require("nodemailer");
const config = require("../config");


const transporter= nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls:{
        ciphers: "SSLv3"
    },
    auth:{
        user: config.email.from,
        pass: config.email.password
    }
})

module.exports=transporter;