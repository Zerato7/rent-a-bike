import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";
import { configZod } from "./src/config/zod.js";

const PORT = parseInt(process.env.PORT || "5000", 10);

connectDB();
configZod();
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
