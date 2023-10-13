const express   = require('express');
const bcrypt = require('bcrypt');
let router      = express.Router();
const Users     = require('../models/users');
// const routeUser = express.Router('./controllers/users');

const isLogin = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

const isAdmin = (req, res, next) => {
    if(req.session && req.session.user && req.session.user.access === 'admin'){
        next()
    } else {
        res.status(403).send('Acces refusé');
    }
}

router.get('/',isLogin, async (req, res) => {
    res.render('index', { user: req.session.user })
})

router.get('/login', async (req, res) => {
    res.render('users/login')
})


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
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, lastname, firstname } = req.body;

        const existingUser = await Users.findOne({ email }); //verifier user n'existe pas
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({ username, email,  password: hashedPassword, lastname, firstname });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de inscription.' });
    }
});

router.post('/user/update', isLogin, async (req, res) => {
    const userId = req.session.user.id;  // Assuming you have a user id in the session

    try {
        // Get the updated user data from the request body
        const updatedUserData = req.body;  // Assuming req.body contains the updated user data

        // Update the user based on the user id
        await updateUserById(userId, updatedUserData);

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user');
    }
});

router.get('/profil', async (req, res) => {
    res.render('users/profil', { user: req.session.user })
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

// router.use('/users', routeUser)

module.exports = router;