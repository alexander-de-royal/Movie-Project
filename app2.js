// LOADING ANIMATION
// $(window).on("load", function(){
//     $(".loader").fadeOut(4000);
// });

// PAUSE MOVIE
// Get the video
// let video = document.getElementById("myVideo");
// // Get the button
// let btn = document.getElementById("myBtn");
// // Pause and play the video, and change the button text
// function myFunction() {
//     if (video.paused) {
//         video.play();
//         btn.innerHTML = "Pause";
//     } else {
//         video.pause();
//         btn.innerHTML = "Play";
//     }
// }

// ADD MOVIE BUTTON
let text = document.querySelectorAll('.addPopup');
//SHOW AND HIDE INPUT FIELD
function clickMe(e){

    e.preventDefault();
    // let text = document.getElementById("popup", "popup2", "popup3");
    // let text = field;
    for(let i = 0; i <= text.length; i++){

        if (text[i].style.display === "none") {
            text[i].style.display = "block";
        } else {
            text[i].style.display = "none";
        }
        // text[i].display.toggle("addpop");
    }
}
document.getElementById("showList").addEventListener("click", clickMe)


// CRUD FUNCTIONS
const url = 'https://free-trite-appliance.glitch.me/movies';
const postsList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const titleValue = document.getElementById('title-value');
const bodyValue = document.getElementById('body-value');
const genreValue = document.getElementById('genre-value');
const btnSubmit = document.querySelector('.btn');
let output = '';

// CREATE
const renderPosts = (posts) => {
    console.log(posts)
    posts.forEach(data => {
        output += `
                 <div class="card col-2 bg-black mt-4">
                    <div class="card-body" data-id=${data.id}>
                        <h5 class="card-title">${data.title}</h5>
                        <h6 class="card-subtitle">${data.rating}</h6>
                        <p class="card-text">${data.genre}</p>
                            <a href="" class="card-link" id="edit-post">Edit</a>
                            <a href="" class="card-link" id="edit-post">Play</a>
                            <a href="" class="card-link" id="delete-post">Delete</a>
                    </div>
                </div>
            `;
    })
    postsList.innerHTML = output;
}

// READ
fetch(url)
    .then(response => response.json())
    .then(data => renderPosts(data));

postsList.addEventListener('click', (e) => {
    e.preventDefault()
    let delButtonPressed = e.target.id === 'delete-post';
    let editButtonPressed = e.target.id === 'edit-post';

    let id = e.target.parentElement.dataset.id;
    // Delete - Remove the existing post
    // method: Delete
    if(delButtonPressed){
        fetch(`${url}/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => location.reload())
    }
    if(editButtonPressed){

        const parent = e.target.parentElement;
        let titleContent = parent.querySelector('.card-title').textContent;
        let bodyContent = parent.querySelector('.card-subtitle').textContent;
        let genreContent = parent.querySelector('.card-text').textContent;

        titleValue.value = titleContent;
        bodyValue.value = bodyContent;
        genreValue.value = genreContent

        console.log(titleValue.value)
        console.log(bodyValue.value)
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
                rating: bodyValue.value,
                genre: genreValue.value
            })
        })
            .then(response => response.json())
            .then(() => location.reload())
    })
});
// UPDATE
addPostForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleValue.value,
            rating: bodyValue.value,
            genre: genreValue.value
        })
    })
        .then(response => response.json())
        .then(data => {
            const dataArr = [];
            dataArr.push(data);
            renderPosts(dataArr);
        })
    // Reset input field to empty
    titleValue.value = '';
    bodyValue.value = '';
    genreValue.value ='';
});
