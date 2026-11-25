/**
 * Validate req.body against a Joi schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { value, error: joiError } = schema.validate(req.body, { abortEarly: false });
    if (joiError) {
      const details = joiError.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        statusCode: 400,
        errors: details
      });
    }
    req.body = value;
    next();
  };
};

module.exports = validate;
