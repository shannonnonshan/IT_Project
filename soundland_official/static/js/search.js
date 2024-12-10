document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Ngừng gửi form mặc định

    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    fetch(`/search?q=${query}`, {
        method: 'GET', // Sử dụng GET vì chúng ta đang lấy dữ liệu
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
    })
    .catch(err => {
        console.error('Error searching:', err);
    });
});

function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Xóa kết quả cũ

    if (data.songs.length > 0) {
        const songSection = document.createElement('div');
        songSection.innerHTML = `<h3>Songs</h3>`;
        data.songs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song-result');
            songElement.innerHTML = `
                <h4>${song.SongName}</h4>
                <p>Artist: ${song.artistName}</p>
                <audio controls>
                    <source src="${song.urlAudio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            `;
            songSection.appendChild(songElement);
        });
        resultsContainer.appendChild(songSection);
    }

    if (data.artists.length > 0) {
        const artistSection = document.createElement('div');
        artistSection.innerHTML = `<h3>Artists</h3>`;
        data.artists.forEach(artist => {
            const artistElement = document.createElement('div');
            artistElement.classList.add('artist-result');
            artistElement.innerHTML = `
                <h4>${artist.ArtistName}</h4>
                <p>Genre: ${artist.Genre || 'Unknown'}</p>
            `;
            artistSection.appendChild(artistElement);
        });
        resultsContainer.appendChild(artistSection);
    }

    if (data.albums.length > 0) {
        const albumSection = document.createElement('div');
        albumSection.innerHTML = `<h3>Albums</h3>`;
        data.albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('album-result');
            albumElement.innerHTML = `
                <h4>${album.AlbumName}</h4>
                <p>Release Date: ${album.ReleaseDate}</p>
            `;
            albumSection.appendChild(albumElement);
        });
        resultsContainer.appendChild(albumSection);
    }

    if (data.songs.length === 0 && data.artists.length === 0 && data.albums.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
}
