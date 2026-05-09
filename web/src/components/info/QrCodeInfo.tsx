import { Info } from "lucide-react";

interface QrCodeInfoProps {
	className?: string;
}

export function QrCodeInfo({ className = "" }: QrCodeInfoProps) {
	return (
		<div className={`
			flex items-center justify-center gap-3 
			rounded-lg bg-success 
			p-3 text-sm text-white
			${className}
		`}>
			<Info className="mt-0.5 h-4 w-4 shrink-0" />
			<p>
				A unique QR code will be automatically generated for the bike after it is created.
			</p>
		</div>
	);
}
