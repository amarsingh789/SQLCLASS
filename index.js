const  { faker } = require('@faker-js/faker');

const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const { error } = require('console');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: "@Amar@123#",
  });

  let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };
//INSERTING A NEW DATA
  // let q = "INSERT INTO user (id, username, email, password) VALUES ?";
  // // let users =[
  // //    ["123b", "randam@123b", "abc@gmail.comb", "abcb"],
  // //    ["123c", "randam@123c", "abc@gmail.comc", "abcc"]
  // //   ];
  // let data =[];
  // for(let i = 1; i<=100; i++ ){
  //   data.push(getRandomUser());
  // }
//   try{
//     connection.query(q, [data],(err,result) =>{
//       if(err) throw err;
//       console.log(result); 
//       // console.log(result.length);
//       // console.log(result[0]);
//       // console.log(result[1]);
//     }) ;
//   } catch (err){
//     console.log(err);
//   }

// connection.end();


 // console.log(getRandomUser());

//home route
app.get("/", (req,res)=>{
  let q = `SELECT count(*) FROM user`;
    try{
    connection.query(q,(err,result) =>{
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", {count});
      // console.log(result.length);
      // console.log(result[0]);
      // console.log(result[1]);
    }) ;
  } catch (err){
    console.log(err);
    res.send("some error in db")
  }
 //res.send("welcome to my page");
});

//show route
app.get("/user",(req,res)=>{
  // res.send("success");
  let q = `SELECT * FROM user`;
  try{
    connection.query(q,(err,users) =>{
      if(err) throw err;
     // console.log(result);
     //res.send(result);
     res.render("showUser.ejs", {users});
      // console.log(result.length);
      // console.log(result[0]);
      // console.log(result[1]);
    }) ;
  } catch (err){
    console.log(err);
    res.send("some error in db");
  }
});
//EDIT ROUTE
app.get("/user/:id/edit", (req,res)=>{
  let {id} = req.params;
  // console.log(id);
  let q = `SELECT * FROM user WHERE id='${id}'`
  try{
    connection.query(q,(err,result) =>{
      if(err) throw err;
      //console.log(result);
      let user = result[0];
      res.render("edit.ejs", {user});
    }) ;
  } catch (err){
    console.log(err);
    res.send("some error in db");
  }
});
//update(DB) route
app.patch("/user/:id", (req,res)=>{
  //res.send("updated");
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`
  try{
    connection.query(q,(err,result) =>{
      if(err) throw err;
      //console.log(result);
      let user = result[0];
      if(formPass != user.password){
        res.send("WRONG password")
       }else{
         let q2= `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
         connection.query(q2,(err,result)=>{
           if(err) throw err;
           res.redirect("/user");
         });
      }
    }) ;
  } catch (err){
    console.log(err);
    res.send("some error in db");
  }
})
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});
app.post("/user/new",(req,res)=>{
  let {username, email , password} = req.body;
  let id= uuidv4();
  let q = `INSERT INTO user(id, email, username, password) VALUES('${id}', '${email}', '${username}', '${password}')`;
  try{
     connection.query(q, (err, result)=>{
      if(err) throw err;
      console.log("add new user");
      res.redirect("/user")
     });
  }catch (err){
    res.send("error in data base check now!!")
  }
})
app.get("/user/:id/delete", (req,res)=>{
  let {id}= req.params;
  let q = `SELECT * FROM user WHERE id ='${id}'`;

  try{
     connection.query(q,(err, result)=>{
      if(err) throw err;
      let user= result[0];
      res.render("delete.ejs", {user});
      console.log("button was click");
     });
  }catch(err){
    res.send("error was found");
  }
})

app.delete("/user/:id/", (req,res)=>{
  let {id}= req.params;
  let{password}= req.body;
  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(user.password != password){
        res.send("wrong password enter")
      }else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result)=>{
          if (err) throw err;
          else{
            console.log(result);
            console.log("detected!");
            res.redirect("/user");
          }
        })
      }

    })
  }catch(err){
     res.send("error in db")
  }
})




 app.listen("8080", ()=>{
   console.log("server is listing to port 8080");
 });


