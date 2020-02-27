let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyForm = document.querySelector('form');
const toyCollection = document.getElementById('toy-collection')

const TOYS_URL = 'http://localhost:3000/toys'

//1st - get
const API = { 
  getToys: () => fetch(TOYS_URL).then(response => response.json()),

  postToy: toy => fetch(TOYS_URL, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(toy)
  }).then(response => response.json()),

  patchToy: toy => fetch(`${TOYS_URL}/${toy.id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(toy)
  }).then(response => response.json()),

  deleteToy: toy => fetch(`${TOYS_URL}/${toy.id}`, {
    method: 'DELETE',
    }).then(response => response.json())
};


// code above
// existing from clone 

document.addEventListener("DOMContentLoaded", () => {
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    // submit listener here
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// code here 

const renderToy = toy => {
  const toyDiv = document.createElement('div');
  toyDiv.className = 'card'

  // toy name
  const toyName = document.createElement('h2')
  toyName.innerText = toy.name

  // toy image
  const toyImg = document.createElement('img')
  toyImg.className = 'toy-avatar'
  toyImg.src = toy.image;

  //toy likes
  const toyLikes = document.createElement('p')
  toyLikes.innerText = `${toy.likes} likes`

  //like button
  const likeBtn = document.createElement('button')
  likeBtn.className = 'like-btn'
  likeBtn.innerText = 'Like <3'

  // adding ability to like
  //can be improved by disabling the button while pending (likeBtn in args)

  const increaseLikes = (toy, toyLikes, likeBtn) => {
    likeBtn.disabled = true 
    toy.likes++
    API.patchToy(toy)
    .then(toy => {
      toyLikes.innerText = `${toy.likes} likes`;
      likeBtn.disabled = false
    })
  }

  likeBtn.addEventListener('click', () => increaseLikes(toy, toyLikes, likeBtn))

  // delete button

  const deleteToy = (toy, toyDiv) => {
    API.deleteToy(toy)
    .then(() => { 
      toyDiv.remove();
    })
  }

  const deleteButton = document.createElement('button');
  // deleteButton.className = 'delete x';
  deleteButton.innerText = "Delete :("

  deleteButton.addEventListener('click', () => deleteToy(toy, toyDiv))


  toyDiv.append(toyName, toyImg, toyLikes, likeBtn, deleteButton)
  toyCollection.append(toyDiv);
}

//add new toy

toyForm.addEventListener('submit', event => {
  event.preventDefault()

// take values from form 

const newToy = {
  name: event.target.elements.name.value,
  image: event.target.elements.image.value,
  likes: 0
}

// post to API 

  API.postToy(newToy).then(toy => renderToy(toy))
  .then(() => event.target.reset())
});


// 3rd - check with (toy => { console.log(toy)})} 
const renderToys = toys => {
  toys.forEach(toy => {
    renderToy(toy)
  });
};


// 2nd - check with API.getToys().then(toys => console.log(toys));
API.getToys().then(toys => renderToys(toys));
