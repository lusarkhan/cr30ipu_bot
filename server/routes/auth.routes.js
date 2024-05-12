require('dotenv').config()
const {Router} = require('express');
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware');
const router = Router()
const userController = require('../controllers/user-controller')

// /api/auth/register
router.post('/registration', [
        body('email', 'Не корректный email').isEmail().withMessage('Не корректный формат email'),
        body('password', 'Минимальная длинна пароля 8 символов')
            .isLength({min: 8, max: 32}),
        body('password').custom(val => {
            const uppercase = /[A-Z]+/;
            const lowercase = /[a-z]+/;
            const digit = /[0-9]+/;
            const special = /[\W]+/
            if (!uppercase.test(val) && !lowercase.test(val) && !digit.test(val) && !special.test(val) && val.length < 8) {
                throw new Error('Минимальная длинна пароля 8 символов');
            }
            return true;
        }),
        body('phone', 'Введите номер телефона').isMobilePhone('ru-RU').withMessage('Не верный формат номера')
    ],
    userController.registration);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router
