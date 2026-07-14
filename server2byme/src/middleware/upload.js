const multer = require("multer");
const DIR_PATH_IMAGES = "./assets/image";
const DIR_PATH_FILES = "./assets/files";
const DIR_PATH_JEWELLERY = "./assets/Jewellery"
const DIR_PATH_PRODUCT = "./assets/product"
const DIR_PATH_CATEGORY = "./assets/category"
const DIR_PATH_DELIVERY = "./assets/delivery"
const DIR_PATH_TAG= "./assets/tag"



const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else if (file.originalname.match(/\.(pdf|doc|png|jpg|jpeg|xlsx|csv)$/)) {
        cb(null, true);
    } else {
        cb("Please upload only images and PDF.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.body.key == "image") {
            cb(null, DIR_PATH_IMAGES);
        }
        else if (req.body.key == "jewellery") {
            cb(null, DIR_PATH_JEWELLERY);
        }
        else if (req.body.key == "category") {
            cb(null, DIR_PATH_CATEGORY);
        }
        else if (req.body.key == "product") {
            cb(null, DIR_PATH_PRODUCT);
        }
        else if (req.body.key == "tag") {
            cb(null, DIR_PATH_TAG);
        }
        else if (req.body.key == "delivery") {
            cb(null, DIR_PATH_DELIVERY);
        }
        else {
            cb(null, DIR_PATH_FILES);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
        console.log("filename", `${Date.now()}-bezkoder-${file.originalname}`);
    },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
//var uploadFiles = multer({ storage: storage }).array('multi-files', 10);

module.exports = uploadFile;