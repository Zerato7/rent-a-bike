import { useState } from "react";
import { FormInput } from "./FormInput";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	errors?: string[];
	placeholder?: string;
	labelClassName?: string;
	inputClassName?: string;
}

export function PasswordInput({
	label,
	value,
	onChange,
	errors,
	placeholder,
	labelClassName,
	inputClassName,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<FormInput
				label={label}
				value={value}
				onChange={onChange}
				errors={errors}
				type={showPassword ? "text" : "password"}
				placeholder={placeholder}
				labelClassName={labelClassName}
				inputClassName={inputClassName}
			/>

			<button
				type="button"
				tabIndex={-1}
				onClick={() => setShowPassword((v) => !v)}
				className="absolute right-3 top-[2.325rem] text-primary hover:text-primary/70 text-center"
			>
				{showPassword 
					? <EyeOff className="h-4 w-auto" /> 
					: <Eye className="h-4 w-auto" />}
			</button>
		</div>
	);
}
