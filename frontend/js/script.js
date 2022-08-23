console.log(`connected`);

console.log("hello");
const go = document.getElementById("add-coffee");

let result = document.getElementById(`result`);
const priceInput = document.getElementById("price-input")
const nameInput = document.getElementById("name-input")
const imageURLInput = document.getElementById("image-url-input");

// setting up our coffee data
// const latte = {
//     name: "Long Black",
//     price: 3.20,
//     image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Long_Black_1.jpg/800px-Long_Black_1.jpg"
// }

let refreshCoffee = () => {
    result.innerHTML = ``;
    $.ajax({
        type: "GET",
        url: "http://localhost:3100/allCoffee",
        // your success function contains a object which can be named anything
        success: (coffees) => {
            console.log(coffees)
            renderCoffees(coffees)
            deleteCoffee(coffees)
        },
        error: (error) => {
            console.log(error);
        }
    })
}

go.onclick = () => {
    console.log("clicked");
    $.ajax({
        url: `http://localhost:3100/addCoffee`,
        // use the post type to create data somewhere
        // requesting to POST our data
        type: 'POST',
        data: {
            // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
            name: nameInput.value,
            price: priceInput.value,
            image_url: imageURLInput.value
        },
        success: () => {
            console.log("A new coffee was added.")
            refreshCoffee()
        },
        error: () => {
            console.log("Error: cannot reach the backend")
        }
    })
}
// this function will handle all our deletes 
let deleteCoffee = (coffeeId) => {
    // create ajax delete route 
    $.ajax({
        url: `http://localhost:3100/deleteCoffee/${coffeeId}`,
        // use the post type to create data somewhere
        // requesting to POST our data
        type: 'DELETE',

        success: () => {
            // console.log(data);
            refreshCoffee()
        },
        error: () => {
            console.log("Error: cannot reach the backend")
        }
    })
}

let collectDeleteButtons = () => {
    // deleteButtonsArray will return a HTML Array 
    // it will return HTML "nodes"
    //
    let deleteButtonsArray = document.getElementsByClassName(`delete`);
    for (let i = 0; i < deleteButtonsArray.length; i++) {
        const item = deleteButtonsArray[i];

        item.onclick = () => {
            // console.log("clicked delete button");
            console.log(item.id);

            let currentId = item.id;
            deleteCoffee(currentId);
        }

    }
}

// show all the coffees using data from the backend 
let renderCoffees = (coffees) => {

    coffees.forEach(item => {
        result.innerHTML += `
        <div>
        <img src="${item.image_url}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price}</p> 
        <button id="${item._id}" class="delete">delete</button>
        <button id="${item._id}" class="edit" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        `
    });
    // all coffees should be rendered now 
    // collecting delete buttons 

    collectDeleteButtons();
}
// start app 
refreshCoffee();

//============================
//            EDIT
//============================
// jquery 
// this will refresh the "results" by using the new form 
// jquery onclick function 
$('#updateProduct').click(function () {
    // this will stop the page from refreshing everytime the button is clicked 
    event.preventDefault();
    let productId = document.getElementById('productID').value;
    let productName = document.getElementById('productName').value;
    let productPrice = document.getElementById('productPrice').value;
    let imageUrl = document.getElementById('imageUrl').value;

    console.log(productId, productName, productPrice, imageUrl);

    $.ajax({
        url: `http://localhost:3100/updateProduct/${productId}`,
        type: 'PATCH',
        data: {
            name: productName,
            price: productPrice,
            image_url: imageUrl
        },
        success: function (data) {
            console.log(data);
            refreshCoffee();
        },
        error: function () {
            console.log(`error: cannot update`);
        }
    })

})

// this function checks if the users logged in
// if they are, show the username and their profile image

// this function checks if the users logged in
// if they are, show the username and their profile image

let checkLogin = () => {
    const userDetails = document.getElementById("user-details");
    let navContent;
    if (sessionStorage.userID) {
        // console.log("You're logged in")
        // console.log(sessionStorage.userName)
        navContent = `
      <span id="username">${sessionStorage.userName}</span>
      <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
      <a id="sign-out-button" href="#">sign out</a>

      `
    }
    // if they're not logged in 
    else {
        navContent = `
        <a href="login.html">Login</a>
        <a href="signup.html">Signup</a>
        `;
    }
    // render our logged in elements
    userDetails.innerHTML = navContent;
}

checkLogin();

// signout button 

const signoutBtn = document.getElementById(`sign-out-button`);

let logOut = () => {
    console.log('logged out');
    sessionStorage.clear();
    window.location.reload()
}
if (sessionStorage.userID) {

    signoutBtn.onclick = () => logOut();
}
