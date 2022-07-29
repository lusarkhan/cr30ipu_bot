require('dotenv').config()
const barest = require('bcryptjs')
const uuid = require('uuid')
const User = require('../models/User')
const tokenService = require('../service/token-service')
const mailService = require('./mail-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api.errore')

class UserService {
    async registration(email, password, phone) {
        console.log(email)
        const candidate = await User.findOne({email: email})

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }

        const hashedPassword = await barest.hashSync(password, 12) // await barest.hash(password, 12)

        const dtReg = Date()

        const activateLink = uuid.v4()

        const user = await User.create({
            email: email,
            password: hashedPassword,
            phone: phone,
            dt_reg: dtReg,
            dt_upd: dtReg,
            active_hex: activateLink,
            status: 0
        })

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activateLink}`)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        user.confirmed = true;
        user.status = 1;
        await user.save();
    }

}

module.exports = new UserService();