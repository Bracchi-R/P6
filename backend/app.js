// npm list --depth=0  verifier la librerie instaler

const express = require('express'); // npm install --save express
const bodyParser = require('body-parser'); // npm install --save body-parser
const mongoose = require('mongoose'); // npm install --save mongoose
const path = require('path');


// vas chercher les routes dans le dossier routes
const SauceRoute = require('./routes/Sauce');
const UserRoute = require('./routes/User');


// Connexion à la base de données avec mongoose
mongoose.connect('mongodb+srv://Romain:Aa15091987@cluster0.kz0ba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
  useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Définition de headers pour éviters les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', SauceRoute);
app.use('/api/auth', UserRoute);


module.exports = app;