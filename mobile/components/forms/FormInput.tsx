import React from "react";
import { Controller, Control, FieldErrors, Path, get } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

type Props<T extends object> = {
	control?: Control<T>;
	name: Path<T>;
	label: string;
	errors: FieldErrors<T>;
	resetBackendMutation: () => void;
	clearErrors: (name?: any) => void;
	inputProps?: React.ComponentProps<typeof TextInput>;
	inputRef?: React.RefObject<TextInput | null>;
	componentClassName?: string;
	errorColor?: string;
	labelColor?: string;
	inputTextColor?: string;
	inputAreaColor?: string;
	inputAreaBorderColor?: string;
};

export function FormInput<T extends object>({
	control,
	name,
	label,
	errors,
	resetBackendMutation,
	clearErrors,
	inputProps,
	inputRef,
	componentClassName = "",
	errorColor = "text-danger",
	labelColor = "text-primary",
	inputTextColor = "text-primary",
	inputAreaColor = "bg-white",
	inputAreaBorderColor = "border-primary",
}: Props<T>) {
	const error = get(errors, name);

	return (
		<View className={`w-full mb-4 ${componentClassName}`}>
			<Text className={`${labelColor} font-semibold mb-1`}>{label}</Text>

			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={`
							font-semibold
							${inputProps?.editable === false 
								? "bg-transparent border-2 border-transparent" 
								:`${inputAreaColor} border-2 ${error ? "border-danger" : inputAreaBorderColor}`
							}
							px-2 py-2
							rounded-lg
							${inputTextColor}
						`}
						onBlur={onBlur}
						onChangeText={(text) => {
							onChange(text);
							resetBackendMutation();
							if (errors.root) clearErrors("root");
						}}
						value={value}
						ref={inputRef}
						{...inputProps}
					/>
				)}
			/>

			{error && (
				<Text className={`${errorColor} text-sm font-bold`}>
					{error.message}
				</Text>
			)}
		</View>
	);
}
