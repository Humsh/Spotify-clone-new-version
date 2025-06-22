let currentsong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    
    currfolder = folder;
    try {
        let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
        let response = await a.text();
        // console.log(response)
        let div = document.createElement("div");
        div.innerHTML = response;
        let lis = div.getElementsByTagName("li");

        songs = [];
        for (let index = 0; index < lis.length; index++) {
            const element = lis[index];
            let link = element.querySelector("a"); // Get the <a> tag inside the <li>
            if (link && link.href.endsWith(".mp3")) {
                songs.push(link.href.split(`/${folder}/`)[1]);
            }
        }
        // console.log(songs)
        console.log("printing songs")
    console.log(songs)
        // Display all the songs in the playlist
        const songUL = document.querySelector(".songlist ul");
        songUL.innerHTML = ""

        // Clear existing content
        for (const song of songs) {
            songUL.innerHTML += `
               <li>
                   <img class="invert" width="34" src="images/music.svg" alt="">
                   <div class="info">
                       <div>${song.replaceAll("%20", " ")}</div>
                       
                   </div>
                   <div class="playnow">
                       <span>Play Now</span>
                       <img class="invert" src="images/play.svg" alt="">
                   </div>
               </li>`;
        }

        // Attach event listeners to each song
        Array.from(songUL.getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let songTitle = e.querySelector(".info div").textContent.trim();
                playMusic(songTitle);
            });
        });

        //     // Display all the songs in the playlist
        //     const songUL = document.querySelector(".songlist ul");

        //    // Clear existing content
        //     for (const song of songs) {
        //         songUL.innerHTML += `
        //             <li>
        //                 <img class="invert" width="34" src="images/music.svg" alt="">
        //                 <div class="info">
        //                     <div>${song}</div>
        //                     <div>Harry</div>
        //                 </div>
        //                 <div class="playnow">
        //                     <span>Play Now</span>
        //                     <img class="invert" src="images/play.svg" alt="">
        //                 </div>
        //             </li>`;
        //     }

        //     // Attach event listeners to each song
        //     Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        //         e.addEventListener("click", () => {
        //             let songTitle = e.querySelector(".info div").textContent.trim();
        //             playMusic(songTitle);
        //         });
        //     });

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}
const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play()
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"


}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    console.log("printing array")
    console.log(array)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
       
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0]
            console.log("printing the folder")
            console.log(folder)
            //get the meta data of folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div  class="play">
                            <img src="images/play.svg" alt="">
                            
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2> ${response.title}</h2>
                        <p>${response.description} </p>
                    </div>`
        }
    }


    //load the library whenevr the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("ass")
            console.log(item.currentTarget.dataset.folder);
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })


}

// Call the function to fetch and display songs
async function main() {
    await getsongs("songs/ncs")
    playMusic(songs[0], true);
    //  // Display all the songs in the playlist
    //  const songUL = document.querySelector(".songlist ul");
    //  // Clear existing content
    //   for (const song of songs) {
    //       songUL.innerHTML += `
    //           <li>
    //               <img class="invert" width="34" src="images/music.svg" alt="">
    //               <div class="info">
    //                   <div>${song.replaceAll("%20", " ")}</div>
    //                   <div>Harry</div>
    //               </div>
    //               <div class="playnow">
    //                   <span>Play Now</span>
    //                   <img class="invert" src="images/play.svg" alt="">
    //               </div>
    //           </li>`;
    //   }

    //   // Attach event listeners to each song
    //   Array.from(songUL.getElementsByTagName("li")).forEach(e => {
    //       e.addEventListener("click", () => {
    //           let songTitle = e.querySelector(".info div").textContent.trim();
    //           playMusic(songTitle);
    //       });
    //   });
    //Attach an event listener to play,next and previous

    //display all the albums
    await displayAlbums()
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg"

        } else {
            currentsong.pause();
            play.src = "images/play.svg"
        }
        const activeLi = document.querySelector(".songlist li.active-song .playnow img");
    if (activeLi) {
        if (currentsong.paused) {
            activeLi.src = "images/play.svg";
        } else {
            activeLi.src = "images/pause.svg";
        }
    }
    })
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    //add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    //add and event for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add event listener for colse button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%"
    })
    //add an event listener to previous and next
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")
        console.log(currentsong.src.split("/").slice(-1)[0])
        console.log(songs)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })
    //load the library whenevr the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder);
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
    // Toggle Settings panel
document.getElementById('settings-btn').addEventListener('click', () => {
  const panel = document.getElementById('settings-panel');
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
});

// Toggle Themes options
document.getElementById('themes-btn').addEventListener('click', () => {
  document.getElementById('themes-options').classList.toggle('open');
});

// Change theme
document.querySelectorAll('.themes-options button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme'); // light or dark
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme); // save
    document.getElementById('settings-panel').style.display = 'none';
  });
});

// Restore theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(`${savedTheme}-mode`);

}
main()



