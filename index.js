// traeren elementos del DOM
const style = document.documentElement.style; //obetner los estilos para modificar las variables en CSS
const aud = document.getElementById("aud"); // etiqueta html para el audio
const buttonPlay = document.getElementById("buttonPlay"); //boton play
const buttonNext = document.getElementById("buttonNext"); // boton para pasar a la siguiente cancion
const buttonBack = document.getElementById("buttonBack"); // boton para retroceder a la anterior cancion
const title = document.getElementById("title"); // parrafo para poner el titulo de la cancion
const artist = document.getElementById("artist"); //parrafo para poner el artista de la cancion
const album = document.getElementById("album"); // imagen para poner la imagen del album de la cancion
const play = document.getElementById("play"); // triangulo dentro del boton de play
const pause = document.getElementById("pause"); // barras de pausa dentro del boton de play
const progressBarContainer = document.getElementById("barProgress"); // contenedor de la barra de progeso
const progressBar = document.getElementById("progress"); // barra de progreso
const currentTimeText = document.getElementById("currentTime"); // parrafo para mostrar el tiempo reproducido de la cancion
const timeDurationText = document.getElementById("timeDuration"); //parrafo para mostrar el tiempo total de la cancion
const buttonTheme = document.getElementById("buttonTheme"); //switch para cambiar entre el tema claro y el tema oscuro
const circleButtonTheme = document.getElementById("circleButtonTheme"); // circulo dentro del switch para cambiar el tema
const menuList = document.getElementById("menuList"); // boton para mostrar las lista de canciones
const buttonClose = document.getElementById("close"); // boton para cerrar la lista de canciones
const main = document.getElementById("main"); // contenedor para la ventana principal de la aplicacion
const listContainer = document.getElementById("playlist"); // contenedor para las listas de canciones 
const list = document.getElementById("songsList"); // container para poner la lista de canciones a mostrar
const songPlayingName = document.getElementById("songPlayingName"); // parrafo para poner la cancion que se esta reproduciendo
const listButtonPlay = document.getElementById("listButtonPlay"); // boton de play dentro del container para mostrar las listas de canciones
const listPlay = document.getElementById("listPlay"); // triangulo dentro del boton de play en la lista de reproduccion
const listPause = document.getElementById("listPause"); // barras de pausa dentro del boton de play en la lista de reproduccion
const listButtonNext = document.getElementById("listButtonNext"); // boton para pasar a la siguiente cancion en la lista de reproduccion 
const listProgress = document.getElementById("listProgress");
const textButtonRepeat = document.getElementById("textButtonRepeat");
const textButtonRepeatOne = document.getElementById("textButtonRepeatOne");
const buttonRepeat = document.getElementById("buttonRepeat");
const buttonAllSongs = document.getElementById("buttonAllSongs");
const buttonFavouritesSongs = document.getElementById("buttonFavouritesSongs");
const buttonFavorite = document.getElementById("buttonFavorite");
const buttonAleatory = document.getElementById("buttonAleatory");


//escuchador de eventos
buttonPlay.addEventListener("click", reproducir);
listButtonPlay.addEventListener("click", reproducir);
buttonNext.addEventListener("click", next);
listButtonNext.addEventListener("click", next);
buttonBack.addEventListener("click", back);
menuList.addEventListener("click", showList);
buttonTheme.addEventListener("click", handleSwitchTheme);
buttonClose.addEventListener("click", showList);
list.addEventListener("click", seleccionarCancion);
buttonRepeat.addEventListener("click", repeat);
buttonAleatory.addEventListener("click", aleatory);
buttonFavorite.addEventListener("click", addFavorite);
buttonAllSongs.addEventListener("click", showListAll);
buttonFavouritesSongs.addEventListener("click", showListFavourites);
progressBarContainer.addEventListener("click", adelantar);

//variables de la aplicacion
let actual = 0;
var estado = 0;
var playlist = [];
var datalist = [];
var favourites = [];
var progress = 0;
var runProgressBar;
var flagAleatory = false;

//conexion con la API
fetch("./playlist.json")
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    let idIncrementer = 0;
    playlist = data;
    playlist.sort((a,b) => {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }).map(item => {
      item.id = idIncrementer;
      item.uid = idIncrementer;
      idIncrementer++;
      return item;
    });
    datalist = playlist;
    aud.src = datalist[actual].url;
    album.src = datalist[actual].img;
    title.innerText = datalist[actual].title;
    songPlayingName.innerText = `${datalist[actual].title} - ${datalist[actual].artista}` ;
    artist.innerText = datalist[actual].artista;
    currentTimeText.innerText = "0:00";
    timeDurationText.innerText = datalist[actual].duration;
    isFavorite();
    putInfoToList();
  });
  
  function putInfoToList() {
  list.innerHTML = '';
  let html = "";
  datalist.forEach(song => {
    html += `
    <div id="${song.id}" class="song">
      <img src="${song.img}" alt="">
      <h4>${song.title}</h4>
      <p>${song.artista}</p>
    </div>
    `

    list.innerHTML = html;
  });
}

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
  listButtonNext.classList.toggle("button--active");
  setTimeout(() => {
    buttonNext.classList.toggle("button--active");
    listButtonNext.classList.toggle("button--active");
  }, 200);

  if(actual < datalist.length - 1) {
    actual ++;
  } else if (actual >= datalist.length - 1){
    if(estado === 2) {
      actual = 0;
    } else {
      actual = datalist.length -1;
      return;
    }
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
    if(estado === 2) {
      actual = datalist.length -1;
    } else {
      actual = 0;
      return;
    }
  }
  actualizarCancion(actual);
}

function actualizarCancion(actual) {
  aud.src= datalist[actual].url;
  album.src= datalist[actual].img;
  title.innerText = datalist[actual].title;
  songPlayingName.innerText = `${datalist[actual].title} - ${datalist[actual].artista}` ;  artist.innerText = datalist[actual].artista;
  currentTimeText.innerText = '0:00';
  timeDurationText.innerText = datalist[actual].duration;
  aud.play();
  progress = 0;
  progressBar.style.width = `${progress}%`;
  listProgress.style.width = `${progress}%`;
  isFavorite();
  togglePlay();
}

function togglePlay () {
  if(!aud.paused) {
    buttonPlay.classList.add("button--active");
    album.classList.add("animation");
    play.style.display = "none";
    listPlay.style.display = "none";
    pause.style.display = "flex";
    listPause.style.display = "flex";
    runProgressBar = setInterval(runBar, 100);
  } else if(aud.paused) {
    buttonPlay.classList.remove("button--active");
    album.classList.remove("animation");
    play.style.display = "block";
    listPlay.style.display = "block";
    pause.style.display = "none";
    listPause.style.display = "none";
    clearInterval(runProgressBar);
  }
}

function runBar(){
  progress = Math.round(aud.currentTime * 100 / aud.duration);
  progressBar.style.width = `${progress}%`;
  listProgress.style.width = `${progress}%`;
  currentTimeText.innerText = `${Math.floor(aud.currentTime / 60)}: ${Math.floor(aud.currentTime % 60).toString().padStart(2, 0)}`;
  if(aud.currentTime === aud.duration) {
    if(estado === 1) {
      reproducir();
    }
    else if(estado === 2) {
      if(actual < datalist.length - 1) {
        next()
      } else if (actual >= datalist.length - 1){
        actual = -1; //menos uno porque la funcion next suma uno entonces arrancaria en la primera pocision, la 0
        next();
      }
    } 
    else {
      buttonPlay.classList.remove("button--active");
      pause.style.display = "none";
      album.classList.remove("animation");
      play.style.display = "block";
      listPlay.style.display = "block";
      listPause.style.display = "none";
      clearInterval(runProgressBar);
    }
  }
}

function showListAll() {
  datalist = playlist;
  putInfoToList();
  buttonAllSongs.classList.add("selected");
  buttonFavouritesSongs.classList.remove("selected");
}
function showListFavourites() {
  datalist = favourites;
  putInfoToList();
  buttonAllSongs.classList.remove("selected");
  buttonFavouritesSongs.classList.add("selected");
}

function showList() {
  if(listContainer.classList.contains("inactive")){
    main.classList.add("inactive");
    menuList.classList.add("inactive");
    listContainer.classList.remove("inactive");
    buttonClose.classList.remove("inactive");
    buttonAllSongs.classList.remove("inactive");
    buttonFavouritesSongs.classList.remove("inactive");
  } else {
    main.classList.remove("inactive");
    menuList.classList.remove("inactive");
    listContainer.classList.add("inactive");
    buttonClose.classList.add("inactive");
    buttonAllSongs.classList.add("inactive");
    buttonFavouritesSongs.classList.add("inactive");
  }
}

function seleccionarCancion(ev) {
  actual = parseInt(ev.target.parentElement.id);
  if(buttonAllSongs.classList.contains("selected")){
    aud.src= playlist[actual].url;
    album.src= playlist[actual].img;
    title.innerText = playlist[actual].title;
    songPlayingName.innerText = `${playlist[actual].title} - ${playlist[actual].artista}` ;  artist.innerText = playlist[actual].artista;
    timeDurationText.innerText = playlist[actual].duration;
  }
  else if(buttonFavouritesSongs.classList.contains("selected")) {
    aud.src= favourites[actual].url;
    album.src= favourites[actual].img;
    title.innerText = favourites[actual].title;
    songPlayingName.innerText = `${favourites[actual].title} - ${favourites[actual].artista}` ;  artist.innerText = favourites[actual].artista;
    timeDurationText.innerText = favourites[actual].duration;
  }
  aud.play();
  progress = 0;
  progressBar.style.width = `${progress}%`;
  listProgress.style.width = `${progress}%`;
  isFavorite();
  togglePlay();
}

function repeat(){
  estado ++;
  if(estado >= 3) {
    estado = 0
  }
  switch(estado) {
    case 0:
      buttonRepeat.classList.remove("active");
      textButtonRepeat.innerHTML = "";
      textButtonRepeatOne.innerHTML = "";
      break;
    case 1:
      buttonRepeat.classList.add("active");
      textButtonRepeat.innerHTML = "";
      textButtonRepeatOne.innerHTML = '1';
      break;
    case 2:
      buttonRepeat.classList.add("active");
      textButtonRepeat.innerHTML = "All";
      textButtonRepeatOne.innerHTML = "";
      break;
  }
}

function addFavorite() {
  if(!datalist[actual].isfavorite){
    favourites.push({
      "id": favourites.length,
      "uid": datalist[actual].uid,
      "artista": datalist[actual].artista,
      "title": datalist[actual].title,
      "url": datalist[actual].url,
      "img": datalist[actual].img,
      "duration": datalist[actual].duration,
      "isfavorite": true
    });
    datalist[actual].isfavorite = true;
    isFavorite();
  }
  else if (datalist[actual].isfavorite) {
    datalist[actual].isfavorite = false;
    playlist[datalist[actual].uid].isfavorite = false;
    isFavorite();
    let newFavourites = favourites.filter(item => item.title != datalist[actual].title);
    let idIncrementer = 0;
    favourites = newFavourites.map(song => {
      song.id = idIncrementer;
      idIncrementer ++;
      return song;
    });
    if(buttonFavouritesSongs.classList.contains("selected")) {
      if(favourites.length === 0) {
        showListAll();
        estado = 0;
        actual = 0;
        actualizarCancion(actual);
      } else {
        showListFavourites();
        estado = 2;
        actual === 0 ? actual = 0 : actual--;
        next();
      }
    }; 
  }
}
function isFavorite() {
  if(datalist[actual].isfavorite) {
    buttonFavorite.classList.add("active");
  } else {
    buttonFavorite.classList.remove("active");
  }
}

function aleatory() {
  if(flagAleatory){
    buttonFavouritesSongs.classList.contains("selected") ? datalist = favourites : datalist = playlist;    
    putInfoToList();
    flagAleatory = false;
    buttonAleatory.classList.remove("active");
  } 
  else {
    let idIncrementer = -1;
    let newdatalist = datalist.map(item => {
      return {
        ...item,
      };
    });
    newdatalist = newdatalist
      .sort(function() {return Math.random() - 0.5})
      .map(item => {
        idIncrementer ++;
        return {
          ...item,
          "id": idIncrementer
        }
      });
    datalist = newdatalist;
    // putInfoToList();
    console.log(newdatalist);
    flagAleatory = true;
    buttonAleatory.classList.add("active");
  }
}

function adelantar(e) {
  aud.currentTime = e.offsetX * aud.duration / 300;
  runBar();
}
function handleSwitchTheme() {
  let colorActual = style.getPropertyValue('--background');
  console.log(colorActual);
  if(colorActual === '' || '#e0e5ec') {
    style.setProperty('--background', '#454c74');
    style.setProperty('--color', '#fffb'); 
    style.setProperty('--colorSvg', '#abcb'); 
    style.setProperty('--light', '#505883'); 
    style.setProperty('--shadow', '#2f375a');
    circleButtonTheme.classList.add('active');
  }
  if(colorActual === "#454c74") {
    style.setProperty('--background', '#e0e5ec');
    style.setProperty('--color', '#000b'); 
    style.setProperty('--colorSvg', '#abc9'); 
    style.setProperty('--light', '#fff9'); 
    style.setProperty('--shadow', '#abc9'); 
    circleButtonTheme.classList.remove('active');
  }
}