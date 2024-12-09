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
    async findArtistBySongId(songId) {
        const musicArtist = await db('song_artists').where('SongID', songId).first();
        if (!musicArtist) {
            return null;  // Nếu không tìm thấy thông tin nghệ sĩ cho album
        }

        const artist = await db('artists').where('ArtistID', musicArtist.ArtistID).first();
        return artist ? artist.ArtistName : "Unknown Artist";  // Trả về tên nghệ sĩ hoặc giá trị mặc định
    },
    
    async searchSongs(query) {
        return await db('songs')
            .where('SongName', 'like', `%${query}%`);
    },

    async searchArtists(query) {
        return await db('artists')
            .where('ArtistName', 'like', `%${query}%`);
    },

    async searchAlbums(query) {
        return await db('albums')
            .where('AlbumName', 'like', `%${query}%`);
    }
};
