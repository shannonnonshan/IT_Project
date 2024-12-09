import db from '../utils/db.js'

export default {
    findTopAlbum() {
        return db('albums')
            .orderBy('ReleaseDate', 'desc') // Sắp xếp theo cột `created_at` giảm dần
            .limit(4); // Lấy 4 bản ghi đầu tiên
    },
    findAlbumById(albumid) {
        return db('albums').where('AlbumID', albumid).first();
    },
    async findArtistByAlbumId(albumId) {
        const albumArtist = await db('album_artists').where('AlbumID', albumId).first();
        if (!albumArtist) {
            return null;  // Nếu không tìm thấy thông tin nghệ sĩ cho album
        }

        const artist = await db('artists').where('ArtistID', albumArtist.ArtistID).first();
        return artist ? artist.ArtistName : "Unknown Artist";  // Trả về tên nghệ sĩ hoặc giá trị mặc định
    },
    

};