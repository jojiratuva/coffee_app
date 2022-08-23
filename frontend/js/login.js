console.log(`login.js connected`);

const server = "http://localhost:3100";
const loginBtn = document.getElementById("login-button");
const nameInput = document.getElementById("name-input");
const passwordInput = document.getElementById("password-input");

loginBtn.onclick = () => {
    $.ajax({
        url: `${server}/loginUser`,
        type: 'POST',
        data: {
            username: nameInput.value,
            password: passwordInput.value
        },
        success: (user) => {
            if (user == 'user not found') {
                console.log("user is not found please register")
            } else if (user == "not authorised") {
                console.log("Incorrect Password");
            } else {
                console.log("you have logged in");
                console.log(user);
                // set the sessionStorage with the user grabbed from the data base which is MongoDB

                sessionStorage.setItem('userID', user._id);
                sessionStorage.setItem('userName', user.username);
                sessionStorage.setItem('profileImg', user.profile_img_url);

                document.location.href = 'index.html'
            }

        },
        error: () => {
            console.log("cannot call API")
        }
    })
}