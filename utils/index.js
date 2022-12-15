const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const listModel = require("../models/list");
// var list = mongoose.model('list')
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

try {
  mongoose.connect(
    "mongodb+srv://testapp:20010524@webtest.a6zbgwl.mongodb.net/test"
  );
} catch (e) {
  console.log(e);
}
app.get("/test", async (req, res) => {
  const form = await userModel.find({});
  userModel.find({}, async (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/list", async (req, res) => {
  const form = await listModel.find({});
  listModel.find({}, async (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// app.get("/user/:_id",async(req,res)=>{
//     const {staffId}= req.params._id;
//     const response = await user.findOne({staffId})
//     res.send(response)
// });

///////User
app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  userModel.find({ email }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  });
  // const emails = req.query.email
  // console.log(emails)
  // userModel.find({"email":emails},(err,ress)=>{
  //     if(err){
  //     res.status(500).send("ERRR")

  //     } else {
  //         res.status(200).send(ress)

  //     }
  // })
  // console.log(response)
});

app.post("/addUser", async (req, res) => {
  const user = req.body;
  const newUser = new userModel(user);
  await newUser.save();
  res.json(user);
});

///////List
app.get("/list/:_id", async (req, res) => {
  const user_id = req.params._id;
  listModel.find({ user_id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  });
});

app.post("/addList", async (req, res) => {
  const list = req.body;
  const newList = new listModel(list);
  await newList.save();
  res.json(list);
});

app.post("/delete/:_id", async (req, res) => {
  const user_id = req.params._id;
  console.log(user_id);
  listModel.deleteOne({ _id: user_id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.send(docs);
    }
  });
});

// app.post("/createStaff", async (req, res)=>{
//     const staff= req.body;
//     const newStaff =  new staffModel(staff);
//     await newStaff.save();
//     res.json(staff);
// })

// app.get("/searchStaff", async (req, res)=>{

//     const {staffId}= req.query;
//     const staff = await staffModel.findOne({staffId})

//     res.send(staff)
// })
// app.get("/user/:id", async (req, res)=>{

//     const {staffId}= req.query;
//     const staff = await staffModel.findOne({staffId})

//     res.send(staff)
// })
// app.get("/photosOfUser/:id", async (req, res)=>{

//     const {staffId}= req.query;
//     const staff = await staffModel.findOne({staffId})
//     console.log(staff)

//     res.send(staff)
// })

app.listen(3001, () => {
  console.log("Server ajiljiin");
});
