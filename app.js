const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Restaurant = require('./models/restaurant');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const { request } = require('http');
const ExpressError = require('./utils/ExpressError')
const { restaurantSchema, reviewSchema } = require('./schemas')
const { join } = require('path');
const Review = require('./models/review');


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

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'))

const validateRestaurants = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

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

app.get('/restaurants/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    res.render('restaurants/show', { restaurant })
}))

app.get('/restaurants/:id/edit', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/edit', { restaurant })
}))

app.post('/restaurants', validateRestaurants, catchAsync(async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`)
}))

app.put('/restaurants/:id', validateRestaurants, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    res.redirect(`/restaurants/${restaurant._id}`)
}))

app.delete('/restaurants/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id)
    res.redirect('/restaurants')
}))

app.post('/restaurants/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}))

app.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/restaurants/${id}`)

}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no! Something went wrong!";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})