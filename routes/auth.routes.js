
require('dotenv').config()
const {Router} = require('express')
const barest = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Mail = require('../classes/mailer')
const session = require('client-sessions');
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const tokenKey = process.env.JWT_ACCESS_SECRET;
const mailSettings = process.env.MAILSETTINGS;
const siteURL = process.env.API_URL;
let token


// /api/auth/register
router.post(
    '/signup',
    [
        check('email', 'Не корректный email').isEmail().withMessage('Invalid e-mail.'),
        check('password', 'Минимальная длинна пароля 8 символов')
            .isLength({min: 8}),
        check('password').custom(val => {
            const uppercase = /[A-Z]+/;
            const lowercase = /[a-z]+/;
            const digit = /[0-9]+/;
            const special = /[\W]+/
            if (!uppercase.test(val) && !lowercase.test(val) && !digit.test(val) && !special.test(val) && val.length < 8) {
                throw new Error('Минимальная длинна пароля 8 символов');
            }
            return true;
        }),
    ],
    async (req, res) => {

    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                massage: 'Некорректные данные при регистрации'
            })
        }
        const {email, password, phone} = req.body

        const candidate = await User.findOne({email: email})

        if (candidate) {
            return res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        const hashedPassword = await barest.hash(password, 12)

        const dtReg = Date()

        const activeHex = await barest.hash(hashedPassword, 8)

        token = jwt.sign(
            {userId: process.env.JWT_ACCESS_SECRET},
            tokenKey,
            {expiresIn: '100'}
        )

        const user = new User({
            email: email,
            password: hashedPassword,
            phone: phone,
            dt_reg: dtReg,
            dt_upd: dtReg,
            active_hex: activeHex,
            status: 0,
            token: token
        })

        await user.save()

        if (user) {

            /* const nodeMailer = require("nodemailer");

             let transporter = nodeMailer.createTransport({
                 host: "smtp.yandex.ru",
                 port: 25,
                 secure: false,
                     auth: {
                         user: "noreply@cr30.ru",
                         pass: "sf%wfi8v_MuU"
                     },
                 });

             let info = await transporter.sendMail({
                 from: `"Личный кабинет АО ЦР" <noreply@30.ru>`,
                 to: email,
                 subject: `Регистрация в Личном кабинете АО 'ЦР'`,
                 text: `<a href="${siteURL}confirm/${token}">Activate</a>`,
                 html: "<b></b>",
             });
             */
            //console.log("Message sent: %s", info.messageId);

            res.status(200).json({message: 'Пользователь создан'})
        }

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        console.log(e)
    }
    })

'use strict';

module.exports = (req, res, next) => {
    if (!req.session.user || !req.session.user.confirmed) {
        return res.redirect('/');
    }
    next();
};


router.get('/confirm/:token', async (req, res, next) => {
    const {token} = req.params;

    try {
        const user = await User.findOne({token: token});

        if (!user) {
            console.log('User not found')
            return res.sendStatus(403);
        }

        const expiresIn = 1000 * 60 * 60 * 60 * 24;

        if ((Date.now() - user.expires) > expiresIn) {
            await user.remove();
            return res.redirect('/');
        }

        user.confirmed = true;
        await user.save();
        var sess = req.session;
        sess = user;
        if (sess) {
            console.log('Confirm successful')
            session.user = user;
            return res.redirect('/');
        } else {
            res.send('Please login');
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(404);
    }
});

// /api/auth/login
router.post(
    '/signin',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                    console.log(errors.array())
                    return res.status(400).json({
                        errors: errors.array(),
                        massage: 'Некорректные данные при регистрации'
                    })
                }
                const {email, password} = req.body

                const user  = await User.findOne({ email: email })

                if (!user) {
                   return res.status(400).json({ message: 'Пользователь не найден'})
                }

                const isMatch = await barest.compareSync(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {userId: user.id},
                tokenKey,
                {expiresIn: '1h'}
            )
            user.token = token;
            await user.save()
            return res.json({AccessToken: token, userId: user.id})

            localStorage.setItem('token', token);

            const tokens = await res.json();

            document.cookie = `token=${tokens}`

        } catch (e) {
                return res.status(500).json({ message: e.toString() })
            }
})

module.exports = router