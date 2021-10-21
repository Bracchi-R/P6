const jwt = require('jsonwebtoken');

// Validation userId en comparaison avec le token
module.exports = (req, res, next) => {
    try {
        // Retourne le 2eme element du tableau
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le TOKEN
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récuperer le UserId dans le TOKEN
        const userId = decodedToken.userId;
        // Vérifier du UserId de la requete avec celui du TOKEN
        if (req.body.userId && req.body.userId !== userId) {
            // Erro
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};