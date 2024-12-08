import db from '../utils/db.js'
export default
{
    findAll()
    {
        return db('user');
    },
    Artist()
    {
        return db('artists');
    },
    Album()
    {
        return db('albums');
    },
    Dashboard()
    {
        return[
            {userID: 1, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 2, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 3, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 4, NoListenPrevious: 10345,  TimeChange:5},
            {userID: 5, NoListenPrevious: 10345,  TimeChange:5},
        ]
    },
    FindSongOfUser(user) {
        return db('songs')
            .join('song_artists', 'songs.SongID', 'song_artists.SongID') // Join songs và songs_artists
            .join('artists', 'song_artists.ArtistID', 'artists.ArtistID') // Join songs_artists và artists
            .join('users', 'artists.ArtistName', 'users.name') // Join artists và users
            .select('songs.*') // Chọn toàn bộ cột từ bảng songs
            .where('users.username', user.username); // Điều kiện lọc theo username
    }

}