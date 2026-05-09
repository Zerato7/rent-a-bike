import express, { Request, Response } from "express";
import cors from "cors";
import bikeRouter from "./routes/bike-routes.js";
import issueRouter from "./routes/issue-routes.js";
import locationRouter from "./routes/location-routes.js";
import parkingRouter from "./routes/parking-routes.js";
import rentalRouter from "./routes/rental-routes.js";
import userRouter from "./routes/user-router.js";
import { errorHandler } from "./middleware/error-handler.js";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/bikes", bikeRouter);
app.use("/issues", issueRouter);
app.use("/locations", locationRouter);
app.use("/parking", parkingRouter);
app.use("/rentals", rentalRouter);
app.use("/users", userRouter);

app.get("/health", (req: Request, res: Response) => {
	res.json({ status: "ok" });
});

app.use(express.static(path.join(import.meta.dirname, "../../public")));

app.use(errorHandler);

export default app;
