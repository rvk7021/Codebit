const Post = require("../models/CommunityFeatures");
const { uploadFile } = require("../config/cloudinary");
const cloudinary = require('cloudinary').v2;

exports.addPost = async (req, res) => {
    try {
        const { content, tags, user } = req.body;

        // Validate if user is provided
        if (!user) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const media = [];
        
        // Handle file uploads
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto' // Automatically detect image or video
                });

                media.push({
                    type: result.resource_type === 'video' ? 'video' : 'image',
                    url: result.secure_url,
                    ...(result.resource_type === 'video' && {
                        thumbnail: cloudinary.url(result.public_id, { format: 'jpg' }),
                        duration: result.duration
                    })
                });
            }
        }

        // Ensure content is provided if no file is uploaded
        if (!content && media.length === 0) {
            return res.status(400).json({ message: "Post content is required" });
        }

        // Create the post object
        const newPost = {
            user,
            content,
            media,
            tags: tags ? tags.split(',') : []
        };

        // Create the post in the database
        const post = await Post.create(newPost);

        // Return success response
        return res.status(201).json({
            success: true,
            data: post,
            message: "Post created successfully"
        });
        
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: error.message });
    }
};
