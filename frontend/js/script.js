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

let renderCoffees = (coffees) => {

    coffees.forEach(item => {
        result.innerHTML += `
        <div>
        <img src="${item.image_url}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price}<p> 
        </div>
        `
    });
}

$.ajax({
    type: "GET",
    url: "http://localhost:3100/allCoffee",
    // your success function contains a object which can be named anything
    success: (coffees) => {
        console.log(coffees)
        renderCoffees(coffees)
    },
    error: (error) => {
        console.log(error);
    }
})