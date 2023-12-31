const express   = require('express');
const bcrypt = require('bcrypt');
let router      = express.Router();
const Users     = require('../models/users');
const routeProd = require('./products');
const Products = require('../models/products');
const flash = require('connect-flash');
router.use(flash());

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


router.get('/', isLogin, async (req, res) => {
  try {
    const products = await Products.find({});

    res.render('index', { user: req.session.user, products });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de produits :', error);
    res.status(500).send('Erreur serveur');
  }
});


router.get('/login', async (req, res) => {
    res.render('users/login')
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });
        const products = await Products.find({});
        if (!user) { // Vérifiez si l'utilisateur existe
            req.flash('error', 'Adresse e-mail ou mot de passe incorrect.');
            return res.redirect('/login');
        }

        // Vérifiez le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            req.flash('error', 'Adresse e-mail ou mot de passe incorrect.');
            return res.redirect('/login');
        }

        req.session.user = user;

        res.render('index', { user, products });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Erreur lors de la connexion.');
        res.redirect('/login');
    }
});

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

router.get('/user/update/:id', isLogin, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findById(userId);
        res.render('users/update', { user });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/user/update/:id', isLogin, async (req, res) => {
    const userId = req.params.id;
    const { username , firstname, lastname } = req.body;  

    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, {  
            username: username,
            lastname: lastname,
            firstname: firstname},{ new: true });

        if (!updatedUser) {
            return res.status(404).send("Utilisateur introuvable");
        }
        req.session.user = updatedUser;

        res.status(200).render('users/profil', { user: req.session.user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification.' });
    }
});

// DELETE
router.delete('/user/delete/:id', isLogin, async (req, res) => {
    const { id } = req.session.user._id;
    try {
        await Users.findByIdAndDelete(id);
        req.session.destroy();
        res.redirect('/', {user: req.session.user});
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('An error occurred while deleting the user');
    }
});

router.get('/profil',isLogin, async (req, res) => {
    res.render('users/profil', { user: req.session.user })
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

router.use('/products', routeProd);

// router.use('/users', routeUser)

module.exports = router;