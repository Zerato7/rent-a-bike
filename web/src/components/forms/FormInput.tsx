interface FormInputProps {
	label: string;
	value: string | number;
	onChange: (value: string) => void;
	errors?: string[];
	type?: string;
	placeholder?: string;
	labelClassName?: string;
	inputClassName?: string;
	disabled?: boolean;
	componentClassName?: string;
}

export function FormInput({
	label,
	value,
	onChange,
	errors,
	type = "text",
	placeholder,
	labelClassName = "text-primary font-medium",
	inputClassName,
	disabled = false,
	componentClassName = "",
}: FormInputProps) {
	const hasError = !!errors?.length;

	return (
		<div className={componentClassName}>
			<label className={`block ${labelClassName}`}>{label}</label>

			<input
				type={type}
				value={value}
				placeholder={placeholder ?? ""}
				onChange={(e) => { onChange(e.target.value); } }
				className={`w-full rounded px-3 py-2 border-2 outline-none
          			${hasError
						? "border-danger focus:ring-danger/40"
						: "border-primary focus:ring-primary/40"
					}
          			focus:ring-2
					${inputClassName}
        		`}
				disabled={disabled}
			/>

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
