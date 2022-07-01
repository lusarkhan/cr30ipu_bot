"use strict";
const nodemailer = require("nodemailer");

async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "noreply@cr30.ru", // generated ethereal user
            pass: "sf%wfi8v_MuU" // generated ethereal password
        },
    });

    // send mail with defined transport object
/*    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <noreply@cr30.ru>', // sender address
        to: "inwiper@mail.ru",
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });*/

    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
   // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);