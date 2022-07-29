const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    dt_reg: {type: Date, required: true},
    dt_upd: {type: Date, required: true},
    active_hex: {type: String, required: false},
    status: {type: Number, required: true},
    confirmed: {
        type: Boolean,
        default: false
    },
    access_token: String,
    refresh_token: String,
    expires: {
        type: Number,
        default: Date.now()
    },
    links: [{type: Types.ObjectId, ref: 'Link'}]
})

module.exports = model( 'User', schema)