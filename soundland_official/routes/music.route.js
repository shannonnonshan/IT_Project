import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format from '../services/account.service.js';
import albumServiceRank from '../services/albumrank.service.js';  // Using default import

const router = express.Router();

router.get('/albumrank', (req, res) => {
    // Get album data for this month and last month
    const albumsThisMonth = albumServiceRank.albumThisMonth();
    const albumsLastMonth = albumServiceRank.albumLastMonth();

    // Render the 'albumrank' view with album data
    res.render('vwAlbum/albumrank', { albumsThisMonth, albumsLastMonth });
});

// Route for album details (tracks)
router.get('/album-song/:title', (req, res) => {
    const { title } = req.params; // Get album title from the URL parameter
    const allAlbums = [...albumServiceRank.albumThisMonth(), ...albumServiceRank.albumLastMonth()]; // Combine all albums

    // Find the album that matches the title
    const album = allAlbums.find(album => album.title === title);

    if (album) {
        res.render('vwAlbum/album-song', { album }); // Render 'album-song.hbs' with album data
    } else {
        res.status(404).send('Album not found'); // Show 404 error if album not found
    }
});

export default router;