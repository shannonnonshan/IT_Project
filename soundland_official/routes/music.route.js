import express from 'express';
import moment from 'moment'; // format from '../services/account.service.js';
import albumServiceRank from '../services/albumrank.service.js';  // Using default import
import musicService from '../services/music.service.js';

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


// Endpoint trả danh sách bài hát dưới dạng JSON
router.get('/songs', async function (req, res) {
    try {
        // Lấy danh sách bài hát từ dịch vụ
        const listSong = await musicService.findAll();

        // Kiểm tra nếu listSong không rỗng
        if (listSong.length > 0) {
            // Tạo một mảng songList với đầy đủ thông tin bài hát
            const songList = await Promise.all(listSong.map(async (song) => {
                const artist = await musicService.findArtistBySongId(song.SongID);
                
                return {
                    SongID: song.SongID,
                    SongName: song.SongName,
                    urlAudio: `/static/songs/${song.SongID}/main.mp3`,  // URL hợp lệ cho bài hát
                    urlImage: `/static/imgs/song/${song.SongID}/main.jpg`,  // Đảm bảo có ảnh bìa
                    artistName: artist ? artist.ArtistName : 'Unknown Artist'
                };
            }));

            // Trả dữ liệu songList cho client dưới dạng JSON
            res.json({ songs: songList });

        } else {
            res.status(404).json({ message: "No songs found" });
        }
    } catch (error) {
        console.error("Error loading songs:", error);
        res.status(500).json({ message: "Error loading songs" });
    }
});



// Endpoint để nhận yêu cầu POST khi người dùng click vào bài hát
router.get('/song/play', async function(req, res) {
    // Lấy songId từ request body
    const songId = req.body.songId || '0';  // Đảm bảo nhận songId từ body của request

    if (songId === '0') {
        return res.status(400).json({ message: 'Invalid song ID' });
    }

    // Lấy thông tin bài hát từ cơ sở dữ liệu
    const song = await musicService.findSongById(songId);

    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }

    // Lấy thông tin nghệ sĩ từ SongArtist và Artists
    const artist = await musicService.findArtistBySongId(songId);

    // Trả về dữ liệu bài hát và nghệ sĩ
    const songData = {
        SongID: song.SongID,
        songName: song.SongName,
        audioUrl: `/static/songs/${songId}/main.mp3`,  // Chỉnh sửa đường dẫn file âm thanh
        imgUrl: `/static/imgs/song/${songId}/main.jpg`, // Chỉnh sửa đường dẫn ảnh bìa
        artistName: artist ? artist.ArtistName : 'Unknown Artist',
    };

    // Trả về dữ liệu cho frontend
    res.json(songData);
});

router.post('/song/play', async function (req, res) {
    
});


export default router;