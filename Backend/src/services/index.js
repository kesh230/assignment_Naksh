/**
 * Service Layer Index
 * Exports all services for use in controllers
 */

const userService = require('./userService');
const productService = require('./productService');
const cartService = require('./cartService');
const orderService = require('./orderService');

module.exports = {
  userService,
  productService,
  cartService,
  orderService
};
