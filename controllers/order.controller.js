const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const {Order} = require("../models/order.model");
const {OrderItem} = require("../models/orderItem.model");
const {Product} = require("../models/product.model");

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user orderItems', '-passwordHash')
            .sort({'dateOrdered': -1});

        if (!orders) {
            res.status(404).send({
                status: false, message: 'Orders not Found',
            });
        }
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

exports.addOrder = async (req, res, next) => {
    try {
        const body = req.body;

        const orderItemIds = Promise.all(body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity, product: orderItem.product,
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem.id;
        }));

        const orderItemIdsResolved = await orderItemIds;

        const orderItemsFromDb = (await OrderItem.find({_id: orderItemIdsResolved,})
            .populate('product', 'price'));

        const totalPrice = orderItemsFromDb.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        let order = new Order({
            orderItems: orderItemIdsResolved,
            shippingAddress1: body.shippingAddress1,
            shippingAddress2: body.shippingAddress2,
            city: body.city,
            zip: body.zip,
            country: body.country,
            phone: body.phone,
            status: body.status,
            totalPrice,
            user: body.user,
        });

        order = await order.save();
        if (!order) {
            res.status(404).send('Failed to create order');
        }
        res.status(201).json(order);
    } catch (error) {
        console.log(error)
        next(error);
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Order Id');
        }
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            return res.status(200).json({
                success: true, message: "The order has been deleted successfully"
            });
        }
        return res.status(404).json({
            success: false, message: "Fail to delete order"
        });
    } catch (error) {
        return res.status(400).json({success: false, error});
    }
}

exports.getOrder = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Order Id');
        }
        const order = await Order.findById(req.params.id)
            .populate('user', '-passwordHash')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category',
                }
            });
        if (order) {
            return res.status(200).json(order);
        }
        return res.status(404).json({
            message: "Order not found"
        });
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const body = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, {
            status: body.status,
        }, {new: true},);

        if (!order) {
            return res.status(404).send('Invalid Order Id');
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.getTotalSales = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([{$group: {_id: null, totalSales: {$sum: '$totalPrice'}}}]);
        return res.status(200).json({totalSales: totalSales?.pop()?.totalSales || 0});
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.getOrderCount = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments({}).exec();
        if (!orderCount) {
            return res.status(500).json({
                success: false
            });
        }
        return res.status(200).json({orderCount});
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.params.id,
        })
            .populate('user orderItems', '-passwordHash')
            .sort({'dateOrdered': -1});

        if (!orders) {
            res.status(404).send({
                status: false, message: 'Orders not Found',
            });
        }
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

exports.createCheckoutSession = async (req, res, next) => {
    try {
        const orderItems = req.body;

        if (orderItems === null || orderItems.length === 0) {
            return res.status(400).send('Checkout session cannot be created');
        }

        const productIds = orderItems.map(order => order.product);

        const products = await Product.find({
            '_id': {$in: productIds}
        });

        const lineItems = [];

        (products || []).forEach(product => {
            lineItems.push({
                price_data: {
                    currency: 'usd', product_data: {
                        name: product.name,
                    }, unit_amount: +product.price * 100,
                }, quantity: orderItems.find(item => item.product === product.id)?.quantity
            });
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: process.env.STRIPE_PAYMENT_SUCCESS_URL,
            cancel_url: process.env.STRIPE_PAYMENT_FAIL_URL,
        });

        res.status(200).json({id: session.id});
    } catch (error) {
        next(error);
    }
}
