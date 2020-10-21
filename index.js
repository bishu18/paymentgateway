const express = require("express");
require('dotenv').config();
const Insta = require("instamojo-nodejs");
const bodyParser = require("body-parser");

const API_KEY = process.env.API_KEY

const AUTH_KEY = process.env.AUTH_KEY

Insta.setKeys(API_KEY, AUTH_KEY);

Insta.isSandboxMode(true);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
   res.sendFile(__dirname + "/index.html") 
});

app.post("/pay", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var amount = req.body.amount;

    var data = new Insta.PaymentData();

    const REDIRECT_URL = "http://localhost:5000/success";

    data.setRedirectUrl(REDIRECT_URL);
    data.send_email = "True";
    data.purpose = "Donate Money to help"; // REQUIRED
  
    data.amount = amount;
    data.name = name;
    data.email = email; // REQUIRED
  
    Insta.createPayment(data, function (error, response) {
      if (error) {
        // some error
      } else {
        // Payment redirection link at response.payment_request.longurl
        res.send("Please check your email to make payment")
      }
    });
});

app.get('/success', (req, res) => {
    res.send("Payment Successful! Please check your email for invoice..");
});


app.listen(port, () => {
    console.log(`Server started on ${port}`);
});