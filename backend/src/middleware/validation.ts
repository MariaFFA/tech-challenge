import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({ 
        error: 'Validation error',
        message: errorMessage,
        details: error.details 
      });
      return;
    }
    
    next();
  };
};

// User validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_-]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Post validation schemas
export const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).max(50000).required(),
  excerpt: Joi.string().max(500).optional(),
  imageUrl: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  content: Joi.string().min(1).max(50000).optional(),
  excerpt: Joi.string().max(500).optional(),
  imageUrl: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
});

// Comment validation schemas
export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  postId: Joi.number().integer().positive().required(),
  parentId: Joi.number().integer().positive().optional(),
});

// Profile update schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(100).allow('').optional(),
  lastName: Joi.string().max(100).allow('').optional(),
  avatar: Joi.string().uri().allow('').optional(), 
});