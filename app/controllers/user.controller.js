const multer = require('multer');
const csv = require('fast-csv');
const mongodb = require('mongodb');
const fs = require('fs');
const uploadFile = require("../middlewares/upload");


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};




global.__basedir = __dirname;

// Upload CSV file using Express Rest APIs
exports.upload =  async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }


		
        // Import CSV File to MongoDB database
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", () => {

                // Establish connection to the database
                var url = "mongodb://localhost:27017/TestDb";
                var dbConn;
                mongodb.MongoClient.connect(url, {
                    useUnifiedTopology: true,
                }).then((client) => {
                    console.log('DB Connected!');
                    dbConn = client.db();

                    //inserting into the table "finance"
                    var collectionName = 'finance';
                    var collection = dbConn.collection(collectionName);
					collection.deleteMany();
                    collection.insertMany(csvData, (err, result) => {
                        if (err) console.log(err);
                        if (result) {
                            res.status(200).send({
                                message: "Upload/import the CSV data into database successfully: " + req.file.originalname,
                            });
                            client.close();
                        }
                    });
                }).catch(err => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: err.message,
                    });
                });
            });
    } catch (error) {
        console.log("catch error-", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

// Fetch all finance
exports.finance = (req, res)=> {
    // Establish connection to the database
    var url = "mongodb://localhost:27017/TestDb";
    var dbConn;
    mongodb.MongoClient.connect(url, {
        useUnifiedTopology: true,
    }).then((client) => {
        dbConn = client.db();

        var collectionName = 'finance';
        var collection = dbConn.collection(collectionName);
		
        collection.find().toArray(function(err, result) {
            if (err) throw err;
            res.status(200).send({ finance: result });
            client.close();
        });
    }).catch(err => {
        res.status(500).send({
            message: "Fail to fetch data from database!",
            error: err.message,
        });
    });
}
