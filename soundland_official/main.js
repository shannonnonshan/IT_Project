import express from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import { engine } from 'express-handlebars';

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

app.listen(3000,function()
{
    console.log('ecApp us running at http://localhost:3000');
});