const session = require('express-session');
const passport = require('passport');
const express = require('express')
const app = express()
const port = 3000
require('./controller/auth')
const isLoggedIn = require('./middleware/isLogged')
const monitorInbox = require('./controller/sendmail');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('<a href="/auth/google">Login with google</a>'));
app.get('/auth/google', passport.authenticate('google',{  scope : ['email','profile']}));
app.get('/google/callback', passport.authenticate('google',{
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'

}))

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName} <a href = '/logout'>layout</a> <a href = '/sendmail> sendmail </a>`);
  });

app.get('/sendmail' , (req,res) => {
    res.send(`sending mail`);
})
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('sucessfully logout !');
  });

app.get('/failure'), (req,res) => res.send('<h1> Something went on</h1>');
app.listen(port, () => console.log(`Example app listening on port ${port}!`))