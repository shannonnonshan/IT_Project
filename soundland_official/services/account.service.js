import db from '../utils/db.js'

export default {
    findByUsername(username){
        return db('users').where('username', username).first();
    },
    add(entity){
        return db('users').insert(entity);
    }, 
    upload(song)
    {
        return db('songs').insert(song).then(([id]) => ({ SongID: id }));;
    },
    findCat()
    {
        return db('categories');
    },
    uploadSongArtist(entity)
    {
        return db('song_artists').insert(entity);
    },
    findbyID(userId)
    {
        return db('users').where({ id: userId }).first()
    },
    AddArtist(user)
    {
        return db('artists').insert(user);
    },
    FindArtist(user)
    {
        return db('artists').where({ ArtistName: user }).first();
    }
};