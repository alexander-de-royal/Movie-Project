// LOADING ANIMATION
window.addEventListener('load', () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader");
    })
})
// animation

// PAUSE MOVIE
// Get the video
let video = document.getElementById("myVideo");
// Get the button
let btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
    } else {
        video.pause();
        btn.innerHTML = "Play";
    }
}


// CRUD FUNCTIONS
const url = 'https://free-trite-appliance.glitch.me/movies';
const postsList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const titleValue = document.getElementById('title-value');
const bodyValue = document.getElementById('body-value');
const genreValue = document.getElementById('genre-value');
const btnSubmit = document.querySelector('.btn');


// READ
fetch(url)
    .then(response => response.json())
    .then(data => renderPosts(data));
// CREATE
const renderPosts = (posts) => {
    let output = '';
    // console.log(posts)
    posts.forEach(data => {
        // postsList.innerHTML = "";
        output += `
                 <div class="card col-2 bg-black mt-4">
                    <div class="card-body" data-id=${data.id}>
                        <h5 class="card-title">${data.title}</h5>
                        <h6 class="card-subtitle">${data.body}</h6>
                        <p class="card-text">${data.genre}</p>
                            <a href="" class="card-link btn btn-dark" id="edit-post">Edit
                            </a>
                            <a href="" class="card-link btn btn-dark" id="delete-post">Delete
                            </a>
                    </div>
                </div>
            `;
    })
    postsList.innerHTML = output;
}

// UPDATE
addPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleValue.value,
            body: bodyValue.value,
            genre: genreValue.value
        })
    })
        .then(() =>
            fetch(url))
        .then(response => response.json())
        .then(data => renderPosts(data));
    // })

    // Reset input field to empty
    titleValue.value = '';
    bodyValue.value = '';
    genreValue.value = '';
});
// DELETING
postsList.addEventListener('click', (e) => {
    e.preventDefault()
    let delButtonPressed = e.target.id === 'delete-post';
    let editButtonPressed = e.target.id === 'edit-post';

    let id = e.target.parentElement.dataset.id;
    // Delete - Remove the existing post
    // method: Delete
    if (delButtonPressed) {
        // postsList.innerHTML = " ";
        fetch(`${url}/${id}`, {
            method: 'DELETE',
        })
            .then(() =>
                fetch(url))
            .then(response => response.json())
            .then(data => renderPosts(data));

    }
    if (editButtonPressed) {

        const parent = e.target.parentElement;
        let titleContent = parent.querySelector('.card-title').textContent;
        let bodyContent = parent.querySelector('.card-subtitle').textContent;
        let genreContent = parent.querySelector('.card-text').textContent;

        titleValue.value = titleContent;
        bodyValue.value = bodyContent;
        genreValue.value = genreContent

    }
    // Update - update the existing post
    // Method - FETCH
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault()
        fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titleValue.value,
                body: bodyValue.value,
                genre: genreValue.value
            })
        })
            .then(() =>
                fetch(url))
            .then(response => response.json())
            .then(data => renderPosts(data));
    })
});
//TMDB
// API
const base_url = 'https://api.themoviedb.org/3/';
const api_key = 'api_key=3b1d5d2d0b04fe8a58433e296876916f';
const api_url = base_url + '/discover/movie?sort_by=popularity.desc&' + api_key;
const img_url = 'https://image.tmdb.org/t/p/w500';
const searchURL = base_url + '/search/movie?' + api_key;
// HTML tags
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search')
const tagsEl = document.getElementById('tags')

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 10752,
        "name": "War"
    },
]

let selectedGenre = [];
setGenre();

function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length === 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id === genre.id) {
                            selectedGenre.splice(idx, 1)
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(api_url + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection()
        })
        tagsEl.append(t);
    })

}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    if (selectedGenre.length !== 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }

}

getMovies(api_url);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if (data.results.length !== 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = `<h1 class="no-results"> No Results Found </h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';
    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
                            <div class="card-movie">
                            <img src="${img_url + poster_path}" class="card-img-top" alt="${title}">
                            </div>           
        `
        main.appendChild(movieEl);
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    }
})




