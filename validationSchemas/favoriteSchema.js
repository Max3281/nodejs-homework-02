const Joi = require("joi");

const favoriteSchemaValid = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = favoriteSchemaValid;
