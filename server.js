const app = require("express")();
const bodyParser = require("body-parser");
const config = require("./config/config");
const { port } = config;
app.use(bodyParser.json());
const admin = require("firebase-admin");

const serviceAccount = require("./keys/serviceAccountKey.json");
const registrationToken =''; // Put device registration code at time of first notification you get. 
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "" // This url from the firebase dashboard while creating app.
  });

app.post("/pushmessages", (req, res) => {
  let error;
  let data;
  let st;
  let message = req.body;
  console.log("************REQUEST iS***************");
  console.log(message);
  console.log("************REQUEST END***************");
  let payload = {
    data: message
  };
  let options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };
  
  admin
    .messaging()
    .sendToDevice(registrationToken, payload, options)
    .then(function(response) {
      console.log(`send notification`);
      console.log(response);
      data=response;
      st=201;
    })
    .catch(function(err) {
      console.log(`Error in sending to firebase server  ${err}`);
      console.log(err);
      error=err;
      st=500;
    });
  return res.send({
    message: "Got response from firebase server",
    service: "Sending notification to firebase",
    status: st,
    payload: data || error
  });
});

app.listen(port, () => {
  console.log(`Listening server on port for fire-base notification on the port ${port}`);
});