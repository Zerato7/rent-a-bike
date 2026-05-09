import {
	useMutation,
	useQuery,
	useQueryClient,
	UseMutationResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type {
	IssueDetail,
	ReportIssueDto,
	ResolveIssueDto,
} from "../models/issue";
import type { ErrorResponse } from "../models/error-response";
import {
	getResolvedIssues,
	getUnresolvedIssues,
	reportIssue,
	resolveIssue,
} from "../api/issueApi";

export function useReportIssue(): UseMutationResult<
	IssueDetail,
	ErrorResponse,
	ReportIssueDto
> {
	const queryClient = useQueryClient();
	return useMutation<IssueDetail, ErrorResponse, ReportIssueDto>({
		mutationFn: (payload: ReportIssueDto) => reportIssue(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["issues", "unresolved"],
				exact: true,
			});
		},
	});
}

export function useResolveIssue(): UseMutationResult<
	IssueDetail,
	ErrorResponse,
	ResolveIssueDto
> {
	const queryClient = useQueryClient();
	return useMutation<IssueDetail, ErrorResponse, ResolveIssueDto>({
		mutationFn: (payload: ResolveIssueDto) => resolveIssue(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["issues"],
				exact: false,
			});
			queryClient.invalidateQueries({
				queryKey: ["bikes"],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["bike"],
				exact: false,
			});
		},
	});
}

export function useGetUnresolvedIssues(): UseQueryResult<
	IssueDetail[],
	ErrorResponse
> {
	return useQuery<IssueDetail[], ErrorResponse>({
		queryKey: ["issues", "unresolved"],
		queryFn: getUnresolvedIssues,
	});
}

export function useGetResolvedIssues(): UseQueryResult<
	IssueDetail[],
	ErrorResponse
> {
	return useQuery<IssueDetail[], ErrorResponse>({
		queryKey: ["issues", "resolved"],
		queryFn: getResolvedIssues,
	});
}
