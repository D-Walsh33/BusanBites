const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Restaurant = require('../models/restaurant');
const { restaurantSchema } = require('../schemas')



const validateRestaurants = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
})

router.get('/new', (req, res) => {
    res.render('restaurants/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    if (!restaurant) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/restaurants')
    }
    res.render('restaurants/show', { restaurant })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/restaurants')
    }
    res.render('restaurants/edit', { restaurant })
}))

router.post('/', validateRestaurants, catchAsync(async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash('success', 'Succesfully created a new restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`)
}))

router.put('/:id', validateRestaurants, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    req.flash('success', 'You have edited this Restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id)
    res.redirect('/restaurants')
}))

module.exports = router;