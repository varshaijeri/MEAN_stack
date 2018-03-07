var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    if (isNaN(lng) || isNaN(lat)) {
        res.status(400).json({
            "message": "If supplied in querystring lng and lat should be a number"
        });
        return;
    }
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    }
    var geoOption = {
        spherical: true,
        maxDistance: 2000,
        num: 5
    }
    Hotel.geoNear(point, geoOption, function (err, results, stats) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(results);
        }
    });
}

module.exports.hotelsGetAll = function (req, res) {

    console.log('Requested by: '+req.user);

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        res.status(400).json({
            "message": "If supplied in querystring count and offset should be a number"
        })
        return;
    }

    if (count > maxCount) {
        res.status(400).json({
            "message": "count limit of " + maxCount + " exceed"
        });
        return;
    }

    Hotel.find().skip(offset).limit(count).exec(function (err, hotels) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(hotels);
        }
    });
}

module.exports.hotelsGetOne = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET the hotelId", hotelId);

    Hotel.findById(hotelId).exec(function (err, doc) {
        var response = {
            status: 200,
            message: doc
        }
        if (err) {
            response.status = 500;
            response.message = err
        } else if (!doc) {
            response.status = 404
            response.message = {
                "message": "Hotel Id not found"
            };
        }
        res
            .status(response.status)
            .json(response.message);
    });

}

var _splitArray = function (input) {
    var output;
    if (input && input.length > 0) {
        var output = input.split(";");
    } else {
        output = [];
    }
    return output;
}

module.exports.hotelsAddOne = function (req, res) {
    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            }
        }, function (err, hotel) {
            if (err) {
                console.log("Error creating hotel");
                res.status(400).json(err);
            } else {
                res.status(201).json(hotel);
            }
        });
}

module.exports.hotelsUpdateOne = function (req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET the hotelId", hotelId);

    Hotel.findById(hotelId).select("-reviews -rooms").exec(function (err, doc) {
        var response = {
            status: 200,
            message: doc
        }
        if (err) {
            response.status = 500;
            response.message = err
        } else if (!doc) {
            response.status = 404
            response.message = {
                "message": "Hotel Id not found"
            };
        }
        if (response.status !== 200) {
            res
                .status(response.status)
                .json(response.message);
        } else {
            doc.name = req.body.name;
            doc.description = req.body.description;
            doc.stars = parseInt(req.body.stars);
            doc.services = _splitArray(req.body.services);
            doc.photos = _splitArray(req.body.photos);
            doc.currency = req.body.currency;
            doc.location = {
                address: req.body.address,
                coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            };
            doc.save(function(err,hotelUpdated){
                if(err){
                    res.status(500).json(err);
                }else{
                    res.status(204).json();
                }
            })
        }
    });
};

module.exports.hotelsDeleteOne = function(req,res){
    var hotelId = req.params.hotelId;
    console.log("GET the hotelId", hotelId);

    Hotel.findByIdAndRemove(hotelId).exec(function(err,hotel){
        if(err){
            res.status(404).json(err);
        }else{
            console.log("Hotel deleted Id: "+hotelId);
            res.status(204).json();
        }
    });
}