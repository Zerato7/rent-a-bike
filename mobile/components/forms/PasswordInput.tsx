import { useState } from "react";
import { Controller, Control, FieldErrors, Path, get } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { RAW_COLORS } from "@/constants/themes";

type Props<T extends object> = {
	control: Control<T>;
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
	showPasswordIconColor?: keyof typeof RAW_COLORS.light;
};

export function PasswordInput<T extends object>({
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
	showPasswordIconColor = "--primary",
}: Props<T>) {
	const [showPassword, setShowPassword] = useState(false);
	const { colors } = useTheme();

	const error = get(errors, name);

	return (
		<View className={`w-full mb-4 ${componentClassName}`}>
			<Text className={`${labelColor} font-semibold mb-1`}>{label}</Text>

			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="justify-center">
						<TextInput
							className={`
								font-semibold
								${inputProps?.editable === false 
									? "bg-transparent border-2 border-transparent" 
									:`${inputAreaColor} border-2 ${error ? "border-danger" : inputAreaBorderColor}`
								}
								pl-2 pr-10 py-2
								rounded-lg 
								${inputTextColor}
							`}
							secureTextEntry={!showPassword}
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

						<TouchableOpacity
							className="absolute right-3"
							onPress={() => setShowPassword((v) => !v)}
						>
							{showPassword ? (
								<EyeOff size={20} color={colors.getColor(showPasswordIconColor)} />
							) : (
								<Eye size={20} color={colors.getColor(showPasswordIconColor)} />
							)}
						</TouchableOpacity>
					</View>
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
