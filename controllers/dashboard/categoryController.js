
const categoryModel = require('../../models/categoryModel');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // configure multer
const { responseReturn } = require('../../utilis/response');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { response } = require('express');

class categoryController {

    add_category = async (req, res) => {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                responseReturn(res, 400, { error: 'Error processing file upload.' });
                return;
            }

            let { name } = req.body;
            let image = req.file;
            name = name.trim();
            const slug = name.split(' ').join('-');

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                if (!image) {
                    responseReturn(res, 400, { error: 'Image file is required.' });
                    return;
                }

                const result = await cloudinary.uploader.upload(image.path, { folder: 'categorys' });

                // Delete the file after uploading to Cloudinary
                fs.unlinkSync(image.path);

                const category = await categoryModel.create({
                    name,
                    slug,
                    image: result.url
                });
                responseReturn(res, 201, { category, message: 'Category added successfully.' });
            } catch (error) {
                console.error('Error in category creation:', error);
                responseReturn(res, 500, { error: 'Internal server error.' });
            }
        });
    }

 
    get_category = async (req, res) => {
        const { page, searchValue, parPage } = req.query
       // console.log(req.query)
        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const categorys = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
            else if (searchValue === '' && page && parPage) {
                const categorys = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
            else {
                const categorys = await categoryModel.find({}).sort({ createdAt: -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { totalCategory, categorys })
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = new categoryController();






