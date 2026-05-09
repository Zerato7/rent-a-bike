interface PendingProps {
	label: string;
}

export function Pending({ label }: PendingProps) {
	return (
		<h2 className="
			p-2 mx-auto text-center 
			text-lg font-extrabold
			rounded border border-primary 
			text-primary bg-success-light
		">
			Loading {label}...
		</h2>
	);
}
