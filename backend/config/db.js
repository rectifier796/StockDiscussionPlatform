import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected To MongoDB ${connection.connection.host}`);
    }
    catch(err){
        console.log(`Error while MongoDB connection : ${err}`);
    }
}