import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import accountRouter from './routes/account.route.js'
const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module

const app = express();

app.use(express.urlencoded({
    extended: true
}));

// Thiết lập Handlebars làm view engine
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use('/static', express.static('static'));

app.get('/', function(req,res)
{
// res.send('hello world');
    res.render('home');
});

// Route Account:
app.use('/account', accountRouter);
// Khởi động server
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
