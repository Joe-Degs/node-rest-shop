const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swagger = require('swagger-ui-express');
const mongoose = require('mongoose');

const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const swaggerJson = require('./swagger.json');


(async () => { 
	await mongoose.connect(
	   `mongodb+srv://norkplim:${process.env.MONGO_PASSWRD}@node-rest-shop-gxguh.mongodb.net/test?retryWrites=true&w=majority`,
	   {
	   	useNewUrlParser: true,
	   	useUnifiedTopology: true  
	 	}
	);
	console.log('mongodb+srv://norkplim:'
	   + process.env.MONGO_PASSWRD + 
	   '@node-rest-shop-gxguh.mongodb.net/test?retryWrites=true&w=majority');
})().then(res => console.log(res)).catch(err => console.log(err));

//App midlewares
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use((req, res, next) => {
	res.header('Acess-Control-Allow-Origin', '*');
	res.header(
	   'Acess-Control-Allow-Headers',
	   'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if(req.method === 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
			return res.status(200).json({});
	}
	next();
})

app.use('/api/v1/docs', swagger.serve, swagger.setup(swaggerJson));

// Route Middlewares

app.use('/api/v1/products', productRouter)
	.use('/api/v1/orders', orderRouter);

// Error Handling Middlewares

app.use((req, res, next) => {
	const error = new Error('Route not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});



module.exports = app;