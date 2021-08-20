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



btnsendMsg.disabled = true;
inpMsg.disabled = true;

chatList.style.backgroundImage = "none"