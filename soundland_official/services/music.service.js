import db from '../utils/db.js'

export default {
    findSongById(id){
        return db('songs').where('SongId', id).first();
    },
    async findArtistBySongId(songId) {
        // Lấy ArtistId từ bảng SongArtist
        const songArtist = await db('songs').where('SongId', songId).first();

        // Nếu không có liên kết, trả về null
        if (!songArtist) {
            return null;
        }

        // Lấy thông tin nghệ sĩ từ bảng Artists
        const artist = await db('artists').where('ArtistId', songArtist.ArtistId).first();

        return artist;
    },
};