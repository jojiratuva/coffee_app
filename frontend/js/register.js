const server = 'http://localhost:3100';

const signupBtn = document.getElementById("signup-button");
const usernameInput = document.getElementById("name-input");
const passwordInput = document.getElementById("password-input");
const profileImgInput = document.getElementById("image-url-input");

signupBtn.onclick = () => {
    event.preventDefault();

    let username = usernameInput.value;
    let password = passwordInput.value;
    let profileImg = profileImgInput.value;

    console.log('signupbtn clicked' + username, password, profileImg);

    $.ajax({
        url: `${server}/registerUser`,
        type: 'POST',
        data: {
            username: username,
            password: password,
            profile_img_url: profileImg
        },
        success: function (user) {
            if (user !== 'username exists') {
                console.log(`you've signed up`);
                console.log(user);
                $.ajax({
                    url: `${server}/loginUser`,
                    type: `POST`,
                    data: {
                        username: usernameInput.value,
                        password: passwordInput.value
                    },
                    success: function (user) {
                        if (user == 'user not found') {
                            console.log('User not found. Please Register');
                        } else if (user == 'not suthorised') {
                            console.log("Incorrect password.");
                        } else {
                            console.log(`logged in successfully`);
                            console.log(user);
                            // set the local storage (cookie) properties equal to the retreived user data
                            sessionStorage.setItem('userID', user._id);
                            sessionStorage.setItem('userName', user.username);
                            sessionStorage.setItem('profileImg', user.profile_img_url);

                            document.location.href = 'index.html'
                        }//end ifs
                    },//end of success
                    error: function () {
                        console.log('error: cannot call api');
                        alert('unable to login - unable to call api')
                    }//error
                })//end of ajax
            } else {
                console.log(`username taken already. Please try another name`);
            }//else
            // if register is successful - log user in ends 
        }
    })
}