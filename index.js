require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { userModel, organizationModel } = require("./models");

// username , password | USERS table
// organization  | ORGANIZATIONS table
// boards | BOARDS table
// issues | ISSUES table

// let USER_ID = 1;
// let ORGANIZATION_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;

// const USERS = [
//   {
//     id: 1,
//     username: "sourabh",
//     password: "123123",
//   },
//   {
//     id: 2,
//     username: "raman",
//     password: "123random",
//   },
// ];
// const ORGANIZATIONS = [
//   {
//     id: 1,
//     title: "100x-devs",
//     description: "Learning coding",
//     admin: 1,
//     members: [2],
//   },
// ];
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

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // const userExists = USERS.find((u) => u.username === username);
  const userExists = await userModel.findOne({
    username,
  });

  // console.log(userExists);

  if (userExists) {
    res.status(411).json({
      message: "User with this username already exists",
    });
    return;
  }

  const newUser = await userModel.create({
    username,
    password,
  });

  res.json({
    id: newUser._id,
    message: "signup successfully",
  });
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  // const userExists = USERS.find(
  //   (u) => u.username === username && u.password === password,
  // );

  const userExists = await userModel.findOne({
    username,
    password,
  });

  if (!userExists) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
  // console.log(userExists);
  //create jwt for the user
  const token = jwt.sign(
    {
      userId: userExists._id,
    },
    "secret123",
  );
  res.json({
    token,
  });
});

app.post("/organization", authMiddleware, async (req, res) => {
  const userId = req.userId;

  // ORGANIZATIONS.push({
  //   id: ORGANIZATION_ID++,
  //   title: req.body.title,
  //   description: req.body.description,
  //   admin: userId,
  //   members: [],
  // });

  const newOrg = await organizationModel.create({
    title: req.body.title,
    description: req.body.description,
    admin: userId,
    members: [],
  });

  res.json({
    id: newOrg._id,
    message: "Org created",
  });
});

app.post("/add-member-to-organization", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const organizationId = req.body.organizationId;
  const memberUserUsername = req.body.memberUserUsername;
  // console.log(organizationId);
  // const organization = ORGANIZATIONS.find((org) => org.id === organizationId);

  const organization = await organizationModel.findOne({
    _id: organizationId,
  });

  // console.log(organization);
  // console.log(organization.admin);
  // console.log(userId);

  if (!organization || organization.admin.toString() !== userId) {
    res.status(411).json({
      message:
        "Either this org doesnt exist or you are not an admin of this org",
    });
    return;
  }

  // const memberUser = USERS.find((u) => u.username === memberUserUsername);

  const memberUser = await userModel.findOne({
    username: memberUserUsername,
  });

  if (!memberUser) {
    res.status(411).json({
      message: "No user with this username exists in our db",
    });
    return;
  }

  // if (organization.members.includes(memberUser._id)) {
  //   return res.status(400).json({
  //     message: "User is already a member of this organization",
  //   });
  // }

  // organization.members.push(memberUser._id);

  const alreadyMember = await organizationModel.findOne({
    _id: organizationId,
    member: memberUser._id,
  });

  if (alreadyMember) {
    return res.status(400).json({
      message: "User is already a member of this organization",
    });
  }

  const newMember = await organizationModel.updateOne(
    { _id: organizationId },
    { $push: { member: memberUser._id } },
  );
  res.json({
    message: "New member added!",
  });
});

app.post("/board", (req, res) => {});

app.post("/issue", (req, res) => {});

// get endpoints

app.get("/organization", authMiddleware, (req, res) => {
  const userId = req.userId;
  const organizationId = parseInt(req.query.organizationId);

  const organization = ORGANIZATIONS.find((org) => org.id === organizationId);

  if (!organization || organization.admin !== userId) {
    res.status(411).json({
      message:
        "Either this org doesnt exist or you are not an admin of this org",
    });
    return;
  }

  res.json({
    organization: {
      ...organization,
      members: organization.members.map((memberId) => {
        const user = USERS.find((user) => user.id === memberId);
        return {
          id: user.id,
          username: user.username,
        };
      }),
    },
  });
});

app.get("/boards/:organizationid", (req, res) => {});

app.get("/issues", (req, res) => {});

app.get("/members", (req, res) => {});

app.put("/issues/:issueId", (req, res) => {});

app.delete("/member", authMiddleware, (req, res) => {
  const userId = req.userId;
  const organizationId = req.body.organizationId;
  const memberUserUsername = req.body.memberUserUsername;

  const organization = ORGANIZATIONS.find((org) => org.id === organizationId);

  if (!organization || organization.admin !== userId) {
    return res.status(403).json({
      message:
        "Either this org doesn't exist or you are not an admin of this org",
    });
  }

  const memberUser = USERS.find((u) => u.username === memberUserUsername);

  if (!memberUser) {
    return res.status(404).json({
      message: "No user with this username exists in our db",
    });
  }

  if (!organization.members.includes(memberUser.id)) {
    return res.status(400).json({
      message: "User is not a member of this organization",
    });
  }

  organization.members = organization.members.filter(
    (memberId) => memberId !== memberUser.id,
  );

  res.json({
    message: "Member deleted",
  });
});

app.listen(3000, () => {
  console.log("server is running on port : 3000");
});
