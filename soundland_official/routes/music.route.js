import express from 'express';
import moment from 'moment'; // format from '../services/account.service.js';
import albumServiceRank from '../services/albumrank.service.js';  // Using default import
import musicService from '../services/music.service.js';
import albumService from '../services/album.service.js';
// import controllers from '../controllers/artistController.js'
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

router.get('/album-detail', async function (req, res) {
    const albumid = req.query.albumid || '0';  // Sửa từ req.body sang req.query
    const songs = await musicService.findSongByAlbumId(albumid);
    const album = await albumService.findAlbumById(albumid);
    if (songs.length > 0) {
        const songList = await Promise.all(songs.map(async (song) => {
            const artistName = await musicService.findNameArtistBySongId(song.SongID);
            return {
                SongID: song.SongID,
                SongName: song.SongName,
                urlAudio: `/static/songs/${song.SongID}/main.mp3`,
                urlImage: `/static/imgs/song/${song.SongID}/main.jpg`,
                artistName: artistName || 'Unknown Artist',
            };
        }));
        res.render('vwAlbum/album-song', {
            songs: songList, 
            album: album
        });
    } else {
        res.render('vwAlbum/album-song', { songs: [] }); // Xử lý nếu không có bài hát
    }
});


    

// Endpoint trả danh sách bài hát dưới dạng JSON
router.get('/songs', async function (req, res) {
     const albumId = req.query.albumid || '0';
    let album = null;

    async function createSongList(songs) {
        return await Promise.all(songs.map(async (song) => {
            const artistName = await musicService.findNameArtistBySongId(song.SongID);
            return {
                SongID: song.SongID,
                SongName: song.SongName,
                urlAudio: `/static/songs/${song.SongID}/main.mp3`,
                urlImage: `/static/imgs/song/${song.SongID}/main.jpg`,
                artistName: artistName || 'Unknown Artist',
            };
        }));
    }

    try {
        if (albumId !== '0') {
            album = await albumService.findAlbumById(albumId);
            if (!album) {
                return res.status(404).json({ error: 'Album not found' });
            }

            const songs = await musicService.findSongByAlbumId(albumId);
            const songList = await createSongList(songs);

            res.json({ album, songs: songList });
            res.render('vwAlbum/album-song', {
                album: album,
                songs: songList
            })
        } else {
            const allSongs = await musicService.findAll();
            if (allSongs.length === 0) {
                return res.status(404).json({ message: "No songs found" });
            }

            const songList = await createSongList(allSongs);
            return res.json({ songs: songList });
        }
    } catch (error) {
        console.error("Error loading album or songs:", error);
        res.status(500).json({ message: "Internal Server Error" });
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



router.get('/autocomplete', async (req, res) => {
    const keyword = req.query.keyword || '';
    
    // Kiểm tra từ khóa tìm kiếm
    if (!keyword.trim()) {
        return res.json([]); // Trả về mảng rỗng nếu không có từ khóa
    }

    try {
        // Sử dụng searchAll để tìm kiếm bài hát, nghệ sĩ và album
        const { songs, artists, albums } = await musicService.searchAll(keyword);

        // Kết hợp kết quả tìm kiếm từ bài hát, nghệ sĩ và album
        const results = [
            ...songs.map(song => ({ 
                name: song.SongName, 
                id: song.SongID,  // Trả về SongID để sử dụng trong frontend
                type: 'song' 
            })),
            ...artists.map(artist => ({ name: artist.ArtistName, type: 'artist' })),
            ...albums.map(album => ({ name: album.AlbumName, type: 'album' }))
        ];

        // Trả về kết quả tìm kiếm dưới dạng JSON
        res.json(results);
    } catch (err) {
        console.error("Error in autocomplete:", err);
        res.status(500).json([]);
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

// router.post('/search', async function(req, res) {
//     const keyword = req.body.searchInput || ''; // Lấy từ khóa tìm kiếm
//     console.log("Từ khóa tìm kiếm:", keyword);
//     const song = await musicService.searchSongs(keyword) || 'null';
//     const artist = await musicService.searchArtists(keyword) || 'null';
//     if (song != 'null')
//     {
//         res.render('vwSong/searchSong', {
//             song: song,
//             artistName: await musicService.findArtistBySongId(song.SongID) ||'null'
//         })
//     }
// });



router.get('/findImage', async function (req, res) {
    
})

router.post('/song/play', async function (req, res) {
    
});


export default router;