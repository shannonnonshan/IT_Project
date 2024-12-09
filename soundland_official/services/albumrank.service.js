// services/albumrank.service.js
let albumRanks = [
    { id: 1, albumName: 'Album 1', releaseDate: '2023-01-01', tracks: ['Song A', 'Song B'] },
    { id: 2, albumName: 'Album 2', releaseDate: '2023-02-01', tracks: ['Song C', 'Song D'] }
];

// Create a new album and add it to the list
export const createAlbumRank = async (album) => {
    const newAlbum = { ...album, id: albumRanks.length + 1 };
    albumRanks.push(newAlbum);
    return newAlbum;
};

// Retrieve all album ranks
export const findAllAlbumRanks = async () => {
    return albumRanks;
};

// Retrieve an album by ID
export const getAlbumById = async (albumId) => {
    // Find the album with the matching ID
    return albumRanks.find(album => album.id === parseInt(albumId, 10)) || null;
};
