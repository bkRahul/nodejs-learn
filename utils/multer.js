const multer = require("multer");

//storage options
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
        cb(null, false);
    }
  }

//store single file
const uploadSingle = multer({ storage: fileStorage, fileFilter: fileFilter }).single("image");
//store multiple files
const uploadMultiple = multer({ storage: fileStorage }).array("myFiles", 12);

module.exports = {
  uploadSingle: uploadSingle,
  uploadMultiple: uploadMultiple,
};
