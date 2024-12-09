import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day
import multer from 'multer';
import accountService from '../services/account.service.js';
import userProfileService from '../services/userProfile.service.js';
import auth from '../middleware/auth.mdw.js';
import configurePassport from '../passport.config.js';
import passport from 'passport';
import fs from 'fs';
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
    const list = await accountService.findCat();
    res.render('vwAccount/uploadSong',
        {list:list},
    );
});

const storage = multer.memoryStorage();
const uploadFiles = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedAudioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav'];
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedAudioTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new Error('Only audio and image files are allowed!'), false); // Từ chối file
        }
    }
});

const upload = uploadFiles.fields([
    { name: 'FilePath', maxCount: 1 }, // Trường cho file âm thanh
    { name: 'ImagePath', maxCount: 1 } // Trường cho file hình ảnh
]);

router.post('/upload', upload, async (req, res) => {
    try {
        // Kiểm tra file
        if (!req.files || !req.files.FilePath || !req.files.ImagePath) {
            return res.status(400).send('Both audio and image files are required.');
        }

        // Lấy dữ liệu file
        const audioFile = req.files.FilePath[0]; // Lấy file âm thanh
        const imageFile = req.files.ImagePath[0]; // Lấy file hình ảnh

        // Xử lý dữ liệu từ form
        const selectedid = Array.isArray(req.body.catid) ? req.body.catid.join(",") : req.body.catid;
        console.log( selectedid );
        const ymd_ReleaseDate = moment(req.body.ReleaseDate, "DD/MM/YY").format('YYYY-MM-DD');
        const entity = {
            SongName: req.body.songname,
            CatID: selectedid,
            ReleaseDate: ymd_ReleaseDate
        };

        // Lưu dữ liệu vào database và lấy SongID
        const ret = await accountService.upload(entity);
        const SongID = ret.SongID;

        // Tạo thư mục dựa trên SongID
        const songPath = `./static/songs/${SongID}`;
        if (!fs.existsSync(songPath)) {
            fs.mkdirSync(songPath, { recursive: true });
        }
        const imagePath = `./static/imgs/song/${SongID}`;
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath, { recursive: true });
        }

        // Lưu file âm thanh
        const audioFilePath = `${songPath}/main.mp3`;
        fs.writeFileSync(audioFilePath, audioFile.buffer);

        // Lưu file hình ảnh
        const imageFilePath = `${imagePath}/cover.jpg`;
        fs.writeFileSync(imageFilePath, imageFile.buffer);

        // Tạo đường dẫn để render
        const fileUrl = `/static/songs/${SongID}/main.mp3`;
        const imageUrl = `/static/imgs/song/${SongID}/cover.jpg`;

        res.render('vwAccount/uploadSong', { fileUrl, imageUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing upload.');
    }
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

router.get('/forgot-password', (req, res) => {
    res.render('vwAccount/forgot-password', {
        layout: 'sign-up-layout',
    });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra email tồn tại trong cơ sở dữ liệu
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.render('vwAccount/forgot-password', {
                layout: 'sign-up-layout',
                errorMessage: 'Email không tồn tại trong hệ thống',
            });
        }

        // Tạo OTP và thời gian hết hạn
        const otp = Math.floor(100000 + Math.random() * 900000); // Mã OTP 6 chữ số
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        // Lưu OTP vào database
        await db.Otp.create({ email, otp, expiresAt });

        // Cấu hình gửi email qua Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Thay bằng email của bạn
                pass: 'your-email-password', // Thay bằng mật khẩu của bạn
            },
        });

        // Nội dung email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Mã OTP để khôi phục mật khẩu',
            text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 10 phút.`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Chuyển đến trang nhập OTP
        res.redirect(`/account/otp?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Trang OTP (GET)
router.get('/otp', (req, res) => {
    const { email } = req.query; // Nhận email từ URL query
    res.render('vwAccount/otp', {
        layout: 'sign-up-layout',
        email,
    });
});

router.post('/otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Kiểm tra OTP từ database
        const otpRecord = await db.Otp.findOne({ where: { email, otp } });

        if (!otpRecord) {
            return res.render('vwAccount/otp', {
                layout: 'sign-up-layout',
                email,
                errorMessage: 'Mã OTP không hợp lệ.',
            });
        }

        // Kiểm tra thời gian hết hạn
        if (new Date() > otpRecord.expiresAt) {
            return res.render('vwAccount/otp', {
                layout: 'sign-up-layout',
                email,
                errorMessage: 'Mã OTP đã hết hạn.',
            });
        }

        // Nếu hợp lệ, chuyển đến trang đặt lại mật khẩu
        res.redirect(`/account/reset-password?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Trang xử lý OTP (POST)
router.post('/verify-otp', async function (req, res) {
    const { email, otp } = req.body;

    try {
        // Kiểm tra OTP trong cơ sở dữ liệu
        const storedOtp = await db.Otp.findOne({ where: { email: email, otp: otp } });

        if (!storedOtp) {
            return res.render('vwAccount/otp', {
                layout: 'sign-up-layout',
                email: email,
                errorMessage: 'Mã OTP không chính xác',
            });
        }

        // Nếu OTP hợp lệ, chuyển hướng đến trang đặt lại mật khẩu
        res.redirect(`/account/reset-password?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại');
    }
});

// Route POST reset-password (to handle resetting the password)
router.get('/reset-password', (req, res) => {
    const { email } = req.query;
    res.render('vwAccount/reset-password', {
        layout: 'sign-up-layout',
        email,
    });
});

router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash mật khẩu mới
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Cập nhật mật khẩu trong database
        await db.User.update({ password: hashedPassword }, { where: { email } });

        // Xóa OTP sau khi sử dụng
        await db.Otp.destroy({ where: { email } });

        res.render('vwAccount/reset-password', {
            layout: 'sign-up-layout',
            successMessage: 'Mật khẩu đã được thay đổi thành công.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

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