import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_CONECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
export default db;
