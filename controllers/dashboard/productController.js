

const productModel = require('../../models/productModel');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // configure multer
const { responseReturn } = require('../../utilis/response');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

class productController {

    add_product = async (req, res) => {
        upload.array('images')(req, res, async (err) => {
            if (err) {
                // handle multer-specific errors
                return responseReturn(res, 500, { error: err.message });
            }

            const { id } = req;
            const { name, category, description, stock, price, discount, shopName, brand } = req.body;
            const images = req.files;

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                let allImageUrl = [];

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].path, { folder: 'products' });
                    allImageUrl.push(result.url);
                    fs.unlinkSync(images[i].path); // delete file after upload
                }

                await productModel.create({
                    sellerId: id,
                    name: name.trim(),
                    slug: name.trim().split(' ').join('-'),
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim()
                });

                responseReturn(res, 201, { message: "Product added successfully" });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    }




    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query
        const { id } = req;

        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()
                responseReturn(res, 200, { totalProduct, products })
            } else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({ sellerId: id }).countDocuments()
                responseReturn(res, 200, { totalProduct, products })
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product })
        } catch (error) {
            console.log(error.message)
        }
    }

}





product_update = async (req, res) => {
    let { name, description, discount, price, brand, productId, stock } = req.body;
    name = name.trim()
    const slug = name.split(' ').join('-')
    try {
        await productModel.findByIdAndUpdate(productId, {
            name, description, discount, price, brand, productId, stock, slug
        })
        const product = await productModel.findById(productId)
        responseReturn(res, 200, { product, message: 'product update success' })
    } catch (error) {
        responseReturn(res, 500, { error: error.message })
    }
}
product_image_update = async (req, res) => {
    const form = formidable({ multiples: true })

    form.parse(req, async (err, field, files) => {
        const { productId, oldImage } = field;
        const { newImage } = files

        if (err) {
            responseReturn(res, 404, { error: err.message })
        } else {
            try {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })
                const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' })

                if (result) {
                    let { images } = await productModel.findById(productId)
                    const index = images.findIndex(img => img === oldImage)
                    images[index] = result.url;

                    await productModel.findByIdAndUpdate(productId, {
                        images
                    })

                    const product = await productModel.findById(productId)
                    responseReturn(res, 200, { product, message: 'product image update success' })
                } else {
                    responseReturn(res, 404, { error: 'image upload failed' })
                }
            } catch (error) {
                responseReturn(res, 404, { error: error.message })
            }
        }
    })
}



module.exports = new productController();
