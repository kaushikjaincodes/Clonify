console.log("Running");

function InMins(seconds) {
    // if(NaN(seconds)|| seconds<0){
    //     // return `00:00`;
    // }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }




let songs;
let currentsong= new Audio(); 
let currfolder;


async function getSongs(folder){ 
    currfolder=folder;
let a= await fetch(`/songs/${currfolder}/`);
let reponse = await a.text();
let div = document.createElement("div");
div.innerHTML= reponse;
let as =div.getElementsByTagName("a");
songs=[];
// console.log(as);
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1]);
    }
    
}

let songul=document.querySelector(".scroll").getElementsByTagName("ul")[0];
songul.innerHTML="";
for (const song of songs) {
    songul.innerHTML= songul.innerHTML +`<li> 
                    <img src="img/musicnote.svg" alt="">
                    <div class="info">
                        <div class="bada">${song.replaceAll("%20"," ").replaceAll(".mp3"," ")}</div>
                    </div>
                        <img class="invert playnow" src="img/Play.svg" alt="">
                </li>`;
}

Array.from(document.querySelector(".scroll").getElementsByTagName("li")).forEach(e => {
   e.addEventListener("click",el=>{
    //    console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim()+".mp3");  
   })
});

return songs
}

const playmusic =(track,pause=false)=>{
    // let audio = new Audio("/songs/"+aud);
    currentsong.src= `/songs/${currfolder}/`+track
    if(!pause){
    currentsong.play();
    play.src="img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML= track.replaceAll("%20"," ").replaceAll(".mp3","");
    document.querySelector(".songtime").innerHTML= "00:00/00:00";

    // play.addEventListener("keyup",()=>{
    //     if(currentsong.paused){
    //         currentsong.play();
    //         play.src="pause.svg"
    //     }else{
    //         currentsong.pause();
    //         play.src="play(bar).svg"
    //     }
    // })
    // Listening fo rtime update event
    
}

async function displayAlbums(){
    let a= await fetch(`/songs/`);
    let reponse = await a.text();
    // console.log(reponse);
    
    let div = document.createElement("div");
    div.innerHTML= reponse;
    // console.log(div ,"this");
   let anchors= div.getElementsByTagName("a");
   let containcards= document.querySelector(".containcards");
   let array= Array.from(anchors);
   for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
//    Array.from(anchors).forEach(async e=>{
    if(e.href.includes("/songs/")){
        let folder=e.href.split("/").slice(-2)[0];
        // console.log(e);
        // console.log(e.href.split("/").slice(-2)[0]);
        
        
        // get the meta data of the folder
        let a= await fetch(`/songs/${folder}/info.json`);
        let reponse = await a.json();
        // console.log(reponse);
        containcards.innerHTML= containcards.innerHTML +`
        <div data-folder="${folder}"class="card rounded">
                           <button> <img src="img/Play.svg" alt="Green-play-Button"></button>
                        <img class="rounded" src="songs/${folder}/cover.jpeg" alt="no">
                        <h4>${reponse.title}</h4>
                        <p>${reponse.description}</p>
                    </div>`
    }
   } 

   Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        // console.log(item.currentTarget.data.folder)

        songs = await getSongs(`${item.currentTarget.dataset.folder}`)  
        playmusic(songs[0])

    })
})

}





async function main(){
    
    // iss se list milegi
    await getSongs("DHH");
     playmusic(songs[0],true);
    //   console.log(songs)
    // // first song
    // var audio= new Audio(songs[0]);
    // audio.play();
    
    //to display all the Albums
   await displayAlbums();

   play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src="img/pause.svg"
    }else{
        currentsong.pause();
        play.src="img/play_bar_.svg"
    }
})
//attaching functionality to the buttons
previous.addEventListener("click",()=>{
        
    // currentsong.pause();

    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // console.log(index)
    if((index-1)>=0){
    playmusic(songs[index-1]);
}
})

next.addEventListener("click",()=>{
    // currentsong.pause();
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // console.log(index+"This is index of")
    if((index+1)<songs.length){
    playmusic(songs[index+1]);
}
})
currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${InMins(currentsong.currentTime)} / ${InMins(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
})
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})



document.querySelector(".side").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
})

document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-200%";
})

   
}


main();
