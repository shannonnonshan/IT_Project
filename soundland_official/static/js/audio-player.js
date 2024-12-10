let isAmplitudeInitialized = false; // Biến trạng thái kiểm soát Amplitude init

// async function loadSongs() {
//     try {
//         let response;
//         console.log("hehee", albumIdToSearch);
//         if (albumIdToSearch !== null) {
//             response = await fetch(`/music/songs?albumid=${albumIdToSearch}`);
//         }
//         else {
//             response = await fetch("/music/songs");
//         }
//         // const response = await fetch("/music/songs");
//         // console.log("hehee");
//         if (!response.ok) {
//             throw new Error('Failed to fetch songs data');
//         }

//         const data = await response.json();
        
//         console.log("API Response:", data);

//         if (Array.isArray(data.songs) && data.songs.length > 0) {
//             if (!isAmplitudeInitialized) {
//                 Amplitude.init({
//                     songs: data.songs.map(song => ({
//                         id: song.SongID || 'unknown-id', // Giá trị mặc định nếu thiếu
//                         songName: song.SongName || 'Unknown Song',
//                         artistName: song.artistName || 'Unknown Artist',
//                         url: song.urlAudio || '',
//                         musicImg: song.urlImage || '/static/imgs/logo.png',
//                     })),
//                     callbacks: {
//                         play: function () {
//                             console.log('Song is playing!');
//                             updateSongInfo();
//                             saveState()
//                         },
//                         song_change: function () {
//                             console.log("Song changed!");
//                             const activeSong = Amplitude.get.activeSong();
//                             console.log("Active song after change:", activeSong);
//                             updateSongInfo();
//                             saveState();
//                         },
//                         time_update: function () {
//                             const playedPercentage = Amplitude.getSongPlayedPercentage();
//                             console.log("Played percentage:", playedPercentage);
                      
//                             // Giả sử bạn có một thanh tiến trình (progress bar) trong giao diện
//                             const progressBar = document.getElementById("progress-bar");
//                             if (progressBar) {
//                               progressBar.style.width = `${playedPercentage}%`;
//                             }
//                           },
//                     }
//                 });
//                 isAmplitudeInitialized = true;
//                 console.log("Amplitude initialized and ready.");
//                 restoreState();
            
//             }
//         } else {
//             console.error("No songs available from the server.");
//         }
//     } catch (error) {
//         console.error("Error loading songs:", error);
//     }
// }

//  const albumElement = document.querySelector('#albumid');
// const albumIdToSearch = albumElement ? albumElement.value : null;

// // console.log(albumId);
// // Call loadSongs() to initialize the Amplitude player and load songs
// loadSongs();
// Lưu trạng thái của Amplitude vào localStorage
async function loadSongs() {
    try {
        
        let response;
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
            if (isAmplitudeInitialized) {
                Amplitude.pause();
                Amplitude.getSongs().forEach((_, index) => Amplitude.removeSong(index));
            }        
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
                        saveState()
                    },
                    // When the song changes (next/prev)
                    song_change: function () {
                        console.log("Song changed!");
                        // Update song info when the song changes
                        setTimeout(updateSongInfo, 300); // Delay to ensure song change is processed
                        saveState()
                    }
                }
            });
            isAmplitudeInitialized = true;
            //                 console.log("Amplitude initialized and ready.");
            console.log("Songs data sent to Amplitude!");
            restoreState();
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
function saveState() {
    try {
        if (!isAmplitudeInitialized) {
            console.error("Amplitude is not initialized yet.");
            return;
        }

        const activeSong = Amplitude.getActiveSongMetadata(); // Lấy bài hát hiện tại
        if (!activeSong) {
            console.error("No active song to save.");
            return;
        }
        const currentTime = Amplitude.getSongPlayedPercentage(); // Lấy thời gian hiện tại
        const isPlaying = Amplitude.getIsPlaying ? Amplitude.getIsPlaying() : false; // Kiểm tra trạng thái phát
        const savedPercentage =Amplitude.getSongPlayedPercentage();
        const secondPlay = Amplitude.getSongPlayedSeconds();
        console.log("Saving active song:", activeSong);
        localStorage.setItem('currentSongID', activeSong.id); // Lưu ID bài hát
        localStorage.setItem('audioTime', currentTime || 0); // Lưu thời gian hiện tại
        localStorage.setItem('isPlaying', isPlaying ? 'true' : 'false'); // Lưu trạng thái phát
        localStorage.setItem('savedPercentage', savedPercentage);
        localStorage.setItem('activeSong', JSON.stringify(activeSong));
        localStorage.setItem('secondPlayed', secondPlay);
  
        console.log("State saved to localStorage.");
    } catch (error) {
        console.error("Error saving state:", error);
    }
}



// Khôi phục trạng thái từ localStorage
function restoreState() {
    try {
        if (!isAmplitudeInitialized) {
          console.error("Cannot restore playback. Amplitude is not initialized.");
          return;
        }
        const savedActiveSong = localStorage.getItem('activeSong');
        const savedPercentage = parseFloat(localStorage.getItem('savedPercentage')) || 0;
        const isPlaying = localStorage.getItem('isPlaying') === 'true';
        const seekTime = localStorage.getItem('secondPlayed')
        const songID =localStorage.getItem('currentSongID');
        console.log("Attempting to restore state...");
        console.log("Saved active song:", savedActiveSong);
        console.log("Saved percentage:", savedPercentage);
        console.log("Second Played:", seekTime);
    
        if (!savedActiveSong) {
          console.warn("No saved song found.");
          return;
        }
    
        const activeSong = JSON.parse(savedActiveSong);
    
      
        if (activeSong && activeSong.url) {
            const songExists = Amplitude.getSongs().some(song => song.url === activeSong.url);
        
            if (songExists) {
                console.log("Restoring active song:", activeSong.songName);
                Amplitude.playNow(activeSong);
                console.log("Attempting to seek to:", seekTime);
                Amplitude.skipTo(seekTime, songID - 1);
            } 
            else {
                console.warn("Saved song not found in the new playlist.");
            }
        }
         else {
            console.error("Invalid active song data.");}}
        catch (error) {
        console.error("Error restoring state:", error);
      }
    }
    

window.addEventListener('beforeunload', saveState);

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSongs();
    } catch (error) {
        console.error("Error initializing Amplitude on DOMContentLoaded:", error);
    }
});
