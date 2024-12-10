let isAmplitudeInitialized = false; // Biến trạng thái kiểm soát Amplitude init
async function loadSongs() {
    try {
        const response = await fetch('/music/songs');
        if (!response.ok) {
            throw new Error('Failed to fetch songs data');
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data.songs) && data.songs.length > 0) {
            if (!isAmplitudeInitialized) {
                Amplitude.init({
                    songs: data.songs.map(song => ({
                        id: song.SongID || 'unknown-id', // Giá trị mặc định nếu thiếu
                        songName: song.SongName || 'Unknown Song',
                        artistName: song.artistName || 'Unknown Artist',
                        url: song.urlAudio || '',
                        musicImg: song.urlImage || '/static/imgs/logo.png',
                    })),
                    callbacks: {
                        play: function () {
                            console.log('Song is playing!');
                            updateSongInfo();
                            saveState()
                        },
                        song_change: function () {
                            console.log("Song changed!");
                            const activeSong = Amplitude.get.activeSong();
                            console.log("Active song after change:", activeSong);
                            updateSongInfo();
                            saveState();
                        },
                        time_update: function () {
                            const playedPercentage = Amplitude.getSongPlayedPercentage();
                            console.log("Played percentage:", playedPercentage);
                      
                            // Giả sử bạn có một thanh tiến trình (progress bar) trong giao diện
                            const progressBar = document.getElementById("progress-bar");
                            if (progressBar) {
                              progressBar.style.width = `${playedPercentage}%`;
                            }
                          },
                    }
                });
                isAmplitudeInitialized = true;
                console.log("Amplitude initialized and ready.");
                restoreState();
            
            }
        } else {
            console.error("No songs available from the server.");
        }
    } catch (error) {
        console.error("Error loading songs:", error);
    }
}

// Lưu trạng thái của Amplitude vào localStorage
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
            Amplitude.playNow(activeSong);
            console.log("Attempting to seek to:", seekTime);
            Amplitude.skipTo(seekTime,songID-1)
            } else {
          console.error("Invalid active song data.");
        }
      } catch (error) {
        console.error("Error restoring state:", error);
      }
    }
    
  
// // Cập nhật thông tin bài hát hiện tại
// function updateSongInfo() {
//     console.log("Updating song info...");

//     const activeSong = Amplitude.get.activeSong();
//     if (!activeSong) {
//         console.error('No active song found!');
//         return;
//     }

//     document.getElementById('music-cover').src = activeSong.musicImg || '/static/imgs/logo.png';
//     document.getElementById('song-name').innerText = activeSong.songName || 'Unknown Song';
//     document.getElementById('artist-name').innerText = activeSong.artistName || 'Unknown Artist';
// }

// Lắng nghe các sự kiện lưu trạng thái khi rời khỏi trang
window.addEventListener('beforeunload', saveState);

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSongs();
    } catch (error) {
        console.error("Error initializing Amplitude on DOMContentLoaded:", error);
    }
});
