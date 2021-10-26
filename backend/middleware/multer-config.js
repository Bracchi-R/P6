// Utilisation de multer pour enregistrer les fichiers images
const multer = require('multer'); // npm install --save multer

// Modification de l'extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Objet de configuration pour multer pour enregister sur le disk
const storage = multer.diskStorage({
    // Enregistrement dans le dossier "images"
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Génération du nom du fichier
    filename: (req, file, callback) => {
        // Non d'origine du fichié
        const name = file.originalname.split(' ').join('_');
        // Appliquer une extension au fichié
        const extension = MIME_TYPES[file.mimetype];
        // Création du nom du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});
// Exporter multer avec un fichié unique
module.exports = multer({ storage }).single('image');