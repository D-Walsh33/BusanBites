const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurant');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../middleware');
const { resolveInclude } = require('ejs');


const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/restaurants')
    }
    res.render('restaurants/show', { restaurant })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/restaurants')
    }
    res.render('restaurants/edit', { restaurant })
}))

router.post('/', isLoggedIn, validateRestaurant, catchAsync(async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Succesfully created a new restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`)
}))

router.put('/:id', isLoggedIn, isAuthor, validateRestaurant, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    req.flash('success', 'You have edited this Restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id)
    req.flash('success', 'You have deleted this Restaurant!')
    res.redirect('/restaurants')
}))

module.exports = router;