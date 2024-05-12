require('dotenv').config()

'use strict';
const express = require('express'),
    app = express()
const fs = require('fs')
const oracledb = require('oracledb')
const dbConfig = require('./dbconfig.js')
const User = require('./models/User')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const session = require('client-sessions')
const router = require('./routes/auth.routes')
const errorMiddleware = require('./middlewares/error.middleware')
const PORT = process.env.PORT || 5000;

const tokenKey = process.env.API_TOKEN;
var url = process.env.DB_URL;
const token = process.env.BOT_TOKEN

let resultls = ''

let libPath;
let lsnum;
if (process.platform === 'win32') {
    libPath = 'C:\\instantclient_21_6';
} else if (process.platform === 'darwin') {
    libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({libDir: libPath});
}

oracledb.extendedMetaData = true;

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use(express.json())
app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use('/api', router);
app.use('/api/auth', require('./routes/auth.routes'))
app.use(errorMiddleware);


app.use(session({
    cookieName: 'sessioncookie',
    secret: 'long_string_which_is_hard_to_crack',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

const start = async (uri, callback) => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            //useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()


