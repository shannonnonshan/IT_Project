import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day
import multer from 'multer';
import  { v4 as uuidv }  from 'uuid';
import accountService from '../services/account.service.js';
import userProfileService from '../services/userProfile.service.js';
import auth from '../middleware/auth.mdw.js';
import configurePassport from '../passport.config.js';
import passport from 'passport';
const router = express.Router();

router.get('/signin', function (req, res) {
    res.render('vwAccount/sign-in', {
        layout: 'sign-up-layout'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});
router.post('/signin', async function (req, res) {
    const user = await accountService.findByUsername(req.body.username);
    if(!user){
        return res.render('vwAccount/sign-in', {
            layout: 'sign-up-layout',
            showErrors: true
        }); 
    }
    if(!bcrypt.compareSync(req.body.raw_password, user.password)){
        return res.render('vwAccount/sign-in', {
            layout: 'sign-up-layout',
            showErrors: true
        }); 
    }
    req.session.auth = true;
    req.session.authUser = user;
    const retUrl = req.session.retUrl || '/'
    res.redirect(retUrl);
})
router.get('/signup', function(req, res){
    res.render('vwAccount/sign-up', {
        layout: 'sign-up-layout'
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
    res.render('vwAccount/sign-up', {
        layout: 'sign-up-layout'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});

router.get('/profile', async function(req, res){
    
// res.send('hello world');
    const list = await userProfileService.findAll();
    const Artistlist = await userProfileService.Artist();
    const Albumlist = await userProfileService.Album();
    const UserDashboardlist = await userProfileService.Dashboard();
    res.render('vwAccount/userProfile', 
        {
            list:list,
            artists:Artistlist,
            album: Albumlist,
            userdashboard: UserDashboardlist,
        });
    
});
router.get('/upload', async function(req, res){
        res.render('vwAccount/uploadSong');
});

// Cấu hình multer với bộ lọc file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/songs');
        },
    filename: (req, file, cb) => {
        const uniqueName = uuidv(); // UUID ngẫu nhiên, không có phần mở rộng
        cb(null, uniqueName); // Lưu tên file
    },
  });
  
  // Kiểm tra định dạng file
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Đồng ý upload
    } else {
      cb(new Error('Only audio files are allowed!'), false); // Từ chối file
    }
  };
  
  // Khởi tạo multer với bộ lọc
  const upload = multer({
    storage,
    fileFilter, // Thêm fileFilter vào cấu hình
  });
router.post('/upload',upload.single('FilePath'), async function(req, res){
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `/static/songs/${req.file.filename}`; 
    res.render('vwAccount/uploadSong', { fileUrl });
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

router.post('/logout', auth, function(req, res){
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
})

router.get('/forgot-password', function (req, res) {
     res.render('vwAccount/forgot-password', {
        layout: 'sign-up-layout'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
})
router.post('/forgot-password', function(req, res){

})

configurePassport();
router.get('/signin/githubAuth',
    passport.authenticate('github'));

router.get('/signin/githubAuth/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user; 

    if (!user) {
      return res.redirect('/login');
    }

    // Đánh dấu người dùng đã đăng nhập
    req.session.auth = true;
    req.session.authUser = user;

    // Chuyển hướng về trang chủ hoặc nơi khác
    res.redirect('/');
  }
);


export default router;