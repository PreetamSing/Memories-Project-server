import express from 'express';
import { getPosts, createPost, updatePost, deletePost, likePost } from "../controllers/posts.js";

import auth from '../middleware/auth.js';

const router = express.Router();


// localhost:5000/   This won't reach 'cause we added a prefix of '/posts' in index.js
// localhost:5000/posts/   This will reach
router.get('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;