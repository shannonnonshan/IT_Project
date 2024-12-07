import db from '../utils/db.js'

export default {
    findAll() {
        return db('songs');
    },
    findSongById(id){
        return db('songs').where('SongID', id).first();
    },
    async findArtistBySongId(songId) {
    const songArtist = await db('song_artists').where('SongID', songId).first();
    if (!songArtist) {
        return null;
    }
    const artist = await db('artists').where('ArtistID', songArtist.ArtistID).first();
    return artist;
}

};