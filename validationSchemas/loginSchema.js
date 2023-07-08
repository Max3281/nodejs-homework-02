const Joi = require("joi");

const loginSchemaValid = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = loginSchemaValid;
