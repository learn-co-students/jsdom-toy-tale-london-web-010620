const toyCollectionDiv = document.querySelector("#toy-collection");
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
});

// Render Index Page
const renderToys = toys => {
  toys.forEach(toy => renderToy(toy));
};

const renderToy = toy => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";

  const nameEl = document.createElement("h2")
  nameEl.innerHTML = toy.name

  const imgEl = document.createElement("img")
  imgEl.className = "toy-avatar";
  imgEl.src = toy.image

  const likesEl = document.createElement("p")
  likesEl.innerHTML = ` ${toy.likes} Likes`

  const buttonEl = document.createElement("button")
  buttonEl.className = "like-btn";
  buttonEl.innerHTML = "Like <3"
  buttonEl.addEventListener("click", () => {
    increaseLikes(toy).then(toy => {
      likesEl.innerText = `${toy.likes} likes`;
    });
  });
  cardDiv.append(nameEl, imgEl, likesEl, buttonEl);
  toyCollectionDiv.append(cardDiv);
};

// SUBMIT FORM
const handleFormSubmit = event => {
  event.preventDefault();
  const name = event.target.elements.name;
  const image = event.target.elements.image;

  const newToy = constructToyObject(name.value, image.value);
  API.postToy(newToy).then(() => {
    event.target.reset()
  });
};

const constructToyObject = (name, image) => {
  return {
    name,
    image,
    likes: 0
  };
};

const formEl = document.querySelector("form").addEventListener("submit", handleFormSubmit);

// Increase Likes
const increaseLikes = toy => {
  toy.likes++;
  return API.patchToy(toy)
};


// POST/PATCH REQUEST
const config = (method, toy) => {
  return {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toy)
  };
};

// POST 
const postConfig = toy => {
  return config("POST", toy);
};

// PATCH 
const patchConfig = toy => {
  return config("PATCH", toy);
};

// API fetch
TOYS_URL = "http://localhost:3000/toys"
const jsonify = response => response.json()

const API = {
  getToys: () => fetch(TOYS_URL).then(jsonify),
  postToy: (toy) => fetch(TOYS_URL, postConfig(toy)).then(jsonify),
  patchToy: (toy) => fetch(`${TOYS_URL}/${toy.id}`, patchConfig(toy)).then(jsonify)
};

API.getToys().then(toys => renderToys(toys));