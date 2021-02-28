import express from 'express';
import { getPosts, createPost, updatePost, deletePost, likePost } from "../controllers/posts.js";

const router = express.Router();


// localhost:5000/   This won't reach 'cause we added a prefix of '/posts' in index.js
// localhost:5000/posts/   This will reach
router.get('/', getPosts);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);

export default router;