var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function (req, res) {
    var hotelId = req.params.hotelId;
    Hotel.findById(hotelId).select('reviews').exec(function (err, hotel) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!hotel) {
            console.log("Hotel id not found in database", hotelId);
            response.status = 404;
            response.message = {
                "message": "Hotel ID not found " + hotelId
            };
        } else {
            response.message = hotel.reviews ? hotel.reviews : [];
        }
        res
            .status(response.status)
            .json(response.message);
    });
}

module.exports.reviewsGetOne = function (req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    Hotel.findById(hotelId).select('reviews').exec(function (err, hotel) {
        var response = {
            status: 200,
            message: null
        }
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!hotel) {
            response.status = 404;
            response.message = {
                "message": "Hotel with Id: " + hotelId + " is not found"
            };
        } else {
            response.message = hotel.reviews.id(reviewId);
            if (!response.message) {
                response.status = 404;
                response.message = {
                    "message": "reviewId: " + reviewId + " is not found"
                };
            }
        }
        res.status(response.status).json(response.message);
    });
}

var _addReview = function(req,res,hotel){
    hotel.reviews.push({
        name:req.body.name,
        rating:parseInt(req.body.rating),
        review:req.body.review
    });

    hotel.save(function(err,hotelUpdated){
        if(err){
            res.status(500).json(err);
        }else{
            res.status(201).json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
        }
    })
}

module.exports.reviewsAddOne = function (req, res) {
    var hotelId = req.params.hotelId;

    Hotel.findById(hotelId).select('reviews').exec(function (err, hotel) {
        var response = {
            status: 200,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!hotel) {
            console.log("Hotel id not found in database", hotelId);
            response.status = 404;
            response.message = {
                "message": "Hotel ID not found " + hotelId
            };
        }
        if (hotel) {
            _addReview(req,res,hotel);
        } else {
            res
                .status(response.status)
                .json(response.message);
        }
    });
}

module.exports.reviewsUpdateOne = function(req,res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel.findById(hotelId).select('reviews').exec(function (err, hotel) {
        var response = {
            status: 200,
            message: {}
        }
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!hotel) {
            response.status = 404;
            response.message = {
                "message": "Hotel with Id: " + hotelId + " is not found"
            };
        } else {
            thisReview = hotel.reviews.id(reviewId);
            if (!thisReview) {
                response.status = 404;
                response.message = {
                    "message": "reviewId: " + reviewId + " is not found"
                };
            }
        }
        if(response.status!==200){
            res.status(response.status).json(response.message);
        }else{
            thisReview.name = req.body.name;
            thisReview.rating = parseInt(req.body.rating);
            thisReview.review = req.body.review;
            hotel.save(function(err,hotelUpdated){
                console.log(hotelUpdated);
                if(err){
                    res
                    .status(500)
                    .json(err);
                }else{
                    res.status(204).json();
                }
            })
        }
    });
};

module.exports.reviewsDeleteOne = function(req,res){

    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel.findById(hotelId).select('reviews').exec(function(err,hotel){
        var response = {
            status: 200,
            message: {}
        }
        if (err) {
            response.status = 500;
            response.message = err;
        } else if (!hotel) {
            response.status = 404;
            response.message = {
                "message": "Hotel with Id: " + hotelId + " is not found"
            };
        } else {
            thisReview = hotel.reviews.id(reviewId);
            if (!thisReview) {
                response.status = 404;
                response.message = {
                    "message": "reviewId: " + reviewId + " is not found"
                };
            }
        }
        if(response.status!==200){
            res.status(response.status).json(response.message);
        }else{
            hotel.reviews.id(reviewId).remove();
            hotel.save(function(err,hotelUpdated){
                console.log(hotelUpdated);
                if(err){
                    res
                    .status(500)
                    .json(err);
                }else{
                    res.status(204).json();
                }
            })
        }
    });
    
}