// traeren elementos del DOM
const aud = document.getElementById("aud");
const buttonPlay = document.getElementById("buttonPlay");
const buttonNext = document.getElementById("buttonNext");
const buttonBack = document.getElementById("buttonBack");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const album = document.getElementById("album");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const progressBar = document.getElementById("progress");
const menuList = document.getElementById("menuList");
const buttonClose = document.getElementById("close");
const main = document.getElementById("main");
const listContainer = document.getElementById("playlist");
const list = document.getElementById("songsList");


//escuchador de eventos
buttonPlay.addEventListener("click", reproducir);
buttonNext.addEventListener("click", next);
buttonBack.addEventListener("click", back);
menuList.addEventListener("click", mostrarLista);
buttonClose.addEventListener("click", mostrarLista);
list.addEventListener("click", seleccionarCancion);

//variables de la aplicacion
let actual = 0;
var playlist = [];
var progress = 0;
var runProgressBar;

//conexion con la API
fetch("./playlist.json")
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    playlist = data;
    aud.src = playlist[actual].url;
    album.src=playlist[actual].img;
    title.innerText = playlist[actual].title;
    artist.innerText = playlist[actual].artista;
    let html = "";
    data.forEach(song => {
      html += `
      <div id="${song.id}" class="song">
        <img src="${song.img}" alt="">
        <h4>${song.title}</h4>
        <p>${song.artista}</p>
      </div>
      `

      list.innerHTML = html;
    });
  });

//FUNCIONES
function reproducir() {
  if(aud.paused) {
    aud.play();
    togglePlay();
  } else if(!aud.paused) {
    aud.pause();
    togglePlay();
  }
}

function next() {
  buttonNext.classList.toggle("button--active");
  setTimeout(() => {
    buttonNext.classList.toggle("button--active");
  }, 200);

  if(actual < playlist.length - 1) {
    actual ++;
  } else if (actual >= playlist.length - 1){
    actual = playlist.length -1;
    return;
  }
  actualizarCancion(actual);
}

function back() {
  buttonBack.classList.toggle("button--active");
  setTimeout(() => {
    buttonBack.classList.toggle("button--active");
  }, 200);

  if(actual > 0) {
    actual --;
  } else if (actual <= 0){
    actual = 0;
    return;
  }
  actualizarCancion(actual);
}

function actualizarCancion(actual) {
  aud.src=playlist[actual].url;
  album.src=playlist[actual].img;
  title.innerText = playlist[actual].title;
  artist.innerText = playlist[actual].artista;
  aud.play();
  progress = 0;
  progressBar.style.width = `${progress}%`;
  togglePlay();
}

function togglePlay () {
  if(!aud.paused) {
    buttonPlay.classList.add("button--active");
    album.classList.add("animation");
    play.style.display = "none";
    pause.style.display = "flex";
    runProgressBar = setInterval(runBar, 100);
  } else if(aud.paused) {
    buttonPlay.classList.remove("button--active");
    album.classList.remove("animation");
    play.style.display = "block";
    pause.style.display = "none";
    clearInterval(runProgressBar);
  }
}

function runBar(){
  progress = Math.round(aud.currentTime * 100 / aud.duration);
  progressBar.style.width = `${progress}%`;
  if(aud.paused) {
    buttonPlay.classList.remove("button--active");
    album.classList.remove("animation");
    play.style.display = "block";
    pause.style.display = "none";
    clearInterval(runProgressBar);
  }
}

function mostrarLista() {
  if(listContainer.classList.contains("inactive")){
    main.classList.add("inactive");
    menuList.classList.add("inactive");
    listContainer.classList.remove("inactive");
    buttonClose.classList.remove("inactive");
  } else {
    main.classList.remove("inactive");
    menuList.classList.remove("inactive");
    listContainer.classList.add("inactive");
    buttonClose.classList.add("inactive");
  }
}

function seleccionarCancion(ev) {
  actual = ev.target.parentElement.id;
  actualizarCancion(actual);
}