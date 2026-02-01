import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema, getPostsSchema } from '../validators/post.validator';

const router = Router();
const postController = new PostController();

router.get('/', validate(getPostsSchema), postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticate, validate(createPostSchema), postController.createPost);
router.patch('/:id', authenticate, validate(updatePostSchema), postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;
