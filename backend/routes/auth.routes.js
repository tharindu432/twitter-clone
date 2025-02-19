import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// @route GET api/auth/signup
router.post('/signup', signup);

// @route GET api/auth/login
router.post('/login', login)

// @route GET api/auth/logout
router.post('/logout', logout)

export default router;
