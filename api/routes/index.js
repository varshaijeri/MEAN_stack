var express = require('express');
var router = express.Router();
var hotelsCtrl = require('../controllers/hotels.controllers');
var reviewsCtrl = require('../controllers/reviews.controllers');
var usersCtrl = require('../controllers/users.controllers');

router
    .route('/hotels')
    .get(hotelsCtrl.hotelsGetAll)
    .post(hotelsCtrl.hotelsAddOne);

router
    .route('/hotels/:hotelId')
    .get(hotelsCtrl.hotelsGetOne)
    .put(hotelsCtrl.hotelsUpdateOne)
    .delete(hotelsCtrl.hotelsDeleteOne);

//REVIEW ROUTES
router
    .route('/hotels/:hotelId/reviews')
    .get(reviewsCtrl.reviewsGetAll)
    .post(usersCtrl.authenticate,reviewsCtrl.reviewsAddOne);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(reviewsCtrl.reviewsGetOne)
    .put(reviewsCtrl.reviewsUpdateOne)
    .delete(reviewsCtrl.reviewsDeleteOne);

    //Authentication routes
router
    .route('/users/register')
    .post(usersCtrl.register);

router
    .route('/users/login')
    .post(usersCtrl.login)

module.exports = router;