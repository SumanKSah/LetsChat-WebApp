//NavBar
const user = document.getElementById("mainUser");
const btnLogin = document.getElementById("signIn");
const btnSignup = document.getElementById("signUp");
const loginUser = document.getElementById("loginUser");
const loginPassword = document.getElementById("loginPassword");

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
const btnCheckAvail = document.getElementById('checkAvail');
const btnSignupSubmit = document.getElementById('signupSubmit');
const btnSignupCancel = document.getElementById('signupCancel');


btnsendMsg.disabled = true;
inpMsg.disabled = true;
btnNext.disabled = true;

// chatList.style.backgroundImage = "inline-block";
chatList.style.backgroundImage = "none";

btnSignup.addEventListener("click", () => {
    btnSignup.disabled = true;
    heading.innerText = "Sign up";
    btnLogin.disabled = true;
    loginPassword.disabled = true;
    loginUser.disabled = true;
    signuppage.style.display = "inline-block";
});

btnSignupCancel.addEventListener('click',()=>{
    signuppage.style.display = 'none';
    btnSignup.disabled = false;
    heading.innerText = "Chats";
    btnLogin.disabled = false;
    loginPassword.disabled = false;
    loginUser.disabled = false;
})

