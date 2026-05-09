import express from "express";
import { validate } from "../middleware/validate.js";
import { reportRule, resolveIssueRequest } from "../utils/validators/issue-validators.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { getUnresolvedIssues, getResolvedIssues, IssueIdParams, reportIssue, resolveIssue } from "../controllers/issue-controller.js";
import { uploadIssuePhoto, wrapUpload } from "../middleware/uploads.js";

const router = express.Router();

router.post("/", wrapUpload(uploadIssuePhoto), validate(reportRule), asyncHandler(reportIssue));
router.put<IssueIdParams>("/:id", validate(resolveIssueRequest), asyncHandler(resolveIssue));
router.get("/unresolved", asyncHandler(getUnresolvedIssues));
router.get("/resolved", asyncHandler(getResolvedIssues));

export default router;
