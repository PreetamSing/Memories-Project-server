import express from 'express';
import { storeToken } from '../controllers/msgToken.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.post(`/`, auth, storeToken);

export default router;