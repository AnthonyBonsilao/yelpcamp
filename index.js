// Imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const engine = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parser
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(methodOverride('_method'));

// Global Variables
const dbName = 'yelp-camp';
const port = 3000;

// Connection to MongoDB
mongoose.connect(`mongodb://localhost:27017/${dbName}`);

mongoose.connection.on('error', err => {
    console.error('Connection Error:', err);
});
mongoose.connection.once('open', () => {
    console.log('Database connected.');
});

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index.ejs', { campgrounds });
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/create', (req, res) => {
    res.render('./campgrounds/create.ejs');
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('./campgrounds/show.ejs', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('./campgrounds/edit.ejs', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})

app.listen(port, () => {
    console.log('Serving on port 3000.');
});

