const Joi = require('joi');

module.exports.restaurantSchemarestaurantSchema = Joi.object({
    restaurant: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        imgae: Joi.string().required()
    }).required()
})