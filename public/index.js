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
const btnSignupSubmit = document.getElementById('signupSubmit')
const checkMark = document.getElementById('checkMark');


btnSignupSubmit.disabled = true
btnsendMsg.disabled = true;
inpMsg.disabled = true;
btnNext.disabled = true;

// chatList.style.backgroundImage = "inline-block";
chatList.style.backgroundImage = "none";

let childNodes = formLogin
        .getElementsByTagName("*");

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

btnSignupCancel.addEventListener("click", () => {
    signuppage.style.display = "none";
    btnSignup.disabled = false;
    heading.innerText = "Chats";
    btnLogin.disabled = false;
    checkMark.style.visibility = 'hidden';

    for (var node of childNodes) {
        node.disabled = false;
    }
});

const signupPassword = document.getElementById("signupPassword");
const signupUsername = document.getElementById("signupUsername");

formSignup.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!signupPassword.value || !signupUsername.value) {
        alert("Either Username or Password left BLANK");
        return;
    }

    const formdata = new FormData(formSignup);
    const params = new URLSearchParams();

    for (const pair of formdata) {
        params.append(pair[0], pair[1]);
    }

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


btnCheckAvail.addEventListener("click", () => {
    if (!signupUsername.value) {
        alert("Username can't be null");
    } else {
        fetch(`/check?signupUsername=${signupUsername.value}`)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.present == false) {
                btnSignupSubmit.disabled = false;
                checkMark.style.visibility = 'visible'
                checkMark.innerHTML = '✔'
            } else {
                checkMark.style.visibility = 'visible'
                checkMark.innerHTML = '✖'
                
            }
        })
        .catch((err)=>console.error(err))
        
    }
});

btnLogin.addEventListener("click", () => {
    formLogin.style.display = "none";
    btnSignup.style.display = "none";
    btnLogout.style.display = "inline-block";
});

btnLogout.addEventListener("click", () => {
    formLogin.style.display = "inline-block";
    btnSignup.style.display = "inline-block";
    btnLogout.style.display = "none";
});
