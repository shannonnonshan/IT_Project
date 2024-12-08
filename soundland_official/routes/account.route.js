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
    if (!req.session.authUser) {
        return res.redirect('/account/signin'); // Nếu session không tồn tại, redirect đến trang đăng nhập
    }

    try {
        const user = req.session.authUser; // Lấy thông tin user từ session
        const Artistlist = await userProfileService.Artist();
        const Albumlist = await userProfileService.Album();
        const UserDashboardlist = await userProfileService.Dashboard();
        const UserSong = await userProfileService.FindSongOfUser(user);

        res.render('vwAccount/userProfile', {
            user: user,
            artists: Artistlist.slice(0, 5),
            albums: Albumlist.slice(0, 5),
            userdashboard: UserDashboardlist,
            userSong: UserSong,
        });
    } catch (error) {
        console.error("Lỗi trong quá trình lấy dữ liệu:", error);
        res.status(500).send("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
});
router.get('/artist', async (req, res) => {
    const { limit = 5, offset = 0 } = req.query; // Parse limit và offset từ query string
  
    try {
      const allArtists = await userProfileService.Artist(); // Lấy toàn bộ dữ liệu từ database
      const paginatedArtists = allArtists.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
      console.log('Offset:', offset);
      console.log('Returning artists:', paginatedArtists);
  
      res.json({
        artists: paginatedArtists,
        hasMore: parseInt(offset) + parseInt(limit) < 30 // Kiểm tra nếu còn dữ liệu
      });
    } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(500).json({ artists: [], hasMore: false });
    }
  });
router.get('/album', async (req, res) => {
    const { limit = 5, offset = 0 } = req.query; // Parse limit và offset từ query string
  
    try {
      const allAlbums = await userProfileService.Album(); // Lấy toàn bộ dữ liệu từ database
      const paginatedAlbums = allAlbums.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
      console.log('Offset:', offset);
      console.log('Returning albums:', paginatedAlbums);
  
      res.json({
        albums: paginatedAlbums,
        hasMore: parseInt(offset) + parseInt(limit) < 30 // Kiểm tra nếu còn dữ liệu
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      res.status(500).json({ albums: [], hasMore: false });
    }
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
        const name = req.session.authUser.name;

        const user = 
        { 
            ArtistName: name
        }
        const artist = await accountService.AddArtist(user)
        const retArtist = await accountService.FindArtist(name)
        console.log(retArtist)
        //const userID = await accountService.findbyID(user);
        const ret = await accountService.upload(entity);
        const SongID = ret.SongID;
        const songArtistentity={
            SongID: SongID,
            ArtistID:retArtist.ArtistID
        }
        const retSongArtist = await accountService.uploadSongArtist(songArtistentity);
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
        const imageFilePath = `${imagePath}/main.jpg`;
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