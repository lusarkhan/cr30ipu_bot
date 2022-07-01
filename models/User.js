const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dt_reg: { type: Date, required: true },
    dt_upd: { type: Date, required: true },
    active_hex: { type: String, required: true },
    status: { type: Number, required: true },
    //reset_password_token: { type: String, required: true },
    //dt_reset_password_token: { type: Date, required: true },
    links: [{ type: Types.ObjectId, ref: 'Link' }]
})

module.exports = model( 'User', schema)