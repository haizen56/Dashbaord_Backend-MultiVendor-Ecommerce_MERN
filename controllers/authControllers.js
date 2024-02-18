const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/SellerCustomerModel');

const { responseReturn } = require('../utilis/response');
const { createToken } = require('../utilis/tokenCreate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class authControllers {
    admin_login = async (req, res) => {
        //  console.log('admin login')
        //console.log(req.body)
        const { email, password } = req.body
        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            //console.log(admin)
            if (admin) {
                
                const match = await bcrypt.compare(password, admin.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    // console.log(token)
                    // console.log(res.cookie('accessToken', token,{
                    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    // }))


                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: 'Login successful' })


                } else {
                    responseReturn(res, 404, { error: "Password is not matched Try Again" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });

            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }





    admin_login = async (req, res) => {
        //  console.log('admin login')
        //console.log(req.body)
        const { email, password } = req.body
        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            //console.log(admin)
            if (admin) {
                const match = await bcrypt.compare(password, admin.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    // console.log(token)
                    // console.log(res.cookie('accessToken', token,{
                    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    // }))


                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: 'Login successful' })


                } else {
                    responseReturn(res, 404, { error: "Password is not matched Try Again" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });

            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }




    seller_login = async (req, res) => {

        const { email, password } = req.body
        try {
            const seller = await sellerModel.findOne({ email }).select('+password')

            if (seller) {
                const match = await bcrypt.compare(password, seller.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })
                    // console.log(token)
                    // console.log(res.cookie('accessToken', token,{
                    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    // }))


                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: 'Seller Login successful' })


                } else {
                    responseReturn(res, 404, { error: "Password is not matched Try Again" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" });

            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }



    seller_register = async (req, res) => {
        //console.log(req.body)

        const { email, name, password } = req.body;

        try {

            const getUser = await sellerModel.findOne({ email })
            // console.log(getUser)
            if (getUser) {
                responseReturn(res, 404, { error: 'Email Already Exists...⚠️' })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}

                })

                await sellerCustomerModel.create({
                    myId: seller.id
                })
                //  console.log(seller)
                const token = await createToken({ id: seller.id, role: seller.role })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })

                responseReturn(res, 201, { token, message: ' Registered successfully..🎉' })

            }
        }
        catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: error.message });
        }


    }


    getUser = async (req, res) => {
        const { id, role } = req;

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)
                responseReturn(res, 200, { userInfo: user })
            }
            else if (role === 'seller') {
                const seller = await sellerModel.findById(id)
                responseReturn(res, 200, { userInfo: seller })

            }
           // console.log('userinfo', userInfo)

        } catch (error) {
            console.log(error.message)
            responseReturn(res, 500, { error: error.message });

        }


    }


    // getUser = async (req, res) => {
    //     const { id, role } = req;
    //     console.log(`Fetching user data for ID: ${id}, Role: ${role}`);
    
    //     try {
    //         let user;
    //         if (role === 'admin') {
    //             user = await adminModel.findById(id);
    //         } else if (role === 'seller') {
    //             user = await sellerModel.findById(id);
    //         }
    //         console.log(`User info: ${JSON.stringify(user)}`);
    //         responseReturn(res, 200, { userInfo: user });
    //     } catch (error) {
    //         console.log(`Error fetching user: ${error.message}`);
    //         responseReturn(res, 500, { error: error.message });
    //     }
    // }
    

}

module.exports = new authControllers();



