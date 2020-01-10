const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');


router.get('/', (req, res, next) => {
	Product.find().exec()
		.then(result => {
			console.log(result);
			res.status(200).json({ result });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});


router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Your product has been created',
				createdProduct: result
			});
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({ error: err });
		});
});

router.get('/:productID', (req, res, next) => {
	const id = req.params.productID;
	Product.findById(id).exec()
		.then(result => {
			console.log(result);
			if(result) {
				res.status(200).json({ result });
			} else {
				res.status(404).json({ error: 'No valid response for Input' });
			}
		}).catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.patch('/:productID', (req, res, next) => {
	const id = req.params.productID;
	const updateOpts = {};
	for (const opts of req.body) {
		updateOpts[opts.propName] = opts.value;
	}
	Product.update({ _id: id }, {
		$set: { updateOpts }
	}).exec()
		.then(result => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(200).json({ error: err });
		});
});

router.delete('/:productID', (req, res, next) => {
	const id = req.params.productID;
	Product.remove({ _id: id }).exec()
		.then(result => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
})

module.exports = router;