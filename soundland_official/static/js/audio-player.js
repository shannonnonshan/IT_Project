async function loadSongs() {
    try {
        // Fetch songs from the API
        const response = await fetch('/music/songs');
        if (!response.ok) {
            throw new Error('Failed to fetch songs data');
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.songs)) {
            // Initialize Amplitude with the song data
            Amplitude.init({
                songs: data.songs.map(song => ({
                    id: song.SongID,
                    songName: song.SongName,
                    artistName: song.artistName,
                    url: song.urlAudio, // Ensure valid URL
                    musicImg: song.urlImage // Ensure valid URL
                })),
                callbacks: {
                    // When a song starts playing
                    play: function () {
                        console.log('Hello, song is playing!');
                        // Call updateSongInfo() only after the song has started playing
                        setTimeout(updateSongInfo, 300); // Delay to ensure Amplitude is fully initialized
                    },
                    // When the song changes (next/prev)
                    song_change: function () {
                        console.log("Song changed!");
                        // Update song info when the song changes
                        setTimeout(updateSongInfo, 300); // Delay to ensure song change is processed
                    }
                }
            });

            console.log("Songs data sent to Amplitude!");
        } else {
            console.error("No songs found in API response");
        }
    } catch (error) {
        console.error("Error loading songs:", error);
    }
}



// Call loadSongs() to initialize the Amplitude player and load songs
loadSongs();
