const express = require("express");

// username , password | USERS table
// organization  | ORGANIZATIONS table
// boards | BOARDS table
// issues | ISSUES table

let userId = 0;

const USERS = [
  {
    id: 1,
    username: "sourabh",
    password: "123123",
  },
  {
    id: 2,
    username: "raman",
    password: "123random",
  },
];
const ORGANIZATIONS = [
  {
    id: 1,
    title: "100x-devs",
    description: "Learning coding",
    admin: 1,
    members: [2],
  },
];
const BOARDS = [
  {
    id: 1,
  },
];
const ISSUES = [];

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "landing page",
  });
});

app.post("/signup" , (req , res) => {
    const {username , password} = req.body;

    const userExist =  USERS.find((u) => u.username === username)

    USERS.push({
        id : userId++,
        username,
        password
    })
    res.json({
        message : "signup successfully"
    })
})

app.post("/signin" , (req , res) => {
    
})

app.post("/organization" , (req , res) => {
    
})

app.post("/add-member-to-organization" , (req , res) => {
    
})

app.post("/board" , (req , res) => {
    
})

app.post("/issue" , (req , res) => {
    
})

app.get("/boards/:organizationid" ,(req , res) => {

})

app.get("/issues" ,(req , res) => {

})

app.get("/members" ,(req , res) => {

})

app.put("/issues/:issueId" ,(req ,res) => {

})

app.delete("/member" , (req , res) => {
  
})



app.listen(3000, () => {
  console.log("server is running on port : 3000");
});
