let addToy = false
const addBtn = document.querySelector("#new-toy-btn");

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

// new code 
const API_URL = 'http://localhost:3000/toys'

const toyCollection = document.getElementById('toy-collection')
const toyForm = document.querySelector('form')
const toyFormContainer = document.querySelector(".container");

const API = {
    getToys: () => fetch(API_URL).then(response => response.json()),

    postToy: (newToy) => fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json()),

    patchLikes: toy => fetch(`${API_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toy)
    }).then(response => response.json()),

    deleteToy: (toy) => fetch(`${API_URL}/${toy.id}`, {
      method: "Delete"
    }).then(response => response.json())
}

// render single toy

const renderToy = toy => {
  // creating div card element
  const toyDiv = document.createElement('div')
  toyDiv.className = "card"

  //add h2 with toy name 
  const toyName = document.createElement('h2')
  toyName.innerText = toy.name

  // adding image
  const toyImg = document.createElement('img')
  toyImg.className = "toy-avatar"
  toyImg.src = toy.image

  // adding likes p tag 
  const toyLikes = document.createElement('p')
  toyLikes.innerText = `${toy.likes} likes!`

  //adding a like button
  const likeBtn = document.createElement('button')
  likeBtn.className = "like-btn"
  likeBtn.innerText = "Like <3"

  const increaseLikes = (toy, toyLikes, likeBtn) => {
    likeBtn.disabled = true;
    toy.likes++,
    API.patchLikes(toy).then(toy => {
      toyLikes.innerText = `${toy.likes} likes!`;
      likeBtn.disabled = false
    })
  }

  likeBtn.addEventListener('click', () => { 
    increaseLikes(toy, toyLikes, likeBtn)
  })

  // delete button
  const deleteBtn = document.createElement('button')
  deleteBtn.innerText = "FACK OOF"

  deleteBtn.addEventListener('click', () => {
    deleteToy(toy, toyDiv)
  })

  const deleteToy = (toy, toyDiv) => {
    API.deleteToy(toy).then(() => toyDiv.remove())
  }

  // appending everything

  toyDiv.append(toyName, toyImg, toyLikes, likeBtn, deleteBtn);
  toyCollection.append(toyDiv)
}

// add new toy 
toyForm.addEventListener('submit', event => {
  event.preventDefault();

  newToy = {
  name: event.target.elements.name.value,
  image: event.target.elements.image.value,
  likes: 0 
  }

  API.postToy(newToy).then(newToy => renderToy(newToy))

})

// render all toys

const renderToys = (toys) => {
  toys.forEach(toy => {
    renderToy(toy)
  });
};

// initial get fetch 
API.getToys().then(toys => renderToys(toys))