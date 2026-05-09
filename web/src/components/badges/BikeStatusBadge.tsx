interface BikeStatusBadgeProps {
	label: string;
	variant: "success" | "neutral" | "warning" | "danger";
	className?: string;
}

export function BikeStatusBadge({ label, variant, className }: BikeStatusBadgeProps) {
	const styles = {
		success: "text-black bg-success",
		neutral: "text-black bg-neutral",
		warning: "text-black bg-warning",
		danger: "text-black bg-danger-light",
	};

	return (
		<span className={`
			p-1 rounded border-2 border-primary font-bold 
			${styles[variant]} ${className ?? ""}
		`}>
			{label}
		</span>
	);
}
