import db from '../utils/db.js'

export default {
    findByUsername(username){
        return db('users').where('username', username).first();
    },
    add(entity){
        return db('users').insert(entity);
    }
};