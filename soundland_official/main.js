import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import albumServiceRank from './service/albumrank.service.js';  // Using default import
import albumSongService from './service/album-song.service.js';

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

// Route for album ranking page
app.get('/albumrank', function (req, res) {
    // Get album data for this month and last month
    const albumsThisMonth = albumServiceRank.albumThisMonth();
    const albumsLastMonth = albumServiceRank.albumLastMonth();

    res.render('albumrank', {
        albumsThisMonth,
        albumsLastMonth
    });
});

// Route for individual album details page
app.get('/album-song/:title', function (req, res) {
    const albumTitle = req.params.title;

    // Find album in this month's or last month's list
    const album = albumServiceRank.albumThisMonth().find(a => a.title === albumTitle) ||
                  albumServiceRank.albumLastMonth().find(a => a.title === albumTitle);

    if (album) {
        // Add default description if not present
        if (!album.description) {
            album.description = "Một album đặc biệt với những bài hát được chọn lọc kỹ lưỡng";
        }

        // Filter songs that belong to the album
        const songs = albumSongService.albumList().filter(song => song.title === albumTitle);

        res.render('album-song', { album, songs });
    } else {
        res.status(404).send('Album not found');
    }
});

// Route for viewing all songs (optional page to list all songs)
app.get('/album-song', function (req, res) {
    const albums = [
        ...albumServiceRank.albumThisMonth(),
        ...albumServiceRank.albumLastMonth()
    ];

    const allSongs = albums.flatMap(album => album.details.tracks); // Merge all songs from albums

    res.render('album-song', { songs: allSongs }); // Render page with all songs
});

// Khởi động server
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
