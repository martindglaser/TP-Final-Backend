// index.js



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('express-handlebars');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const handlebarsHelpers = require('./handlebarsHelpers');
const adminRoutes = require('./routes/adminRoutes');
const indexRoute = require('./routes/indexRoute');
const app = express();
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env' }); // Cargar las variables de entorno de .env en desarrollo
}

const dbURL = process.env.NODE_ENV === 'production' ? process.env.DB_URL_PROD : process.env.DB_URL_DEV;
const debug = process.env.DEBUG === 'true';

console.log(dbURL)
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

app.engine('hbs', hbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: handlebarsHelpers
}).engine);



app.set('view engine', 'hbs');  // Configurar el motor de plantillas Handlebars

app.use(express.static('/css/bootstrap.min.css'));
app.use(express.static('/js/bootstrap.min.js'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/', indexRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
