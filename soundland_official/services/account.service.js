import db from '../utils/db.js';

export default {
    // Tìm người dùng theo tên đăng nhập
    findByUsername(username) {
        return db('users').where('username', username).first();
    },

    // Tìm người dùng theo email
    findByEmail(email) {
        return db('users').where('email', email).first();
    },

    // Thêm người dùng mới
    add(entity) {
        return db('users').insert(entity);
    }, 
    async saveOTP(email, otp) {
        const expireTime = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút
        await db('otp_table').insert({ email, otp, expire_time: expireTime });
    },

    // Lấy OTP từ cơ sở dữ liệu
    async getOTP(email) {
        const row = await db('otp_table').where('email', email).orderBy('created_at', 'desc').first();
        return row; // Trả về { email, otp, expire_time }
    },

    // Cập nhật mật khẩu người dùng
    async updatePassword(email, hashedPassword) {
        return db('users').where('email', email).update({ password: hashedPassword });
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

