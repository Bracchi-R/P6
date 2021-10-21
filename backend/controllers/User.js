const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Création d'un nouvelle User
exports.signup = (req, res, next) => {
    // Cryptage du  mot de pass
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Crée un nouvelle User avec le mot de pass crypter
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Enregistre dans la basse de donnée
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Connexion d'un User enregistré
exports.login = (req, res, next) => {
    // Recherche si le User existe dans la base de donnée
    User.findOne({ email: req.body.email })
        .then(user => {
         if (!user) {
            // Si ont ne trouve pas de User correspondant
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // On compare le mot de passe avec celui de la base de donnée
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
            if (!valid) {
                 return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Requete ok et création objet json
            res.status(200).json({
                userId: user._id,
                // Création d'un token pour sécuriser le compte de l'utilisateur
                token: jwt.sign(
                     { userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    // Expiration du token en 24h
                    { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
 };