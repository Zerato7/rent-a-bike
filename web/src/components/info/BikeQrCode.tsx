import { QRCodeSVG } from "qrcode.react";

interface BikeQrCodeProps {
	token: string;
	size: number;
}

export function BikeQrCode({ 
	token, 
	size 
}: BikeQrCodeProps) {
	return (
		<QRCodeSVG 
			value={`bike:${token}`}
			size={size}
		/>
	);
}
