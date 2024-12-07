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
import nodemailer from 'nodemailer'; // Thư viện gửi email
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
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Tăng kích thước file tải lên 10 MB
});

router.post('/upload', upload.single('FilePath'), async function (req, res) {
    if (!req.file) {
        return res.status(400).render('vwAccount/uploadSong', { errorMessage: 'No file uploaded.' });
    }
    const fileUrl = `/static/songs/${req.file.filename}`;
    res.render('vwAccount/uploadSong', { fileUrl, successMessage: 'File uploaded successfully!' });
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

// Route GET forgot-password (to display the forgot password form)
router.get('/forgot-password', function (req, res) {
    res.render('vwAccount/forgot-password', {
        layout: 'sign-up-layout', // Use the sign-up layout for the forgot-password page
    });
});

// Có lỗi, tạm thời push lên trước
// router.post('/forgot-password', async function (req, res) {
//     const { email } = req.body;

//     try {
//         // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
//         const user = await db.User.findOne({ where: { email } });
        
//         if (!user) {
//             // Nếu email không tồn tại trong cơ sở dữ liệu
//             return res.render('vwAccount/forgot-password', {
//                 layout: 'sign-up-layout',
//                 errorMessage: 'Email không tồn tại trong hệ thống',
//             });
//         }

//         // Tạo mã OTP ngẫu nhiên
//         const otp = Math.floor(100000 + Math.random() * 900000); // Mã OTP 6 chữ số

//         // Lưu OTP vào cơ sở dữ liệu (có thể là trong bảng User hoặc tạo bảng riêng)
//         await db.Otp.create({ email: email, otp: otp });

//         // Cấu hình nodemailer để gửi email
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'your-email@gmail.com', // Thay bằng email của bạn
//                 pass: 'your-email-password', // Thay bằng mật khẩu email của bạn
//             },
//         });

//         // Nội dung email
//         const mailOptions = {
//             from: 'your-email@gmail.com',
//             to: email,
//             subject: 'Mã OTP để khôi phục mật khẩu',
//             text: `Mã OTP của bạn là: ${otp}`,
//         };

//         // Gửi email với mã OTP
//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 return console.log(error);
//             }
//             console.log('Email sent: ' + info.response);
//         });

//         // Chuyển hướng đến trang otp.hbs với email đã được truyền vào
//         res.redirect(`/account/otp?email=${email}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Có lỗi xảy ra, vui lòng thử lại');
//     }
// });

// // Trang OTP (GET)
// router.get('/otp', function (req, res) {
//     const { email } = req.query;
//     res.render('vwAccount/otp', {
//         layout: 'sign-up-layout',
//         email: email,
//     });
// });

// // Route POST otp (to handle OTP verification)
// router.post('/otp', async function (req, res) {
//     const { email } = req.body;

//     const user = await accountService.findByEmail(email);
//     if (!user) {
//         return res.render('vwAccount/forgot-password', {
//             layout: 'sign-up-layout',
//             errorMessage: 'Email không tồn tại trong hệ thống.',
//         });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     await accountService.saveOTP(email, otp);

//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP code is: ${otp}`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.redirect('vwAccount/otp', {
//             layout: 'sign-up-layout',
//             successMessage: 'OTP đã được gửi đến email của bạn.',
//             email, // Pass email to the OTP page
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.render('vwAccount/forgot-password', {
//             layout: 'sign-up-layout',
//             errorMessage: 'Có lỗi khi gửi email. Vui lòng thử lại sau.',
//         });
//     }
// });

// // Trang xử lý OTP (POST)
// router.post('/verify-otp', async function (req, res) {
//     const { email, otp } = req.body;

//     try {
//         // Kiểm tra OTP trong cơ sở dữ liệu
//         const storedOtp = await db.Otp.findOne({ where: { email: email, otp: otp } });

//         if (!storedOtp) {
//             return res.render('vwAccount/otp', {
//                 layout: 'sign-up-layout',
//                 email: email,
//                 errorMessage: 'Mã OTP không chính xác',
//             });
//         }

//         // Nếu OTP hợp lệ, chuyển hướng đến trang đặt lại mật khẩu
//         res.redirect(`/account/reset-password?email=${email}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Có lỗi xảy ra, vui lòng thử lại');
//     }
// });

// // Route POST reset-password (to handle resetting the password)
// router.post('/reset-password', async function (req, res) {
//     const { email, password } = req.body;

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt.hash() for async hashing

//     // Update the password in the database
//     await accountService.updatePassword(email, hashedPassword);

//     // Redirect to the sign-in page after password reset
//     res.redirect('/account/sign-in');
// });

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