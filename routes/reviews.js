const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Your review has been added!')
    res.redirect(`/restaurants/${restaurant._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'You have deleted a Review!');
    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;