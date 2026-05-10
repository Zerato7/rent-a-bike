import { PasswordInput } from "@/components/forms/PasswordInput";
import { Pending } from "@/components/states/Pending";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useTheme } from "@/hooks/useTheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorResponse, PasswordChangeForm, passwordChangeFrontend, useChangePassword } from "@project/shared/index";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ChangePassword() {
	const { userId, isLoading } = useAuthUser();

	if (isLoading) {
		return <Pending />;
	}

	if (!userId) return <Text className="text-danger">User not found</Text>;

	return <PasswordChangeContent userId={userId} />;
}

export function PasswordChangeContent({ userId }: { userId: string }) {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const {
		mutate: changePassword,
		isPending,
		isError,
		reset: backendReset,
	} = useChangePassword();
	const newPasswordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	const { control, handleSubmit, setError, clearErrors, reset: frontendReset, formState: { errors } } = 
		useForm<PasswordChangeForm>({
			resolver: zodResolver(passwordChangeFrontend),
			defaultValues: {
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			},
		});

	function onSubmit(data: PasswordChangeForm) {
		changePassword(
			{
				id: userId,
				...data
			}, 
			{
				onSuccess: async () => {
					frontendReset({
						oldPassword: "",
						newPassword: "",
						confirmPassword: "",
					});
					Toast.show({
						type: "success",
						text1: "Successfully changed password!",
						position: "bottom",
						visibilityTime: 3000,
					});
				},
				onError: (err: ErrorResponse) => {
					console.log(err);
					setError("root", { message: err.error });
				}
			}
		)
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				style={{
					backgroundColor: "transparent",
					paddingBottom: insets.bottom,
				}}
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
				>
					<View className="flex-1 items-center pt-10 pb-120">
						<View className={`
							items-center
							w-[85%]
							text-primary
							dark:bg-primary/50 bg-primary/30
							border-4 border-primary-medium rounded-2xl
							px-6 py-8
						`}>
							<PasswordInput<PasswordChangeForm>
								control={control}
								name="oldPassword"
								label="Old Password*"
								errors={errors}
								resetBackendMutation={backendReset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => newPasswordRef.current?.focus(),
									submitBehavior: "submit",
								}}
								componentClassName=""
								errorColor="text-danger-light"
								labelColor="text-accent"
								inputTextColor="text-accent"
								inputAreaColor="bg-primary-heavy/30"
								showPasswordIconColor="--accent"
							/>
							<PasswordInput<PasswordChangeForm>
								control={control}
								name="newPassword"
								label="New Password*"
								errors={errors}
								resetBackendMutation={backendReset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => confirmPasswordRef.current?.focus(),
									submitBehavior: "submit",
								}}
								inputRef={newPasswordRef}
								componentClassName=""
								errorColor="text-danger-light"
								labelColor="text-accent"
								inputTextColor="text-accent"
								inputAreaColor="bg-primary-heavy/30"
								showPasswordIconColor="--accent"
							/>
							<PasswordInput<PasswordChangeForm>
								control={control}
								name="confirmPassword"
								label="Confirm Password*"
								errors={errors}
								resetBackendMutation={backendReset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "done",
									onSubmitEditing: handleSubmit(onSubmit),
								}}
								inputRef={confirmPasswordRef}
								componentClassName=""
								errorColor="text-danger-light"
								labelColor="text-accent"
								inputTextColor="text-accent"
								inputAreaColor="bg-primary-heavy/30"
								showPasswordIconColor="--accent"
							/>
							{errors.root && 
								<Text className="self-start px-1 text-danger-light text-sm font-bold">
									{errors.root.message}
								</Text>
							}
							<TouchableOpacity
								onPress={handleSubmit(onSubmit)}
								disabled={isPending}
								className={`
									w-full py-3 
									flex-row gap-1
									items-center justify-center 
									rounded-lg 
									mt-4
									${isError 
										? "border-2 border-danger-light" 
										: "bg-primary border-2 border-accent"
									}
								`}
							>
								{isPending 
									? 	<ActivityIndicator color={colors.primary()} />
									: 	<Text className={`
											font-bold
											${isError ? "text-danger-light" : "text-accent"}
										`}>
											Change Password
										</Text>
								}
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
