import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';

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

// Cấu hình đường dẫn cho các file tĩnh (CSS, hình ảnh, v.v.)
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));

// Route chính
app.get('/', function (req, res) {
    res.render('home');  // render view 'home.hbs'
});
app.get('/signup', function (req, res) {
    res.render('vwSignUp/sign-up', {
        layout: 'sign-up'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});
// Khởi động server
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
