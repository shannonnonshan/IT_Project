import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import albumServiceRank from './service/albumrank.service.js'; // Import album service

const __dirname = dirname(fileURLToPath(import.meta.url)); // Get __dirname with ES module

const app = express();

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars as the view engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs', // Use .hbs as the extension
        defaultLayout: 'main', // Main layout
        layoutsDir: path.join(__dirname, 'views', 'layouts'), // Layouts directory
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files middleware
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));

// Route for the home page
app.get('/', (req, res) => {
    res.render('home'); // Render 'home.hbs'
});

// Route for album ranking page
app.get('/albumrank', (req, res) => {
    // Get album data for this month and last month
    const albumsThisMonth = albumServiceRank.albumThisMonth();
    const albumsLastMonth = albumServiceRank.albumLastMonth();

    // Render the 'albumrank' view with album data
    res.render('albumrank', { albumsThisMonth, albumsLastMonth });
});

// Route for album details (tracks)
app.get('/album-song/:title', (req, res) => {
    const { title } = req.params; // Get album title from the URL parameter
    const allAlbums = [...albumServiceRank.albumThisMonth(), ...albumServiceRank.albumLastMonth()]; // Combine all albums

    // Find the album that matches the title
    const album = allAlbums.find(album => album.title === title);

    if (album) {
        res.render('album-song', { album }); // Render 'album-song.hbs' with album data
    } else {
        res.status(404).send('Album not found'); // Show 404 error if album not found
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
