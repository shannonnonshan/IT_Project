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
    // findSong(entity)
    // {
    //     return db('songs').where(entity).first();
    // }
};