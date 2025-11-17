const {Router} = require("express");
const upload = require("../utils/multerHandlers.js");
const { MAX } = require("uuid");

const fileUploadRouter = Router();

fileUploadRouter.post("/upload", upload.array("file", 1), (req, res) => {

    try {
        const fileUploads = req.files;
        let files;
        // console.log(fileUploads);
        if(fileUploads.length > 0){
           files = fileUploads.map(file =>
            `http://localhost:4000/api/v1/uploads/${file.filename}`
            )
    
            res.status(200).json({ fileUrl:files });
        } else if (fileUploads.length === 1){
            const fileUrl = `http://localhost:4000/api/v1/uploads/${req.file.filename}`;
            res.status(200).json({ fileUrl });
        }

    } catch (error) {
        console.error("File upload failed: ", error);
        res.status(400).json({
            status: "error",
            message: "File upload failed",
            error: error
        })
    }

});

module.exports = fileUploadRouter;
