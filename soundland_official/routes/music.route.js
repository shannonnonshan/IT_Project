import express from 'express';
import moment from 'moment'; // format from '../services/account.service.js';
import albumServiceRank from '../services/albumrank.service.js';  // Using default import
import musicService from '../services/music.service.js';
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