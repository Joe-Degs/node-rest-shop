const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


exports.get_all_orders = (req, res, next) => {
	Order.find().select('_id quantity product')
		.populate('product', 'name').exec()
		.then(result => {
			console.log(result);
			res.status(200).json({
				count: result.length,
				orders: result.map(item => {
					return {
						product: item.product,
						quantity: item.quantity,
						_id: item._id,
						request: {
							type: 'GET',
							description: 'GET_INDIVIDUAL_ORDER',
							url: 'http://localhost:8080/api/v1/orders/' + item._id
						}
					}
				})
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({ error: err });
		});
}


exports.create_new_order = (req, res, next) => {
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
}


exports.get_order_with_id = (req, res, next) => {
	const id = req.params.orderID;

	Order.findById(id).select('_id quantity product')
		.populate('product', 'name price').exec()
		.then(result => {
			if(result) {
				return res.status(200).json({
					order: result,
					request: {
						type: 'GET',
							description: 'GET_ALL_ORDERS',
						url: 'http://localhost:8080/api/v1/orders'
					}
				});
			} else {
				return res.status(404).json({ message: 'Order not found' });
			}
		})
		.catch(err => {
			return res.status(500).json({ error: err });
		});
}


exports.delete_order = (req, res, next) => {
	const id = req.params.orderID;

	Order.deleteOne({ _id: id }).exec()
		.then(result => {
			return res.status(200).json({
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
			return res.status(500).json({ error: err });
		});
}
