const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

router.post('/signup', (req, res, next) => {
	User.find({email : req.body.email}).exec()
		.then(user => {
			if(user.length >= 1) {
				return res.status(409).json({
					message: 'USER_ALREADY_SIGNED_UP'
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if(err) return res.status(500).json({ error: err });

					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					});

					user.save()
						.then(result => {
							console.log(result);
							return res.status(201).json({
								message: 'USER_CREATED_SUCCESFULLY'
							});
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({
								error: err
							});
						});		
				})
			}				
	})
});


router.post('/login', (req, res, next) => {
	User.find({ email: req.body.email }).exec()
		.then(user => {
			if(user.length < 1) {
				return res.status(401).json({
					message: 'AUTH_FAILED'
				});
			}

			bcrypt.compare(req.body.password, user[0].password, (err, response) => {
				if(err) {
					return res.status(401).json({
						message: 'AUTH_FAILED'
					});
				}

				if(response) {
					const token = jwt.sign({
						email: user[0].email,
						id: user[0]._id
					}, process.env.JWT_KEY, {
						expiresIn: '1h'
					});

					return res.status(200).json({
						message: 'AUTH_SUCCESFUL',
						token: token
					});
				}

				return res.status(401).json({
					message: 'AUTH_FAILED'
				});
			})

		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({
				error: err
			});
		});
});


router.delete('/:userId', (req, res, next) => {
	User.deleteOne({_id: req.params.userId}).exec()
		.then(result => {
			return res.status(200).json({
				message: 'USER_DELETE_SUCCESFUL'
			});
		})
		.catch(err => {
			return res.status(200).json({
				error: err
			});
		});
});




module.exports = router;