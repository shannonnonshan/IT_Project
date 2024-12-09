async function loadSongs() {
    try {
        
        let response;
        console.log("hehee", albumIdToSearch);
        if (albumIdToSearch !== null) {
            response = await fetch(`/music/songs?albumid=${albumIdToSearch}`);
            
        }
        else {
            response = await fetch("/music/songs");
        }
        // const response = await fetch("/music/songs");
        // console.log("hehee");
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
 const albumElement = document.querySelector('#albumid');
const albumIdToSearch = albumElement ? albumElement.value : null;

// console.log(albumId);
// Call loadSongs() to initialize the Amplitude player and load songs
loadSongs();
