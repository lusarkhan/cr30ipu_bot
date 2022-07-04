require('dotenv').config()
const {Router} = require('express')
const barest = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Mail = require('../classes/mailer')

const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const tokenKey = process.env.JWT_ACCESS_SECRET;


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Не корректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 8 символов')
            .isLength({ min: 6 }),
        check('phone', 'Введите номер телефона').exists()
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

        const user = new User({
            email: email,
            password: hashedPassword,
            phone: phone,
            dt_reg: dtReg,
            dt_upd: dtReg,
            active_hex: activeHex,
            status: 0
        })

        await user.save()
        if (user) {

            const nodemailer = require("nodemailer");

            let transporter = nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 25,
                secure: false,
                    auth: {
                        user: "noreply@cr30.ru",
                        pass: "sf%wfi8v_MuU"
                    },
                });

            let info = await transporter.sendMail({
                from: '"Личный кабинет АО ЦР" <noreply@cr30.ru>',
                to: email,
                subject: "Регистрация в Личном кабинете АО 'ЦР'",
                text: "${password}",
                html: "<b></b>",
            });

            console.log("Message sent: %s", info.messageId);

            res.status(200).json({message: 'Пользователь создан'})
        }

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        console.log(e)
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try{

                const errors = validationResult(req)

                if (!errors.isEmpty()){
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
                    return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
                }

                const token = jwt.sign(
                    { userId: user.id },
                    tokenKey,
                    { expiresIn: '1h' }
                )
                return res.json({ AccessToken: token, userId: user.id })

                localStorage.setItem('token', token);

                const tokens = await res.json();

                document.cookie = `token=${tokens}`

            } catch (e) {
                return res.status(500).json({ message: e.toString() })
            }
})

module.exports = router