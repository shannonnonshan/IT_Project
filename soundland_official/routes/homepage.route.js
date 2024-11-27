import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day


const router = express.Router();
router.get('/homepage', function(req,res)
{
// res.send('hello world');
    res.render('home');
});

export default router;