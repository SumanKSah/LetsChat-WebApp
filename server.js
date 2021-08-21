const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

// http for socket
const http = require("http");
const server = http.createServer(app);

// fetching socket library
const socketio = require("socket.io");
const io = socketio(server);

//fetching mongo library
const { MongoClient } = require("mongodb");
const mongo_URL = "mongodb://localhost:27017";
const DB_name = "letschat";
let userCollection;

(async function () {
    const client = await MongoClient.connect(mongo_URL);
    const letschatDB = client.db(DB_name);
    userCollection = letschatDB.collection("users");
})()
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => {
        console.error(err);
    });

// Signup POST Request Handler
app.post("/signup", (req, res) => {
    userCollection
        .insertOne({
            username: req.body.signupUsername,
            password: req.body.signupPassword,
            bio: req.body.signupBio,
        })
        .then(() => {
            res.send("User Added Successfully!!");
        })
        .catch((err) => res.send("Some error Occured :( !!"));
});

// Listening for the sockets
io.on("connection", (socket) => {
    console.log("user connected with id: ", socket);
});

// Listening on http made server
server.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
});
