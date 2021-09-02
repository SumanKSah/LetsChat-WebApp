//NavBar
const user = document.getElementById("mainUser");
const btnLogin = document.getElementById("signIn");
const btnSignup = document.getElementById("signUp");
const btnLogout = document.getElementById("btnLogout");
const formLogin = document.getElementById("formLogin");

//chatBox
const inpMsg = document.getElementById("messageBox");
const btnsendMsg = document.getElementById("sendMessage");
const chatList = document.getElementById("scrl");
chatList.scrollTop = chatList.scrollHeight;

// sideNav bar elements
const connectedUser = document.getElementById("userName");
const btnNext = document.getElementById("nextUser");
const availableUser = document.getElementById("availableUser");
const onlineUser = document.getElementById("totalOnline");

// signup Menu
const heading = document.getElementById("heading");
const signuppage = document.getElementById("signuppage");
const btnCheckAvail = document.getElementById("checkAvail");
const formSignup = document.getElementById("userSignup");
const btnSignupCancel = document.getElementById("signupCancel");
const btnSignupSubmit = document.getElementById("signupSubmit");
const checkMark = document.getElementById("checkMark");

// Initializing socket Port
const socket = io();

// initially disabling the unwanted buttons.
function initialDisable() {
    btnSignupSubmit.disabled = true;
    btnsendMsg.disabled = true;
    inpMsg.disabled = true;
    btnNext.disabled = true;
    btnNext.innerText = 'CONNECT'
}

initialDisable();
let currentUser ='';


// chatList.style.backgroundImage = "inline-block";
chatList.style.backgroundImage = "none";

// getting all the child node of formLogin for enabling and disabling it in future.
let childNodes = formLogin.getElementsByTagName("*");

// Event listeneer for signup button
// It will open up signup page
btnSignup.addEventListener("click", () => {
    btnSignup.disabled = true;
    heading.innerText = "Sign up";
    btnLogin.disabled = true;
    // formLogin.disabled = true;

    for (var node of childNodes) {
        node.disabled = true;
    }

    signuppage.style.display = "inline-block";
});

// Event Listener for signupCancel Button
btnSignupCancel.addEventListener("click", () => {
    signuppage.style.display = "none";
    btnSignup.disabled = false;
    heading.innerText = "Chats";
    btnLogin.disabled = false;
    checkMark.style.visibility = "hidden";

    for (var node of childNodes) {
        node.disabled = false;
    }
});

// accessing username and password input field of signin page
const signupPassword = document.getElementById("signupPassword");
const signupUsername = document.getElementById("signupUsername");

// Event Listener for signup page submit button
formSignup.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!signupPassword.value || !signupUsername.value) {
        alert("Password can't be Empty");
        return;
    }

    //  since I am using x-www-form-urlencoded, so i have to send the params via URLSearchParams
    // for that converting the formdata into URLSearchParams object.
    const formdata = new FormData(formSignup);
    const params = new URLSearchParams();

    for (const pair of formdata) {
        params.append(pair[0], pair[1]);
    }

    // fetch api for async page task:- Post request to signup handler
    fetch("/signup", {
        method: "POST",
        body: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => res.text())
        .then((data) => alert(data))
        .catch((err) => alert("Some Error Occurred :("));

    btnSignupCancel.click();
});

// Event Listener for check Available button of signup page.
btnCheckAvail.addEventListener("click", () => {
    if (!signupUsername.value) {
        alert("Username can't be Empty");
    } else {
        fetch(`/check?signupUsername=${signupUsername.value}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.present == false) {
                    btnSignupSubmit.disabled = false;
                    checkMark.style.visibility = "visible";
                    checkMark.innerHTML = "✔";
                } else {
                    checkMark.style.visibility = "visible";
                    checkMark.innerHTML = "✖";
                }
            })
            .catch((err) => console.error(err));
    }
});

// Event Listener for Login button.
btnLogin.addEventListener("click", () => {
    const data = new FormData(formLogin);
    const params = new URLSearchParams();

    for (let pair of data) {
        if (!pair[0] || !pair[1]) {
            alert("Both Username and Password are required");
            return;
        } else {
            params.append(pair[0], pair[1]);
        }
    }

    fetch("/login", {
        method: "post",
        body: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 3) {
                currentUser = data.user
                user.innerHTML = `Hey, ${data.user} !!`;
                userLoggedIn();

                socket.emit("login_success", {
                    user: data.user,
                });
            } else if (data.status == 1) {
                alert("Not a VALID user");
            } else {
                alert("Authentication Failed");
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

function userLoggedIn() {
    btnNext.disabled = false;
    formLogin.style.display = "none";
    btnSignup.style.display = "none";
    btnLogout.style.display = "inline-block";

    chatList.innerHTML = '';

    socket.emit('logged_in',{
        user:currentUser,
    })
}

// all socket code Here
    socket.on('user_joined',(total)=>{
        onlineUser.innerText = total.users;
    })

    socket.on('user_disconnected,')


// Event Listener for Log out button
btnLogout.addEventListener("click", () => {
    user.innerText = "Hi There!!";
    initialDisable();
    formLogin.style.display = "inline-block";
    btnSignup.style.display = "inline-block";
    btnLogout.style.display = "none";

    socket.emit('logged_out',{
        user: currentUser,
    })
});


// Event Listener for Next Button
btnNext.addEventListener('click',()=>{
    btnNext.innerText = 'NEXT';
})