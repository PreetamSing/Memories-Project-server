import express from 'express';
import { JS, RWD, RESUME } from "../controllers/portfolio/index.js";

const router = express.Router();

router.get('/img/rwd', RWD);
router.get('/img/js', JS);
router.get('/pdf/My_Resume', RESUME);

export default router;