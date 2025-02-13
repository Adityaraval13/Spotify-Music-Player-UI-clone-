// Purpose: This file is the main file of the project. It is responsible for the following tasks:

let currentSong = new Audio();
let songs;
let currentSongIndex = 0;
let currFolder;


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
} 

async function getsongs(folder) {
  currFolder=folder; 
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

    //Show the songs in the library section
    let songUL = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML="";
  for (const song of songs) {
    songUL.innerHTML += `<li>
        <img class="music-icon invert" src="images/music.svg" alt="music svg ">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="images/playSong.svg" alt="playsong">
                            </div>
                            </li>`;
  }

  //Attach the event listener to each song
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
 
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songduration").innerHTML = "00:00 / 00:00";

  
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors= div.getElementsByTagName("a");
  Array.from(anchors).forEach(e=>{
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-2)[1]
      
      //Get the metadata of the folder
      
    }
  })
}

// Get the list of the songs
const main = async () => {
await getsongs("songs/BestHits");
  playMusic(songs[0], true);

  //Display all albums on the page
  displayAlbums () 
   
  //Attach the event listener to the play, pause and stop buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/playSong.svg";
    }
  });

  //Listen for the time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".songduration"
    ).innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} : ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Adding seek functionality by adding eventlistener to the circle

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percentage = e.offsetX / e.target.getBoundingClientRect().width * 100;
    document.querySelector(".circle").style.left = percentage + "%";
    currentSong.currentTime = ((currentSong.duration) * percentage) / 100;
  });

// Adding event listener to previous button
previous.addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src.split(`/${currFolder}/`).pop()); // Extract the song name correctly
  if(index === 0) {
      index = songs.length;  
  }
  playMusic(songs[(index - 1 + songs.length) % songs.length]); 
});

  // Adding event listener to next button
  next.addEventListener("click", () => {
    let index= songs.indexOf(currentSong.src.split(`/${currFolder}/`).pop());
    playMusic(songs[(index+1 + songs.length) % songs.length]);
  });

  //Adding volume control functionality
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e) =>{
    currentSong.volume = parseInt(e.target.value)/100;
 });

 //load the playlist accordance to card whenever it is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async item =>{
          songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
      })


};

main();
