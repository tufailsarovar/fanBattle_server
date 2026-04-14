import app from "../app.js";
import { connectDB } from "../config/db.js";

console.log("MONGO_URI:", process.env.MONGO_URI);

await connectDB();

export default app;