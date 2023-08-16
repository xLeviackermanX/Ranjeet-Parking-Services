const aws = require('aws-sdk'); 
const Data = require('../models/Data');

const upload = async (req, res, next) => {
    try {
        const file = req.files.file
        const month = req.body.month
        const year = req.body.year
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods",
  "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        var blob = req.files.file.data;
        var dataExists = await Data.findOne({ month: month, year:year }).exec();
        if (!dataExists) {
            dataExists = await Data.create({
                month: month,
                year: year,
                bills: []
            })
        }
        var fileName = month+year+dataExists.bills.length+file.name
        dataExists.bills.push(fileName)
        await dataExists.save()
        aws.config.update({
            secretAccessKey: process.env.S3_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY
        })
        const s3 = new aws.S3();
        var params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: blob
        }
        s3.upload(params, function(err, data){
            console.log("error is ", err)
            console.log("data is ", data)
        })
        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(error);
    }
  };

  const fetchBills = async (req, res, next) => {
    try {
        const month = req.body.month
        const year = req.body.year
        const data = await Data.findOne({month: month, year: year}).exec()
        return res.status(200).json({
            success: true,
            bills: data && data.bills ? data.bills : []
        })
    } catch(err) {
        return next(err)
    }
}

  const download = async (req, res, next) => {
    try {
        const key = req.body.key
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods",
  "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        const type = req.body.key.split(".").slice(-1)
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key
        };
        aws.config.update({
            secretAccessKey: process.env.S3_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY
        })
        const s3 = new aws.S3();
        s3.getObject(params, (err, data) => {
          if (err) {
            console.log(err);
            return next(err)
          } else {
            return res.status(200).json({
                success: true,
                file: data.Body.toString('base64'),
                type: type
            })
          }
        });
        
    } catch(err) {
        return next(err)
    }
  }

  module.exports = { upload, fetchBills, download };
