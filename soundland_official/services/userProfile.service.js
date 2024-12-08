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
    }

}