const Joi = require('joi');

const imagePayloadSchema = Joi.object({
  base64Data: Joi.string().required().min(100),
  timestamp: Joi.number().integer().positive().required(),
  metadata: Joi.object().optional()
});

const validateImagePayload = (payload) => {
  return imagePayloadSchema.validate(payload);
};

module.exports = {
  validateImagePayload
};