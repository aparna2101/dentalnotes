
const Product = require('../../../../models/product')
const MESSAGES = require('../../../../models/helpers/MessagesHelper');

const mongoose = require('mongoose');
const { getById } = require('../seminar/seminar');
const ObjectId = mongoose.Types.ObjectId;

const {
    uploadFromBuffer,
    deleteFile,
  } = require("../../../../../utils/cloudinary");

const userObj = {

    create: async (req, res) => {
        try {

           console.log("create product",req.body)
            const { title, subDescription, description, measureUnit, unit, price, salePrice,stock } = req.body;
            const data = { title, subDescription, description, measureUnit, unit, price, salePrice, stock}

            if (req.file) {
                //upload the image on cloudinary here 
                // console.log("Your hit the create image",req.file.buffer)
                data.imageUrl = await uploadFromBuffer(req.file.buffer);
              }
            //if user is successfully create we will send the wellcome mail to user

            //send mail logic wil here

            let newInstance = await Product.create(data);

            res.success({
                message:"Product created",
                success: true,
                data: newInstance
            });
        } catch (e) {
            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            console.log("error ",e)
            res.serverError(errors);
            throw new Error(e);
        }
    },


    getAll: async (req, res) => {

        try {
            let {
                page =req.query.page?req.query.page:1,
                pageSize = req.query.pageSize?req.query.pageSize:9999999,
                search =req.query.search?req.query.search:null,
                column = 'createdAt',
                direction = -1,
            } = req.query;
            const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

            const pipeline = [
                {
                    $match: {
                        $or: [
                            { title: { $regex: search || "", $options: "i" } }, // Case-insensitive search by name
                            { subDescription: { $regex: search || "", $options: "i" } },
                            // Case-insensitive search by phone
                        ],
                    },
                },
                { $sort: { [column]: direction } },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
                    },
                },
            ];
            const resp = await Product.aggregate(pipeline);
            const totalCount = (resp.length > 0 && resp[0].metadata.length > 0) ? resp[0].metadata[0].total : 0;
            const data = (resp.length > 0 && resp[0].data) ? resp[0].data : [];
            return res.success({
                data,
                totalCount
            });

        } catch {

            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            res.serverError(errors);
            throw new Error(e);

        }

    },

    getById: async (req, res) => {
        try {
        const existing = await Product.findById(req.params.id)
            if (!existing) {

                return res.status(404).json({
                    message: "Product Not Found",
                    success: false
                });
            }
          

            res.success({
                success: true,
                data: existing,
               
            });
        } catch (e) {
            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            res.serverError(errors);
            throw new Error(e);
        }
    },

    update: async (req, res) => {
        try {


            const { title, subDescription, description, measureUnit, unit, price, salePrice, stock} = req.body;
            const data = { title, subDescription, description, measureUnit, unit, price, salePrice,stock }



            const existing = await Product.findById(req.params.id)

            if (!existing) {

                return res.status(404).json({
                    message: "Product Not Found",
                    success: false
                });
            }

            if (req.file) {
                //upload the image on cloudinary here
            existing.imageUrl?    await deleteFile(existing.imageUrl):null;
                data.imageUrl = await uploadFromBuffer(req.file.buffer);

            }
            console.log("updating the product",data);
            let updatedInstance = await Product.findOneAndUpdate({ _id: req.params.id }, data, { new: true });

            res.success({
                success: true,
                message: "Product Updated",
                data: updatedInstance
            });
        } catch (e) {
            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            res.serverError(errors);
            throw new Error(e);
        }
    },

    remove: async (req, res) => {
        try {
           
            let existing = await Product.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    success: true,
                    message: "Product Not Found"
                })
            }


     //DELETE ASSOCIATED IMAGE FROM CLOUDINARY
    existing.imageUrl? await deleteFile(existing.imageUrl):null
   const deleted=await Product.findByIdAndDelete(req.params.id);
            return res.success({
                success: true,
                message: "Product Deleted",
                data:deleted
            })


        } catch (e) {
            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            res.serverError(errors);
            throw new Error(e);
        }
    }
};
module.exports = userObj;
