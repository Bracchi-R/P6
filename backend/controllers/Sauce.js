const Sauce = require('../models/Sauce');
const fs = require('fs'); // File system

// Renvoyer un tableau contenant toute les sauces
exports.getAllSauce = (req, res, next) => {
    console.log(res);
    console.log(req);
    console.log(next);
    // Trouver tout les objets
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Renvoyer une seul sauce grace a Id
exports.getOneSauce =  (req, res, next) => {
    // Trouver un seul objet
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Enregistrement des nouvelle Sauce dans la Base de Données
exports.createSauce = (req, res, next) => {
    console.log('fnreohfeo');
    const sauceObject = JSON.parse(req.body.sauce);
    // supresion de ID donne par mongodb
    delete sauceObject._id;
    // Création d'un nouvelle objet Sauce
    const sauce = new Sauce({
        // Copie de tous les éléments de req.body
        ...req.sauceObject,
        // Création de l'URL de l'image : http://localhost:3000/image/nom
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistre sauce dans la base de donnée
    sauce.save()
        // Renvoi une réponse de réussite
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        // Renvoi une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce existant
exports.modifySauce = (req, res, next) => {
    // Si on trouve un fichié
    const sauceObject = req.file ?
    // Si il existe déjà une image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // UpdateOne permet de mèttre à jour la sauce
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

// Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
    // Trouver objet dans la base de donnée
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            // Récupération du nom du fichier de l'image
            const filename = sauce.imageUrl.split('/images/')[1];
            // On efface le fichier (unlink)
            fs.unlink(`images/${filename}`, () => {
                // DeleteOne pour suprimer objet de la base de donée
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
      .catch(error => res.status(500).json({ error }));
};

// Aimer ou pas une sauce
exports.likeOrNot = (req, res, next) => {
    // Si l'utilisateur aime la sauce
    if (req.body.like === 1) {
        // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } 
    // Si l'utilisateur n'aime pas la sauce
    else if (req.body.like === -1) {
         // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } 
    else {
        // Si like === 0 l'utilisateur supprime son vote
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // Si le tableau "userLiked" contient l'ID de l'utilisateur
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // On enlève un like du tableau "userLiked" 
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } 
                // Si le tableau "userDisliked" contient l'ID de l'utilisateur
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // On enlève un dislike du tableau "userDisliked" 
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}



