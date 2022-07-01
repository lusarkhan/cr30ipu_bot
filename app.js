require('dotenv').config()

'use strict';
const express = require('express'),
    app = express()
const fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 5000;
const tokenKey = process.env.API_TOKEN;

let resultls=''

app.use(cookieParser());
app.use(cors());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use(express.json())
app.use(
    express.urlencoded({
       extended: true
    })
)

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/user', function (req, res, next) {
        const AccessToken = process.env.JWT_ACCESS_SECRET
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(' ')
        if (token == null) return res.sendStatus(401)
        jwt.verify(token.toString(), AccessToken, (err, user) => {
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
})

let libPath;

if (process.platform === 'win32') {           // Windows
    libPath = 'C:\\instantclient_21_6';
} else if (process.platform === 'darwin') {   // macOS
    libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
}

oracledb.extendedMetaData = true;

//var MongoClient = require('mongodb').MongoClient;
var url = process.env.DB_URL;

const token = process.env.BOT_TOKEN

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}





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
/*
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(token)
bot.use(Telegraf.log())

//команда /start
bot.start(ctx => {
            return ctx.reply('Здравствуйте! ' + ctx.from.first_name +
                '\nДля передачи показаний приборов учета, приготовьте номер лицевого счета!' +
                'Получить инструкцию /ins.', Markup
            .keyboard([
                ['🔍 Показания', 'Тарифы'],
                ['☸ Настройки', '📞 Контакты'],
                ['📢 Новости', '⭐️Оцените сервис', '👥 Поделиться']
            ])
            .oneTime()
            .resize()
        )
})
*/
/*
    async function run_translate(ls) {
        let lsnums = ls;
        let connection;

        try {
            connection = await oracledb.getConnection(dbConfig);

            await (connection);

            const sql =
                `SELECT * FROM PAY_COUNTERS WHERE LSNUM=`+lsnums;

            let result;

            result = await connection.execute(
                sql,
                [],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                }
            );
            for (let row of result.rows) {
               //resultls=row.SERIAL_NUM
                await (async () => {
                    try {
                        const request = await require('request');

                        var options = {
                            url: 'https://api.telegram.org/bot5548134963:AAHk098I68VnAowl4Z389Ew4ApePZSl5pNg/sendPhoto?chat_id=401247796&reply_markup={%22inline_keyboard%22:[[{%22text%22:%22'+row.SERIAL_NUM+'%22,%22callback_data%22:%22like%22}]]}',
                            method: 'POST',
                            Authorization: 'Bearer t1.9euelZrLz57KxsyVzoqLjM-PkI-JnO3rnpWajo3Hz5ubxo3GjpiXl83JzZLl8_d3JRVq-e88TChL_N3z9zdUEmr57zxMKEv8.REn9DH7KeSCrPoA3A_PKFOuJ5s_lThneK1iii7czP1RSLxxjXnMPP2zXHDDVpQmaOBQxvFNsv_zemGM62WsNBg',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'text/plain',
                            }
                        };


                        request(options);
                    } catch (error) {
                        console.log(error.response.body);
                    }

                })();
            }
        }catch (err) {
            console.error(err);
        }finally {
           // return resultls
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }

        //console.log(lss)
    }
*/



/*
async function get_ipu(ls) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cr30ipu_bot");

        var query = { id: 861 };
        dbo.collection("users_log").find(query).toArray(function(err, result) {
            if (err) throw err;
           // console.log(result);
            //res.json(result);
            db.close();
        });
    })
    let lsnums = ls;
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        await (connection);

        const sql =
            `SELECT * FROM PAY_COUNTERS WHERE LSNUM=`+lsnums;

        let result;

        result = await connection.execute(
            sql,
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );
        for (let row of result.rows) {
            resultls=row.SERIAL_NUM
        }
    }catch (err) {
        console.error(err);
    }finally {
        return resultls
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}*/


/*function getT_pok (req, res) {
    async function run() {

        let connection;

        try {
            connection = await oracledb.getConnection(dbConfig);

            await (connection);  // create the demo table

            const sql =
                `select * from (select * from t_pok_all order by id asc) --WHERE ROWNUM > 101 and ROWNUM <= 200`;

            let result;

            result = await connection.execute(
                sql,
                [],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    fetchInfo :
                        {
                            "PICKED": { type : oracledb.STRING },
                            "WEIGHT": { type : oracledb.DEFAULT }
                        }
                }
            );

            for (let row of result.rows) {
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;

                    var dbo = db.db("cr30api");
                    var newPok = {id: row.ID, sg_reg_id: row.SG_REG_ID, ip_addr: row.IP_ADDR, num: row.NUM, df: row.DF, dk: row.DK, pok: row.POK, dt_add: row.DT_ADD, status: row.STATUS, dt_edit: row.DT_EDIT, descr: row.DESCR };

                    dbo.collection("t_pok_all").insertOne(newPok, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        db.close();
                    });
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
}
    run();
};*/

//getT_pok();

//
//app.use('/api/:token/pk_bot.get', function (req, res) {

   // res.param.token= tokenKey

//})
/*
app.use('/api/pk_bot.get_bot_sessions', function (req, res) {
    async function run() {

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cr30api");

            var query = { id: 861 };
            dbo.collection("t_pok_all").find(query).toArray(function(err, result) {
                if (err) throw err;
                //console.log(result);
                res.json(result);
                db.close();
            });
        })
    }
    run();
})*/



         /*
         MongoClient.connect(url, function(err, db) {
             if (err) throw err;
             var dbo = db.db("cr30api");

             var newPok = { sg_reg_id: 999999, ip_addr: "10.3.1.1", num: "406002882", df: 449341920, dk:"01", pok: 71, dt_add: Date.now(), status: 1, dt_edit: Date.now(), descr:"none" };


             /*dbo.collection("bot").insertOne(newPok, function(err, res) {
                 if (err) throw err;
                 console.log("1 document inserted");
                 db.close();
             });*/

   /* dbo.collection("bot").findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result.name);
        //db.close();
    });
    var query = { address: "Highway 37" };
    dbo.collection("bot").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });*/
//});


