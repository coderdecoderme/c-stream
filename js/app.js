// Get DOM Elements
const modal = document.querySelector("#my-modal");
const videoframe = document.querySelector(".video");
const convertable = document.getElementById("container");

axios(' https://api.odb.to/identity?imdb_id=tt3861390&api_key=78fb2ebed5bacf5d56100d0b4dd77330')
  .then(res => {
    console.log(res);
  })
// GLOBAL CONTROLLER
const globalContoller = (function () {
  function eventListeners() {
    document.addEventListener("submit", e => {
      call();
      e.preventDefault();
    });

    window.addEventListener("click", outsideClick);
  }
  eventListeners();
})();
// MOVIE CONTROLLER
function getMovies(searchText) {
  convertable.classList.add("container__movies");
  convertable.classList.remove("home");

  axios
    .get("https://www.omdbapi.com?apikey=af465f0e&s=" + searchText)
    .then(response => {
      console.log(response);
      let movies = response.data.Search;
      let output = "";
      movies.forEach((index, movie) => {
        if (index.Poster != "N/A") {
          output += `
          <div class="movie">
          <a href="#" onclick="movieSelected('${index.imdbID}')">
          <img class="movie__img" src="${index.Poster}" ></a>
          <div>
          <a href="#" onclick="movieSelected('${
            index.imdbID
          }')" class="movie__name"><h1 >${index.Title}</h1></a></div>
          </div>
          </div>
          `;
        } else {
          output += `
          <div class="movie">
          <a href="#" onclick="movieSelected('${index.imdbID}')">
          <img class="movie__img" src="img/art.svg" ></a>
          <div>
          <a href="#" onclick="movieSelected('${
            index.imdbID
          }')" class="movie__name"><h1 >${index.Title}</h1></a></div>
          </div>
          </div>
          `;
        }
      });
      document.querySelector(".container__movies").innerHTML = output;
    })
    .catch(err => {
      console.log(err);
    });
}

// STORE THE SELECTED MOVIE ID IN SESSION STORAGE
function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

//GETTING THE MOVIE WHICH IS SELECTED
function getMovie() {
  //GETTING THE ID FROMSESSION STORAGE
  let movieId = sessionStorage.getItem("movieId");
  axios
    .get("https://www.omdbapi.com?apikey=af465f0e&i=" + movieId)
    .then(response => {
      console.log(response);
      let movie = response.data;
      let imdbid = movie.imdbID;
      // UPDATING THE UI WITH THE SELECTED MOVIE INFO
      let output = `

            <div class="container__single">
            <div class="container__single__img">
                <img class="img__single" src="${movie.Poster}"
                    alt="" />
            </div>
            <div class="container__single__details">
                <h1 class="container__single__details-name">${movie.Title}</h1>
                <div class="container__single__details-details">
                    <div class="details-year" title="Release Date">
                        <img src="img/calendar.svg" class="icon"> ${movie.Year}
                    </div>
                    <div class="details-director" title="Movie Director">
                    <img src="img/announcer.svg" class="icon"> ${movie.Director}
                    </div>
                    <div class="details-time" title="Total time">
                    <img src="img/time.svg" class="icon"> ${movie.Runtime}
                    </div>
                    <div class="details-rating" title="Internet Movie Database Value">
                    <img src="img/award.svg" class="icon"> 
                    </div>
                    <div class="details-rating" title="Internet Movie Database Value">
                    <img src="img/cinema.svg" class="icon">${movie.Genre}
                </div>
                </div>
                <div class="container__single__details-plot">
                   ${movie.Plot}
                </div>
                <div class="container__single__buttons">
                    <a href="https://www.imdb.com/title/${
                      movie.imdbID
                    }" target="_blank" title="IMDB" class="button details__imdb">
                        IMDB <span class="imdb__score">${
                          movie.imdbRating
                        }</span>
                    </a>
                    <a href="${
                      movie.Website
                    }" title="" target="_blank"class="button details__imdb">WEBSITE
                    </a>
                    <a href="#" title="IMDB" class="button details__imdb" onclick="openModal('${imdbid}')">
                    <img src="img/cinema.svg" alt="CINEMA" class="icon"> <span class="imdb__score">MOVIE</span>
                    </a>
                </div>
                <a class="button details__go-back" href="index.html">
                    BACK
                </a>
            </div>
        </div>
            `;
      document.querySelector(".container").innerHTML = output;
    })
    .catch(err => {
      console.log(err);
    });
}

// FUNTIONS
// GETTING THE INPUT VALUE
const call = () => {
  let searchtext = document.querySelector(".search__input").value;
  getMovies(searchtext);
};

// OPENING THE MODAL
function openModal(movieId) {
  modal.style.display = "block";
  videoframe.src = `https://api.odb.to/embed?imdb_id=${movieId}`;
}


// CLOSING THE MODAL
function closeModal() {
  modal.style.display = "none";
  videoframe.src = "";
}

// ANOTHER WAY TO CLOSE THE MODAL
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
    videoframe.src = "";
  }
}