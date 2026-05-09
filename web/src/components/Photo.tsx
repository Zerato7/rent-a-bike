interface PhotoProps {
	photo?: string;
	alt: string;
}

export function Photo({ photo, alt }: PhotoProps) {
	const url = `http://localhost:5000/${photo}`;
	return (
		<a href={url} target="_blank">
			<img className="rounded" src={url} alt={alt} />
		</a>
	);
}
