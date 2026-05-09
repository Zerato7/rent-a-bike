interface FormSelectProps<T extends string> {
	label: string;
	value: T;
	onChange: (value: T) => void;
	errors?: string[];
	children: React.ReactNode;
}

export function FormSelect<T extends string = string>({
	label,
	value,
	onChange,
	errors,
	children
}: FormSelectProps<T>) {
	const hasError = !!errors?.length;

	return (
		<div>
			<label className="block text-primary font-medium">{label}</label>

			<select
				value={value}
				onChange={(e) => onChange(e.target.value as T)}
				className={`w-full rounded px-3 py-2 border-2 outline-none bg-white
					${hasError
						? "border-danger focus:ring-danger/40"
						: "border-primary focus:ring-primary/40"
					}
					focus:ring-2
				`}
			>
				{children}
			</select>

			<div className="min-h-[1.25rem]">
				{errors?.map((msg) => (
					<p key={msg} className="text-danger text-sm font-bold">
						&#9679; {msg}
					</p>
				))}
			</div>
		</div>
	);
}
