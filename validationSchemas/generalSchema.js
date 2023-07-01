const Joi = require("joi");

const generalSchemaValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

module.exports = generalSchemaValidation;
