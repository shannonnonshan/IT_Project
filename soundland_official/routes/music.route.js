import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format from '../services/account.service.js';
import albumServiceRank from '../services/albumrank.service.js';  // Using default import

const router = express.Router();

router.get('/albumrank', (req, res) => {
    // Get album data for this month and last month
    const albumsThisMonth = albumServiceRank.albumThisMonth();
    const albumsLastMonth = albumServiceRank.albumLastMonth();

    // Render the 'albumrank' view with album data
    res.render('vwAlbum/albumrank', { albumsThisMonth, albumsLastMonth });
});

// Route for album song (tracks)
router.get('/album-song/:title', (req, res) => {
    const { title } = req.params; // Lấy title của album từ tham số URL
    const allAlbums = [...albumServiceRank.albumThisMonth(), ...albumServiceRank.albumLastMonth()]; // Kết hợp album trong tháng này và tháng trước

    // Tìm album phù hợp với title
    const album = allAlbums.find(album => album.title === title);

    if (album) {
        // Truyền album và danh sách bài hát (album.details.tracks) vào view
        res.render('vwAlbum/album-song', { album, songs: album.details.tracks });
    } else {
        res.status(404).send('Album not found'); // Nếu không tìm thấy album, trả về lỗi 404
    }
});


export default router;