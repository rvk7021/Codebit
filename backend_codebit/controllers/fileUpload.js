const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const upload = multer();
const axios = require('axios');
exports.fileUpload=async(req,res)=>{
    try {
       if(!req.file)
       {
           return res.status(400).json({ error: 'No file uploaded' });
       }
       cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, 
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Upload failed', details: error });
          }
          // if(req.file.type=='pdf'){
          
            
          //   axios.get(result.secure_url, { responseType: 'stream' })
          //   .then((response) => {
          //     res.setHeader('Content-Type', 'application/pdf');
          //     res.setHeader('Content-Disposition', 'inline; filename="my-file.pdf"');
          //      response.data.pipe(res);
          //      return res.status(200).json({
          //       message: 'File uploaded successfully',
          //       // url: result.secure_url,
          //      });
          //   })
          //   .catch((error) => {
          //     res.status(500).send('Error fetching PDF from Cloudinary');
          //   });
          // }
          return res.status(200).json({
            message: 'File uploaded successfully',
            url: result.secure_url, 
          });
        }
      ).end(req.file.buffer); 
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
