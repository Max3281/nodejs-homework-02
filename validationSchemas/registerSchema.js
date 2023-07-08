const Joi = require("joi");

const registerSchemaValid = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = registerSchemaValid;
