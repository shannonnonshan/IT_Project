import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day
import accountService from '../services/account.service.js';

const router = express.Router();
router.get('/signup', function (req, res) {
    res.render('vwSignUp/sign-up', {
        layout: 'sign-up'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});
router.post('/signup', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = {
        username: req.body.username,
        password: hash_password, 
        name: req.body.name,
        email: req.body.email, 
        dob: ymd_dob,
        permission: 0
    }

    const ret = await accountService.add(entity);
    res.render('vwAccount/signup');
})
router.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await accountService.findByUsername(username);
    if(!user){
        return res.json(true); //lay bien du lieu quang xuong
    }
    res.json(false);
})



router.get('/login', function(req, res){
    res.render('vwAccount/login');
})
router.post('/login', async function (req, res) {
    const user = await userService.findByUsername(req.body.username);
    if(!user){
        return res.render('vwAccount/login', {
            showErrors: true
        }); 
    }
     if(!bcrypt.compareSync(req.body.raw_password, user.password)){
        return res.render('vwAccount/login', {
            showErrors: true
        }); 
     }
})

//req.session.isAuthenticated = true
//req.sessoion.authUSer = user;
export default router;