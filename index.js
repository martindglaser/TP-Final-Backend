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

mongoose.connect('mongodb://localhost/marketplace', {
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
