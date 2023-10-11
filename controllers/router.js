const express   = require('express');
let router      = express.Router();
const Users     = require('../models/users');

const isLogin = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/', isLogin, async (req, res) => {
   
    res.render('index', { user: req.session.user })
})

router.get('/login', async (req, res) => {
    let john = new Users({
        username: 'john',
        email: 'john',
        password: 'john',
    })
    await john.save()
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
// get One
router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await Users.findOne({ email: email });
        res.send(user);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
})

// Create
router.post('/user', async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const user = new Users({ username, email, password });
        await user.save();
        res.send(user);
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
    req.session.user = req.body
    res.redirect('/')
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    // Todo
    res.redirect('/')
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router;