const express   = require('express');
const bcrypt = require('bcrypt');
let router      = express.Router();
const Users     = require('../models/users');
// const routeUser = express.Router('./controllers/users');
// constrouteUser = express.Router('./controllers/users')
const routeProd = require('./products');

const isLogin = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

const isAdmin = (req, res, next) => {
    if(req.session && req.session.user.access == 'admin'){
        next()
    } else {
        res.redirect('/')
    }
}

router.get('/',isLogin, async (req, res) => {
    res.render('index', { user: req.session.user })
})

router.get('/login', async (req, res) => {
    res.render('login')
})

// CRUD User

// get All
router.get('/users', async(req, res) => {
    try {
        const users = await Users.find({});
        res.send(users);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
})

// Delete
router.delete('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await Users.findOneAndDelete({ email: email });
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// Update
router.put('/user/:email', async (req, res) => {
    const { email } = req.params;
    const { username } = req.body; 
    try {
        const user = await Users.findOneAndUpdate(
            { email: email }, 
            { username: username }, 
            { new: true } 
        );

        if (user) {
            res.send(user);
        } else {
            res.status(404).send("Aucun utilisateur trouvé avec cet e-mail.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });

        if (!user) { //verifie si user existe
            return res.status(400).json({ message: 'Adresse e-mail ou mot de passe incorrect.' });
        }

        // Vérifiez le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Adresse e-mail ou mot de passe incorrect.' });
        }
        req.session.user = user;

        res.render('index', { user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Users.findOne({ email }); //verifier user n'existe pas
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({ username, email,  password: hashedPassword  });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de inscription.' });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

router.use('/products', routeProd);

// router.use('/users', routeUser)

module.exports = router;