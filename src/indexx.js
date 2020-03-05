let addToy = false
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");


TOYS_URL = 'http://localhost:3000/toys'

const toyCollection = document.getElementById('toy-collection')
const toyForm = document.querySelector('form')


const API = {
    getToys: () => fetch(TOYS_URL)
    .then(response => response.json()),

    postToy: (toy) => fetch(TOYS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(toy)
    }).then(response => response.json()),

    patchToy: (toy) => fetch(`${TOYS_URL}/${toy.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'            
        },
        body: JSON.stringify(toy)
        }).then(response => response.json()),

    deleteToy: toy => fetch(`${TOYS_URL}/${toy.id}`, {
        method: 'DELETE', 
    }).then(response => response.json())
}

API.getToys().then(toys => renderToys(toys))

const renderToys = toys => {
    toys.forEach(toy => {
        renderToy(toy)
    });
}


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



const renderToy = toy => {
    const toyDiv = document.createElement('div')
    toyDiv.className = 'card'

    const toyName = document.createElement('h2')
    toyName.innerText = toy.name

    const toyImg = document.createElement('img')
    toyImg.className = 'toy-avatar'
    toyImg.src = toy.image

    const toyLikes = document.createElement('p')
    toyLikes.innerText = `${toy.likes} likes`

    const likeBtn = document.createElement('button')
    likeBtn.className = 'like-btn'
    likeBtn.innerText = "Like <3"

    const increaseLikes = (toy, toyLikes, likeBtn) => {
        likeBtn.disabled = true
        toy.likes++
        API.patchToy(toy).then(toy => {
            toyLikes.innerText = `${toy.likes} likes`
            likeBtn.disabled = false
        })
    }

    likeBtn.addEventListener('click', () => increaseLikes(toy, toyLikes, likeBtn))

    const deleteBtn = document.createElement('button')
    deleteBtn.innerText = "FACK OOF"

    const deleteToy = (toy, toyDiv) => 
    API.deleteToy(toy).then(() => {toyDiv.remove()
    })

    deleteBtn.addEventListener('click', () => {
        deleteToy(toy, toyDiv)
    })

    toyDiv.append(toyName, toyImg, toyLikes, likeBtn, deleteBtn)
    toyCollection.append(toyDiv)
}


toyForm.addEventListener('submit', event => {
    event.preventDefault()

    const newToy = {
        name: event.target.elements.name.value,
        image: event.target.elements.image.value,
        likes: 0
    }

    API.postToy(newToy).then(toy => renderToy(toy))
    .then(() => event.target.reset())
})