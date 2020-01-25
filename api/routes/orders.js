const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/check-auth');
const OrdersController = require('../controllers/order')


router.get('/', checkAuth, OrdersController.get_all_orders);

router.post('/', checkAuth, OrdersController.create_new_order);

router.get('/:orderID', checkAuth, OrdersController.get_order_with_id);

router.delete('/:orderID', checkAuth, OrdersController.delete_order);


module.exports = router;
