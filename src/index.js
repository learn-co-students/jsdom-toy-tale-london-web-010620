let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
});

const URL = "http://localhost:3000/toys";
const toyCollectionEl = document.getElementById("toy-collection");

const iterateToys = toys => toys.forEach(renderToy);

const renderToy = toy => {
  let toyCardEl = document.createElement("div");
  let nameEl = document.createElement("h2");
  let imageEl = document.createElement("img");
  let likeEl = document.createElement("p");
  let likeButtonEl = document.createElement("button");
  toyCardEl.className = "card";
  toyCardEl.setAttribute("id", toy.id);
  nameEl.innerText = toy.name;
  imageEl.src = toy.image;
  imageEl.className = "toy-avatar";
  likeEl.innerText = toy.likes;
  likeButtonEl.className = "like-btn";
  likeButtonEl.addEventListener("click", e => increaseLike(e));
  likeButtonEl.innerText = "Like";
  toyCollectionEl.append(toyCardEl);
  toyCardEl.append(nameEl, imageEl, likeEl, likeButtonEl);
};

const formEl = document.querySelector("form");
formEl.addEventListener("submit", e => {
  e.preventDefault();
  postToy({
    name: e.target.elements.name.value,
    image: e.target.elements.image.value,
    likes: 0
  })
    .then(renderToy)
    .then(() => e.target.reset());
});

const postToy = toyObj => {
  return fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toyObj)
  }).then(res => res.json());
};

function toggleIncreaseLike(toy) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: (toy.likes += 1)
    })
  })
    .then(response => response.json())
    .then(data => {
      let div = document.querySelector(`div[id="${data.id}"]`);
      let p = div.querySelector("p");
      p.innerText = toy.likes;
    });
}

function increaseLike(toy) {
  let id = toy.target.parentElement.id;
  return fetch(`http://localhost:3000/toys/${id}`)
    .then(response => response.json())
    .then(toy => toggleIncreaseLike(toy));
}

const requestToys = fetch(URL);
const jsonify = response => response.json();
const renderInfo = infoData => {
  iterateToys(infoData);
};

requestToys.then(jsonify).then(renderInfo);
