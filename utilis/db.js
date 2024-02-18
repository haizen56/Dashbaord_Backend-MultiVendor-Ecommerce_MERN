const mongoose = require('mongoose');

module.exports.dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        console.log("database is Connected SuccessFully.....")
    }
    catch(err) {
        console.error(err)
    }
}