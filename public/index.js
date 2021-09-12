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

function scrollList() {
    chatList.scrollTop = chatList.scrollHeight;
}

// sideNav bar elements
const connectedUser = document.getElementById("userName");
// const availableUser = document.getElementById("availableUser");
const btnGoGlobal = document.getElementById('btnGoGlobal')
const onlineUser = document.getElementById("totalOnline");
const userList = document.getElementById("userList");
const currentUser = document.getElementsByClassName("currentUser");


// signup Menu
const heading = document.getElementById("heading");
const signuppage = document.getElementById("signuppage");
const btnCheckAvail = document.getElementById("checkAvail");
const formSignup = document.getElementById("userSignup");
const btnSignupCancel = document.getElementById("signupCancel");
const btnSignupSubmit = document.getElementById("signupSubmit");
const checkMark = document.getElementById("checkMark");

// accessing username and password input field of signin page
const signupPassword = document.getElementById("signupPassword");
const signupUsername = document.getElementById("signupUsername");

// Global User Page
const globalUserPage = document.getElementById('globalUserPage'); 
const btnSearch = document.getElementById("btnSearch");
const description = document.getElementById("description");
const btnConnect = document.getElementById("nextUser");
const btnCancelGlobal = document.getElementById("btnCancelGlobal");
const globalUserList = document.getElementById("globalUserList");
const inpSearch = document.getElementById("inpSearch");
const previewSection = document.getElementsByClassName('previewSection');
const userDataSection = document.getElementsByClassName('userDataSection');
const globalUser = document.getElementsByClassName('globalUser');


// All datastructures

/*  1. Array of User 
    2. Object of message which will have all the messages of a connection
    3.   */

// this Object will work as a hashmap which will store userName along with their bio
let varUserBio = {};
let varAllMessages ={};

// Initializing socket Port
const socket = io();

// initially disabling the unwanted buttons.
function initialDisable() {
    btnSignupSubmit.disabled = true;
    btnsendMsg.disabled = true;
    inpMsg.disabled = true;
    btnConnect.disabled = true;
    btnGoGlobal.disabled = true;
    previewSection[0].style.display = 'none';
    userDataSection[0].style.marginLeft = '150px'
}

initialDisable();
let currentLoggedIn ='';
let currentTalkingWith ='';
let varPreviousPerson;


// chatList.style.backgroundImage = "inline-block";
chatList.style.backgroundImage = "inline-block";

// getting all the child node of formLogin for enabling and disabling it in future.
let childNodes = formLogin.getElementsByTagName("*");

function disableLoginParams(toDisable) {
    if(toDisable) {
        for (var node of childNodes) {
            node.disabled = true;
        }
    } else {
        for (var node of childNodes) {
            node.disabled = false;
        }
    }
}


// Event listeneer for signup button
// It will open up signup page
btnSignup.addEventListener("click", () => {
    btnSignup.disabled = true;
    heading.innerText = "Sign up";
    btnLogin.disabled = true;

    // formLogin.disabled = true;
    disableLoginParams(true);

    signuppage.style.display = "inline-block";
});

// Event Listener for signupCancel Button
btnSignupCancel.addEventListener("click", () => {
    signuppage.style.display = "none";
    btnSignup.disabled = false;
    heading.innerText = "Chats";
    btnLogin.disabled = false;
    checkMark.style.visibility = "hidden";

   disableLoginParams(false);
});


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

const loginPassword = document.getElementById('loginPassword')
loginPassword.addEventListener('keyup',(event)=>{
    if(event.key === 'Enter') {
        btnLogin.click();
    }
})

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
                currentLoggedIn = data.user
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
    // btnNext.disabled = false;
    formLogin.style.display = "none";
    btnSignup.style.display = "none";
    btnLogout.style.display = "inline-block";
    btnGoGlobal.disabled = false;

    chatList.innerHTML = '';
    chatList.style.backgroundImage = 'none';

    socket.emit('logged_in',{
        user:currentLoggedIn,
    })
}

// all socket code Here
    socket.on('user_joined',(data)=>{
        onlineUser.innerText = data.total;
        varUserBio[data.name] = data.bio;
    })

    socket.on('initialData',(data)=>{
        varUserBio = data.userOnline;
        onlineUser.innerText = Object.keys(varUserBio).length;
    })

    socket.on('user_disconnected',(data)=>{
        onlineUser.innerText = data.users;
        delete varUserBio[data.name];

        // ToDO message all the people who were talking with him.
    })

    socket.on('received',(data)=>{
        if(data.from == currentTalkingWith){
            let temp = document.createElement('div');
            temp.classList.add('received');
            temp.innerText = data.message;
            chatList.appendChild(temp);

            scrollList();
        }

        if(!varAllMessages[data.from]){
            varAllMessages[data.from]=[];
        }
        varAllMessages[data.from].push({
            type:'received',
            message:data.message,
        })
    })

inpMsg.addEventListener('keyup',(event)=>{
    if(event.key === 'Enter') {
        btnsendMsg.click();
    }
})

btnsendMsg.addEventListener('click',()=>{
    // Handle Messages Here

    if(inpMsg.value == ''){
        return;
    }

    socket.emit('send',{
        to:currentTalkingWith,
        from:currentLoggedIn,
        message:inpMsg.value,
    })

    let temp = document.createElement('div');
    temp.classList.add('send');
    temp.innerText = inpMsg.value;
    chatList.appendChild(temp);
    
    scrollList();

    varAllMessages[currentTalkingWith].push({
        type:'send',
        message:inpMsg.value,
    })

    inpMsg.value = '';
})

// Event Listener for Log out button
btnLogout.addEventListener("click", () => {
    user.innerText = "Hi There!!";
    initialDisable();
    formLogin.style.display = "inline-block";
    btnSignup.style.display = "inline-block";
    btnLogout.style.display = "none";
        
    socket.emit('logged_out');

});


// Global Page

btnGoGlobal.addEventListener('click',()=>{
    heading.innerText = "Global Users";
    globalUserPage.style.display = 'inline-block'
    // disableLoginParams(true);
    btnGoGlobal.disabled = true;

    for(let i in varUserBio) {
        if(i == currentLoggedIn) {
            continue;
        }
        let temp = document.createElement('div');
        temp.classList.add('globalUser');
        temp.innerText = i;
        globalUserList.appendChild(temp);
    }

    Array.from(globalUser).forEach(function(element){
        element.addEventListener('click',()=>{
            userDataSection[0].style.marginLeft = '0px';
            previewSection[0].style.display = 'inline-block';
            const name = element.innerText;
            btnConnect.disabled = false;
            connectedUser.innerText = name;
            description.innerText = varUserBio[name];
            
        })
    })
})


btnConnect.addEventListener('click',()=>{
    btnConnect.disabled = true;
    let tempUser = document.createElement('div');
        tempUser.innerText = connectedUser.innerText;
        tempUser.classList.add('currentUser');
        userList.appendChild(tempUser);

        Array.from(currentUser).forEach((element)=>{
            element.addEventListener('click',()=>{
                // alert(`Element Selected: ${element.innerText}`)
                inpMsg.disabled = false;
                btnsendMsg.disabled = false;
                inpMsg.focus();
                currentTalkingWith = element.innerText;

                if(varPreviousPerson) {
                    varPreviousPerson.style.fontWeight = 'normal';
                }

                element.style.fontWeight = 'bold';
                varPreviousPerson = element;

                if(!varAllMessages[currentTalkingWith]) {
                    varAllMessages[currentTalkingWith]=[];
                }
                chatList.innerHTML='';
                for(let item of varAllMessages[currentTalkingWith]){
                    let temp = document.createElement('div');
                    temp.innerText = item.message;
                    chatList.appendChild(temp);
                    if(item.type == 'send'){
                        temp.classList.add('send')
                    }else {
                        temp.classList.add('received');
                    }
                }
                scrollList();
            })
        })

})

btnCancelGlobal.addEventListener('click',()=>{
    heading.innerText = 'Chats';
    globalUserPage.style.display = 'none';
    disableLoginParams(false);
    btnGoGlobal.disabled = false;

})