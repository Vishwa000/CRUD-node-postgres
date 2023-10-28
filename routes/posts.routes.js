import { Router } from 'express';
import { Post } from '../database/models';

const router = Router();

// Create blog post
router.post('/', async (req, res) => {
    try {
        const { title, body } = req.body;

        const post = await Post.create({
            title,
            body
        });
        return res.status(201).json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const data = await Post.findAll();
        const totalRecords = data.length;

        if (totalRecords > 0) {
            return res.status(200).json({ 
                status: '200',
                message: 'success',
                data: {  
                    totalRecords ,
                    data
                }
            });
        } else {
            return res.status(404).json({ 
                status: '404',
                message: 'Not Found',
                data: null
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: '500',
            message: error.message,
            data: null
        });
    }
});


// Get post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id }
        });

        if (!post) {
            return res.status(404).json({ message: 'the post with the given id was not found' });
        }

        return res.status(200).json({ post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update blog post
router.patch('/:id', async (req, res) => {
    try {
        const { title, body } = req.body;
        const posts = await Post.update(
            { title, body },
            {
                returning: true,
                where: { id: req.params.id }
            }
        );

        if (posts[0] === 0)
            return res.status(404).json({ message: 'The post with the given id was not found' });

        const post = posts[1][0].dataValues;

        return res.status(200).json({ post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.destroy({ where: { id: req.params.id } });
        if (!post)
            return res.status(404).json({ message: 'The post with the given id was not found' });
    
        return res.status(200).json({ message: 'The post was deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
