require('dotenv').config();
const express   = require('express');
const path      = require('path');
const session   = require('express-session');
const mongoose  = require('mongoose');

const routes    = require('./controllers/router')
let app         = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// creation de la session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// encode les données du formulaire
app.use(express.urlencoded({ extended: false }));
// format json
app.use(express.json());
// dire a node que l'on utilise ejs comme moteur de template
app.set('view engine', 'ejs');
// definir le dossier des vues
app.set('views', path.join(__dirname, 'views'));
// déclarer le dossier des statiques
app.use(express.static(path.join(__dirname, 'public')));
// definir les routes du controller "router" sur les routes /
app.use('/', routes)

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});