import db from '../utils/db.js';

export default {
    // Lấy danh sách tất cả bài hát
    findAll() {
        return db('songs');
    },

    // Tìm bài hát theo ID
    findSongById(id) {
        return db('songs').where('SongID', id).first();
    },

    // Lấy danh sách bài hát theo AlbumID
    findSongsByAlbumId(albumId) {
        return db('songs').where('AlbumID', albumId);
    },

    // Tìm nghệ sĩ của bài hát theo SongID
    async findArtistBySongId(songId) {
        const songArtist = await db('song_artists').where('SongID', songId).first();
        if (!songArtist) {
            return null;
        }
        const artist = await db('artists').where('ArtistID', songArtist.ArtistID).first();
        return artist;
    },

    // Thêm bài hát mới
    async addSong({ songName, releaseDate, albumId = null }) {
        const newSong = {
            SongName: songName,
            ReleaseDate: releaseDate,
            AlbumID: albumId,
            Views: 0, // Mặc định số lượt nghe là 0
            CreatedDate: new Date(), // Ngày tạo hiện tại
            UpdatedDate: new Date()  // Ngày cập nhật hiện tại
        };
        const [songId] = await db('songs').insert(newSong);
        return { songId, ...newSong };
    },

    // Cập nhật AlbumID cho bài hát
    async updateAlbumForSong(songId, albumId) {
        await db('songs').where('SongID', songId).update({ AlbumID: albumId, UpdatedDate: new Date() });
    }
};

import knex from '../utils/db.js';

// Create a new album and insert it into the database
export const createAlbum = async (album) => {
    try {
        // Make sure album.releaseDate is passed correctly
        const [newAlbum] = await knex('albums').insert({
            AlbumName: album.name,  // Ensure the album name is passed
            ReleaseDate: album.releaseDate // Pass the releaseDate correctly
        });

        const createdAlbum = await knex('albums').where('AlbumID', newAlbum).first(); // Use AlbumID for the query
        return createdAlbum;
    } catch (err) {
        throw new Error('Error creating album: ' + err.message);
    }
}

// Retrieve all albums from the database
export const getAllAlbums = async () => {
    try {
        const albums = await knex('albums').select('*');
        return albums;
    } catch (err) {
        throw new Error('Error fetching albums: ' + err.message);
    }
};

// Retrieve an album by its ID
export const getAlbumById = async (albumId) => {
    try {
        const album = await knex('albums').where('id', albumId).first();
        return album || null;
    } catch (err) {
        throw new Error('Error fetching album by ID: ' + err.message);
    }
};

// Add a song to an album
export const addSongToAlbum = async (songName, artistName, albumId) => {
    try {
        const [song] = await knex('songs').insert({
            name: songName,
            artist_name: artistName,
            album_id: albumId
        }).returning('id');
        return song.id;
    } catch (err) {
        throw new Error('Error adding song to album: ' + err.message);
    }
};