interface AvatarIconProps {
	onClick?: () => void;
	className: string;
	isActive?: boolean;
}

export default function AvatarIcon({ onClick, className, isActive }: AvatarIconProps) {
	return (
		<svg
			onClick={onClick}
			viewBox="0 0 79 79"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="2.5"
				y="2.5"
				width="74"
				height="74"
				rx="37"
				stroke="currentColor"
				strokeWidth="5"
				fill={isActive ? "rgb(var(--primary))" : "none"}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M51.3505 31.6C51.3505 38.1446 46.0451 43.45 39.5005 43.45C32.9559 43.45 27.6505 38.1446 27.6505 31.6C27.6505 25.0554 32.9559 19.75 39.5005 19.75C46.0451 19.75 51.3505 25.0554 51.3505 31.6ZM47.4005 31.6C47.4005 35.963 43.8635 39.5 39.5005 39.5C35.1374 39.5 31.6005 35.963 31.6005 31.6C31.6005 27.237 35.1374 23.7 39.5005 23.7C43.8635 23.7 47.4005 27.237 47.4005 31.6Z"
				fill="currentColor"
			/>
			<path
				d="M39.5005 49.375C26.7136 49.375 15.8188 56.9361 11.6687 67.5293C12.6797 68.5332 13.7447 69.4828 14.859 70.3733C17.9493 60.6477 27.644 53.325 39.5005 53.325C51.357 53.325 61.0517 60.6477 64.142 70.3733C65.2563 69.4828 66.3213 68.5332 67.3323 67.5293C63.1822 56.9361 52.2874 49.375 39.5005 49.375Z"
				fill="currentColor"
			/>
		</svg>
	);
}
