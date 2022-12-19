const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../middleware');
const { resolveInclude } = require('ejs');
const restaurants = require('../controllers/restaurants');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ dest: storage });


const router = express.Router({ mergeParams: true });

router.route('/')
    .get(catchAsync(restaurants.index))
    .post(isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createRestaurant));


router.get('/new', isLoggedIn, restaurants.renderNewForm)

router.route('/:id')
    .get(catchAsync(restaurants.showRestaurant))
    .put(isLoggedIn, isAuthor, validateRestaurant, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm));


module.exports = router;