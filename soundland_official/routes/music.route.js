import express from 'express';
import moment from 'moment'; // format from '../services/account.service.js';
import * as albumServiceRank from '../services/albumrank.service.js';
import musicService from '../services/music.service.js';
import { createAlbum, getAllAlbums, getAlbumById, addSongToAlbum } from '../services/music.service.js';
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
                    artistName: artist ? artist.ArtistName : 'Unknown Artist',
 
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

router.get('/listsongs', async function (req, res) {
    const listSong = await musicService.findAll();

    // Kết hợp thông tin bài hát và nghệ sĩ
    const combinedList = await Promise.all(listSong.map(async (song, index) => {
        const artist = await musicService.findArtistBySongId(song.SongID);
        return {
            ...song, // Thêm toàn bộ thông tin bài hát
            artistName: artist ? artist.ArtistName : "Unknown Artist", // Nghệ sĩ hoặc giá trị mặc định
            displayIndex: index + 1 // Bắt đầu từ 1
        };
    }));

    res.render('vwSong/listSong', { listSong: combinedList });
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

router.post('/song/play', async (req, res) => {
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ message: 'Song ID is required' });
    }

    try {
        const song = await musicService.findSongById(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const artist = await musicService.findArtistBySongId(songId);

        const songData = {
            SongID: song.SongID,
            songName: song.SongName,
            audioUrl: `/static/songs/${songId}/main.mp3`,
            imgUrl: `/static/imgs/song/${songId}/main.jpg`,
            artistName: artist ? artist.ArtistName : 'Unknown Artist',
        };

        res.json(songData);
    } catch (error) {
        console.error('Error fetching song details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to render the form for creating an album
router.get('/albums/create', (req, res) => {
    console.log('Rendering create album form');
    res.render('vwAlbum/createAlbum');
});

// Route to handle POST form when creating an album
router.post('/albums/create', async (req, res) => {
    const { albumName, description, releaseDate } = req.body;
    console.log(`Creating album: ${albumName}`);

    try {
        const newAlbum = await createAlbum({
            name: albumName,
            description,
            releaseDate,
        });
        console.log('Album created successfully:', newAlbum);
        res.redirect('/music/albums'); // Redirect to the album list
    } catch (error) {
        console.error('Error creating album:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to view the list of albums
router.get('/albums', async (req, res) => {
    try {
        const albums = await getAllAlbums(); // Fetch the list of albums
        res.render('vwAlbum/albumRankList', { albums });
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to view album details
router.get('/album/:id', async (req, res) => {
    const albumId = req.params.id;
    console.log(`Requested album ID: ${albumId}`);

    try {
        const album = await getAlbumById(albumId);
        console.log('Fetched album:', album);

        if (!album) {
            return res.status(404).render('vwAlbum/album-create-song-detail', { album: null });
        }

        res.render('vwAlbum/album-create-song-detail', { album });
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API Route: Get all albums
router.get('/api/albums', async (req, res) => {
    try {
        const albums = await getAllAlbums();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API Route: Add a song to an album
router.post('/api/albums/:albumId/add-song', async (req, res) => {
    const albumId = req.params.albumId;
    const { songName, artistName } = req.body;

    if (!songName || !artistName) {
        return res.status(400).json({ error: 'Song name and artist name are required' });
    }

    try {
        const songId = await addSongToAlbum(songName, artistName, albumId);
        res.json({ success: true, songId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;