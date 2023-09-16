const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.',
    }),
    username: Joi.string().alphanum().min(4).max(10).required().messages({
        'string.alphanum': 'Username must contain only letters and numbers.',
        'string.min': 'Username must be at least {#limit} characters long.',
        'string.max': 'Username cannot be longer than {#limit} characters.',
        'any.required': 'Username is required.',
    }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, including at least one digit, one lowercase letter, and one uppercase letter.',
            'any.required': 'Password is required.',
        }),
});

const loginSchema = Joi.object({
    //we dont need any messages because we made it before in signup.
    username: Joi.string().required(),
    password: Joi.string().required()
})

module.exports = {
    userSchema, loginSchema
}