import express from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import { engine } from 'express-handlebars';
import userProfileService from './service/userProfile.service.js';
import accountRouter from './routes/account.route.js'
const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.urlencoded({
    extended:true
}));
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
app.use('/account',accountRouter)

app.listen(3000,function()
{
    console.log('ecApp us running at http://localhost:3000');
});