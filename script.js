let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');
let random_btn = document.querySelector('.random-track');
let repeat_btn = document.querySelector('.repeat-track');

let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let updateTimer;


const music_list = [
    {
        img : './images/choices.jpg',
        name : 'Choices',
        artist : 'PatrickReza',
        music : 'music/Choices.mp3'
    },
    {
        img : './images/the-return.jpg',
        name : 'The Return',
        artist : 'NIVIRO',
        music : 'music/The Return.mp3'
    },
    {
        img : './images/royalty.jpg',
        name : 'Royalty',
        artist : 'Maestro Chives, Egzod, Neoni',
        music : 'music/Royalty.mp3'
    },
    {
        img : './images/falling.jpg',
        name : 'Falling',
        artist : 'Rival, CRVN',
        music : 'music/Falling.mp3'
    },
    {
        img : './images/freedom.jpg',
        name : 'Freedom',
        artist : 'Goodknight.',
        music : 'music/Freedome.mp3'
    },
    {
        img : './images/moments.jpg',
        name : 'Moments',
        artist : 'Robbie Rosen, Lost Identities',
        music : 'music/Moments.mp3'
    },
    {
        img : './images/away.jpg',
        name : 'Away',
        artist : 'James Roche',
        music : 'music/Away.mp3'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset(track_index);

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    
    // Update button states
    updateButtonStates();
}
function reset(x){
    curr_time.textContent = "00:00";
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
    if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom = !isRandom;
    updateButtonStates();
}
function repeatTrack(){
    isRepeat = !isRepeat;
    if(isRepeat) {
        curr_track.loop = true;
    } else {
        curr_track.loop = false;
    }
    updateButtonStates();
}
function updateButtonStates() {
    // Update random button
    if(isRandom) {
        random_btn.classList.add('active');
    } else {
        random_btn.classList.remove('active');
    }
    
    // Update repeat button
    if(isRepeat) {
        repeat_btn.classList.add('active');
    } else {
        repeat_btn.classList.remove('active');
    }
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(isRepeat) {
        // If repeat is on, don't change track
        return;
    }
    
    if(isRandom) {
        let random_index = Math.floor(Math.random() * music_list.length);
        track_index = random_index;
    } else if(track_index < music_list.length - 1) {
        track_index += 1;
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
    // Update the visual progress immediately
    seek_slider.style.backgroundSize = seek_slider.value + '% 100%';
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;
        
        // Update the background of the slider to show progress
        seek_slider.style.backgroundSize = seekPosition + '% 100%';

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}