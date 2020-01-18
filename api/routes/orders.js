const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../auth/check-auth');


const Order = require('../models/order');
const Product = require('../models/product');


router.get('/', checkAuth, (req, res, next) => {
	Order.find().select('_id quantity product')
		.populate('product', 'name').exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				count: result.length,
				orders: result.map(el => {
					return { 
						product: el.product,
						quantity: el.quantity,
						_id: el._id,
						request: {
							type: 'GET',
							description: 'GET_INDIVIDUAL_ORDER',
							url: 'http://localhost:8080/api/v1/orders/' + el._id
						}
					}
				})
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

// Handles Incoming post request /orders
router.post('/', checkAuth, (req, res, next) => {
	Product.findById(req.body.productId).exec()
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not Found'
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity
			});

			return order.save();
		})
		.then(result => {
			//console.log(result);
			res.status(201).json({
				message: 'Order Succesful',
				newOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity,
					request: {
						type: 'GET',
						description: 'GET_UPDATED_ORDER',
						url: 'http://localhost:8080/api/v1/orders/' + result._id
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err }); 
		});
});


router.get('/:orderID', checkAuth, (req, res, next) => {
	const id = req.params.orderID;

	Order.findById(id).select('_id quantity product')
		.populate('product', 'name price').exec()
		.then(result => {
			if(result) {
				res.status(200).json({
					order: result,
					request: {
						type: 'GET',
							description: 'GET_ALL_ORDERS',
						url: 'http://localhost:8080/api/v1/orders'
					}
				});
			} else {
				res.status(404).json({ message: 'Order not found' });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
});


router.delete('/:orderID', checkAuth, (req, res, next) => {
	const id = req.params.orderID;

	Order.deleteOne({ _id: id }).exec()
		.then(result => {
			res.status(200).json({
				message: 'Order with _id:' + id + ' deleted',
				request: {
					type: 'POST',
					description: 'ADD_NEW_ORDER',
					url: 'http://localhost:8080/api/v1/products',
					body: {
						productId: 'ObjectId',
						quantity: 'Number'
					}
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
});


console.log(router);
module.exports = router;