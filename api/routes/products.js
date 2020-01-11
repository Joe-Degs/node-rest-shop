const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');


router.get('/', (req, res, next) => {
	Product.find().select('name price _id').exec()
		.then(result => {
			const response = {
				count: result.length,
				products: result.map(el => {
					return {
						name: el.name,
						price: el.price,
						_id: el._id,
						request: {
							type: 'GET',
							description: 'GET_PRODUCT_DETAILS',
							url: 'http://localhost:8080/api/v1/products/' + el._id
						}
					}
				})
			};
			//console.log(response);
			res.status(200).json(response);
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
			//console.log(result);
			res.status(201).json({
				message: 'Your product has been created',
				newProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						description: 'GET_UPDATED_PRODUCT',
						url: 'http://localhost:8080/api/v1/products/' + result._id
					}
				}
			});
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({ error: err });
		});
});


router.get('/:productID', (req, res, next) => {
	const id = req.params.productID;

	Product.findById(id).select('name price _id').exec()
		.then(result => {
			//console.log(result);
			if (result) {
				res.status(200).json({
					product: result,
					request: {
						type: 'GET',
						description: 'GET_ALL_PRODUCTS',
						url: 'http://localhost:8080/api/v1/products'
					}
				});
			} else {
				res.status(404).json({ error: 'No valid response for Input' });
			}
		}).catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});


//takes an array of containing an object eg.{propName: '', value: ''}
router.patch('/:productID', (req, res, next) => {
	const id = req.params.productID;
	const prodUpdateObj = req.body.reduce((acc, el) => {
		acc[el.propName] = el.value;
		return acc;
	}, {});

	//TODO:: use a reduce function on the array.
	// for (const el of req.body) {
	// 	updateOpts[el.propName] = el.value;
	// }

	Product.updateOne({ _id: id }, {$set: prodUpdateObj}).exec()
		.then(result => {
			//console.log(result);
			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					description: 'GET_UPDATED_PRODUCTS_DETAILS',
					url: 'http://localhost:8080/api/v1/products/' + id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(200).json({ error: err });
		});
});


router.delete('/:productID', (req, res, next) => {
	const id = req.params.productID;
	Product.deleteOne({ _id: id }).exec()
		.then(result => {
			//console.log(result);
			res.status(200).json({
				message: 'Product with _id:' + id + ' deleted',
				request: {
					type: 'POST',
					description: 'ADD_NEW_PRODUCT',
					url: 'http://localhost:8080/api/v1/products',
					body: {
						name: 'String',
						price: 'Number'
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
})



module.exports = router;