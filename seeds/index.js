const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedhelpers');
const { cities } = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
mongoose.connection.on('error', err => {
    console.error('Connection Error:', err);
});
mongoose.connection.once('open', () => {
    console.log('Database connected.');
});

const generateTitle = () => {
    const first = descriptors[Math.floor(Math.random() * (descriptors.length))];
    const second = places[Math.floor(Math.random() * (places.length))];
    const title = first + ' ' + second;
    return title;
}

const generateLocation = () => {
    let random = Math.floor(Math.random() * cities.length);
    const city = cities[random].city;
    const state = cities[random].state;
    const location = `${city}, ${state}`;
    return location;
}

const seedDB = async () => {
    console.log(Campground);
    await Campground.deleteMany({});
    let campgrounds;
    for (let i = 0; i < 50; i++) {
        const price = Math.floor((Math.random() * 20) + 10);
        campgrounds = new Campground({
            title: generateTitle(),
            location: generateLocation(),
            price,
            image: 'https://source.unsplash.com/collection/483251'
        })
        await campgrounds.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});