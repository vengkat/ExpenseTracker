const functions = require('firebase-functions');
var firebase = require("firebase");
const admin = require("firebase-admin");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const serviceAccount = require(__dirname+"/expense-tracker-133df-firebase-adminsdk-lyrct-e7a3366cf2.json");

var config = {
    projectId:"expense-tracker-133df",
    apiKey: "AIzaSyDWOLeMJCm-GhRolGxxcfmW1Wn4ekTURuc",
    authDomain: "expense-tracker-133df.firebaseapp.com",
    databaseURL: "https://expense-tracker-133df.firebaseio.com",
    storageBucket: "gs://expense-tracker-133df.appspot.com",
    credential: admin.credential.cert(serviceAccount)
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();

  const ExpenceMasterColl = db.collection('Expense-Master');
exports.GetExpense = functions.https.onRequest((request, response) => {
   console.log("Path - "+__dirname+"/expense-tracker-133df-firebase-adminsdk-lyrct-e7a3366cf2.json");
   let date = "";
    let category = "";
    let list = [];
    var query = ExpenceMasterColl;
    if(request.query.category){ 
         category = request.query.category;
         console.log("GetExpense :: category - "+category);
         query = query.where("Category", "==", category);
    }
    if(request.query.date){
      console.log("GetExpense :: request.query.date - "+request.query.date);
      date = request.query.date;
      //("2019-02-02T12:00:00 05:30").substr(0,("2019-02-02T12:00:00 05:30").indexOf("T"))
         console.log("GetExpense :: date - "+date);
         query = query.where("Date", "==", date);
    }
    query.get()
    .then(snapshot => {                              
       snapshot.forEach(doc => {
          let data = doc.data();
          data.Id=doc.id;
          list.push(data);                                 
       });                         
       return response.send(list);                             
    })
    .catch(err => {
       console.log('GetExpese :: Error getting documents', err);
       response.sendStatus(400) 
    });  
});


exports.AddExpense = functions.https.onRequest((request, response)=>{
   console.log(`AddExpense :: category -  ${request.query.category} | Amount - ${request.query.amount}  | date - ${request.query.date}`);
    let Category = request.query.category; 
    let Amount = request.query.amount;
    let date = request.query.date;
    
    if(!date || date.length === 0){
      var now = new Date(); 
      date = (now.getMonth()+1)+'/'+now.getDate()+'/'+now.getFullYear();
    }
    
    ExpenceMasterColl.doc().set({
      Category: Category,      
      Amount:Amount,
      ActionDate: new Date(),
      Date:date
   }).then(ref => {
      response.statusCode = 200;
      return response.sendStatus(200);
    }).catch(err => {
      console.log('AddExpense :: Error adding documents', err);
      response.sendStatus(400) 
   });
})