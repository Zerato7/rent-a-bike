import type {
	IssueDetail,
	ReportIssueDto,
	ResolveIssueDto,
} from "../models/issue";
import { request } from "./client";

const prefixPath = "/issues";

export async function reportIssue(payload: ReportIssueDto) {
	const formData = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return request<IssueDetail>(`${prefixPath}`, {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

export async function resolveIssue(payload: ResolveIssueDto) {
	return request<IssueDetail>(`${prefixPath}/${payload.id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function getUnresolvedIssues() {
	return request<IssueDetail[]>(`${prefixPath}/unresolved`);
}

export async function getResolvedIssues() {
	return request<IssueDetail[]>(`${prefixPath}/resolved`);
}
