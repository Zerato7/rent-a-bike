import type { ErrorResponse } from "@project/shared/index";

interface ErrorLoadingProps {
	label: string;
	error: ErrorResponse;
}

export function ErrorLoading({ label, error }: ErrorLoadingProps) {
	return (
		<h2 className="
			p-2 mx-auto rounded border border-primary 
			text-danger bg-success-light
		">
			{error.error ?? `Failed to load ${label}`}
		</h2>
	);
}
