import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { generateCode } from '../controllers/generateController.js';

const router = Router();


const generateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 15 minute-e max 5 bar API call kora jabe
    message: {
        error: "Too Many Requests",
        message: "Generation limit exceeded. Please try again after some time."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// route-e apiLimiter middleware ta boshiye deya holo
router.post('/generate', generateLimiter, generateCode);

export default router;