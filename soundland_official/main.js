import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import accountRouter from './routes/account.route.js'
import musicRouter from './routes/music.route.js'
import configurePassport from './passport.config.js';
import moment from 'moment';
import passport from 'passport';

const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module

const app = express();
// Phương thức serializeUser
configurePassport();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    
}))

app.use(passport.initialize());
app.use(passport.session());
// passport.use('github', configurePassport);


app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        format_number(value) {
            return numeral(value).format('0,0') + ' đ'
        },
        section: hbs_sections(),
        formatDate: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Định dạng ngày theo YYYY-MM-DD
        }
    }
}));
app.use(express.urlencoded({
    extended: true
}));

app.set('trust proxy', 1)


app.use(async function (req, res, next){
    if(!req.session.auth)
    {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
})
// Thiết lập Handlebars làm view engine

app.set('view engine', 'hbs');
app.set('views', './views');
app.use('/static', express.static('static'));


app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));
// Node.js với Express: phục vụ các tệp trong thư mục services

app.get('/', function(req,res)
{
    if (req.session.views) {
        req.session.views++;
    }else req.session.views = 1;
    res.render('home', {
        user: req.session.authUser
    });
});
app.use('/account', accountRouter);
// Khởi động server


app.use('/music', musicRouter);
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
