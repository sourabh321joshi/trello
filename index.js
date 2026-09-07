const express = require("express");
const jwt = require("jsonwebtoken");
// username , password | USERS table
// organization  | ORGANIZATIONS table
// boards | BOARDS table
// issues | ISSUES table

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;

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

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const userExists = USERS.find((u) => u.username === username);

  if (userExists) {
    res.status(411).json({
      message: "User with this username already exists",
    });
    return;
  }

  USERS.push({
    id: USER_ID++,
    username,
    password,
  });
  res.json({
    message: "signup successfully",
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  const userExists = USERS.find(
    (u) => u.username === username && u.password === password,
  );

  if (!userExists) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  //create jwt for the user
  const token = jwt.sign(
    {
      userId: userExists.id,
    },
    "secret123",
  );
  res.json({
    token,
  });
});

app.post("/organization", (req, res) => {});

app.post("/add-member-to-organization", (req, res) => {});

app.post("/board", (req, res) => {});

app.post("/issue", (req, res) => {});

app.get("/boards/:organizationid", (req, res) => {});

app.get("/issues", (req, res) => {});

app.get("/members", (req, res) => {});

app.put("/issues/:issueId", (req, res) => {});

app.delete("/member", (req, res) => {});

app.listen(3000, () => {
  console.log("server is running on port : 3000");
});
