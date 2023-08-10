// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('express-handlebars');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');  // Importar las rutas de usuarios

const app = express();

mongoose.connect('mongodb://localhost/marketplace', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.engine('hbs', hbs.create({ extname: 'hbs', defaultLayout: 'main' }).engine);
app.set('view engine', 'hbs');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);  // Usar las rutas de usuarios

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
