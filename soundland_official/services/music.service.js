import db from '../utils/db.js'

export default {
    findAll() {
        return db('songs');
    },
    findTopSong() {
    return db('songs')
        .orderBy('ReleaseDate', 'desc') // Sắp xếp theo cột `created_at` giảm dần
        .limit(4); // Lấy 4 bản ghi đầu tiên
    },
    findSongById(id) {
        return db('songs').where('SongID', id).first();
    },
    findSongAlbumId(albumId) {
        return db('songs').where('AlbumID', albumId);
    },
    async findArtistBySongId(songId) {
        const songArtist = await db('song_artists').where('SongID', songId).first();
        if (!songArtist) {
            return null;
        }
        const artist = await db('artists').where('ArtistID', songArtist.ArtistID).first();
        return artist;  
    },
    
    async searchAll(query) {
        const songs = await db('songs').where('SongName', 'like', `%${query}%`);
        const artists = await db('artists').where('ArtistName', 'like', `%${query}%`);
        const albums = await db('albums').where('AlbumName', 'like', `%${query}%`);

        return {
            songs,
            artists,
            albums
        };
    }

};
