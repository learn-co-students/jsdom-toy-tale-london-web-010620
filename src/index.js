let addToy = false;
  const toyDiv = document.getElementById("toy-collection")
  const formEl = document.querySelector('form')

  const addBtn = document.querySelector("#new-toy-btn");
  const TOYS_URL = 'http://localhost:3000/toys'
  const toyForm = document.querySelector(".container");
  const API = {
    getToys: () => fetch(TOYS_URL).then(response => response.json()),
    postToy: toy => fetch(TOYS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toy)
    }).then(response => response.json()),
    patchToy: toy => {
      return fetch(`${TOYS_URL}/${toy.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes:(toy.likes += 1)
        })
      }).then(response => response.json())
    }
  };

  const renderToys = toys => {
    toys.forEach(toy => renderToy(toy))
  }
  const renderToy = toy => {
    const toyCard = document.createElement("div")
    toyCard.className = "card";
    toyDiv.appendChild(toyCard)

    const toyName = document.createElement("h2")
    toyName.innerText = toy.name
    toyCard.appendChild(toyName);

    const toyImg = document.createElement('img')
    toyImg.className = "toy-avatar"
    toyImg.src = toy.image
    toyCard.appendChild(toyImg)

    const toyP = document.createElement("p")
    toyP.innerText = toy.likes
    toyCard.appendChild(toyP)

    const renderLike = (like) => {
      toyP.innerText = toy.likes
    }
    const increaseLike = (event) => {
      event.preventDefault();
      API.patchToy(toy)
        .then(data => renderLike(data))
    }

    const toyButton = document.createElement("button")
    toyButton.className = "like-btn"
    toyButton.innerText = "Like <3"
    toyCard.appendChild(toyButton)   
    toyButton.addEventListener("click", (e) => increaseLike(e))

  }
  const handleFormSubmit = event => {
    event.preventDefault();
    
      const toy = {
        name: event.target.elements.name.value,
        image: event.target.elements.image.value, 
        likes: 0
      };
      API.postToy(toy).then(savedToy => renderToy(savedToy));
    };
  
  formEl.addEventListener('submit', handleFormSubmit);
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
  API.getToys().then(toys => renderToys(toys))



