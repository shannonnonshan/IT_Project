import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import accountRouter from './routes/account.route.js'
import albumServiceRank from './service/albumrank.service.js';  // Using default import
import albumSongService from './service/album-song.service.js';
const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module

const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        format_number(value) {
            return numeral(value).format('0,0') + ' đ'
        },
        section: hbs_sections(),
    }
}));
app.use(express.urlencoded({
    extended: true
}));

// Thiết lập Handlebars làm view engine

app.set('view engine', 'hbs');
app.set('views', './views');
app.use('/static', express.static('static'));

app.get('/', function(req,res)
{
// res.send('hello world');
    res.render('home');
});
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));

// Route Account:
app.use('/account', accountRouter);
// Khởi động server
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
