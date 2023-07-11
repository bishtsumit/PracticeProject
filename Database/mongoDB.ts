import mongoose from 'mongoose';
import morgan from 'morgan';

const mongoConnect = async function () {
    return new Promise(async (resolve, reject) => {
        const mongoDBurl: string = process.env.mongoDBurl ?? "";
        console.log("mongoDB", mongoDBurl);
        if (mongoDBurl) {
            try {

                await mongoose.connect(mongoDBurl);
                resolve("Database Connected Sucessfully");
                console.log("Database Connected Sucessfully");
            } catch (error) {
                reject(error);
                console.error("Error : ", error);
            }
        }
        else {
            return reject("Mongo DB connection string not defined");
        }
    });
};

export default { mongoConnect }