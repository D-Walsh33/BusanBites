const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Restaurant = require('./models/restaurant');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/busanbites', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
})

app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new')
})

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/show', { restaurant })
})

app.get('/restaurants/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/edit', { restaurant })
})

app.post('/restaurants', async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`)
})

app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    res.redirect(`/restaurants/${restaurant._id}`)
})

app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id)
    res.redirect('/restaurants')
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})