const express = require('express');
const router = express.Router();
const Joi = require('joi');

const authorize = require('server/middleware/authorize');
const deliveryController = require('server/controller/delivery.controller');
const validateRequest = require('server/middleware/validate-request');

router.get('/chair', authorize(), deliveryController.getChairDelivery);
router.get('/desk', authorize(), deliveryController.getDeskDelivery);
router.get('/accessory', authorize(), deliveryController.getAccessoryDelivery);
router.post(
  '/generatePDF',
  authorize(),
  signSchema,
  deliveryController.generateDeliveryPDF
);
router.post('/sign', authorize(), signSchema, deliveryController.signDelivery);

function generateSchema(req, res, next) {
  const schema = Joi.object({
    productType: Joi.string().valid('chair', 'desk', 'accessory'),
    deliveryId: Joi.string().uuid().allow(null),
  });
  validateRequest(req, next, schema);
}

function signSchema(req, res, next) {
  const schema = Joi.object({
    productType: Joi.string().valid('chair', 'desk', 'accessory'),
    deliveryId: Joi.string().uuid().allow(null),
    signature: Joi.string().allow(''),
  });
  validateRequest(req, next, schema);
}

module.exports = router;
