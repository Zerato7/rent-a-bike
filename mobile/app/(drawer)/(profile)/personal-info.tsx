import { DisplayInput } from "@/components/forms/DisplayInput";
import { FormInput } from "@/components/forms/FormInput";
import { ErrorLoading } from "@/components/states/ErrorLoading";
import { Pending } from "@/components/states/Pending";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useTheme } from "@/hooks/useTheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorResponse, UpdateUserForm, updateUserRequest, useGetUser, User, useUpdateUser } from "@project/shared/index";
import { CircleX, Pencil, SquareCheck } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PersonalInfo() {
	const { userId, isLoading } = useAuthUser();

	if (isLoading) {
		return <Pending />;
	}

	if (!userId) return <Text className="text-danger">User not found</Text>;

	return <UserProfileContent userId={userId} />;
}

export function UserProfileContent({ userId }: { userId: string }) {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const {
		data: user,
		isPending: isLoadingPending,
		error: loadingError,
		isError: isLoadingError,
	} = useGetUser(userId);
	const {
		mutate: updateUser,
		isPending: isUpdatePending,
		isError: isUpdateError,
		reset: backendReset,
	} = useUpdateUser();
	const [isEditing, setIsEditing] = useState(false);
	const lastNameRef = useRef<TextInput>(null);
	const phoneRef = useRef<TextInput>(null);
	const emailRef = useRef<TextInput>(null);

	const { control, handleSubmit, setError, clearErrors, reset: frontendReset, formState: { errors } } = 
		useForm<UpdateUserForm>({
			resolver: zodResolver(updateUserRequest),
			defaultValues: user,
		});
	
	useEffect(() => {
        if (user) frontendReset(user);
    }, [user, frontendReset]);

	function onSubmit(data: UpdateUserForm) {
		updateUser(
			{
				id: userId,
				...data
			}, 
			{
				onSuccess: async (updatedUser: User) => {
					frontendReset(updatedUser);
					setIsEditing(false);
					Toast.show({
						type: "success",
						text1: "Successfully edited personal info!",
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

	function onCancel() {
		frontendReset(user);
		setIsEditing(false);
	}

	if (isLoadingPending) return <Pending />;

	if (isLoadingError) {
		return <ErrorLoading label="user" error={loadingError} />;
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
							<DisplayInput 
								label="Username"
								value={user.username}
							/>
							<View className="flex-row gap-2">
								<FormInput<UpdateUserForm>
									control={control}
									name="firstName"
									label="First Name"
									errors={errors}
									resetBackendMutation={backendReset}
									clearErrors={clearErrors}
									inputProps={{
										returnKeyType: "next",
										onSubmitEditing: () => lastNameRef.current?.focus(),
										submitBehavior: "submit",
										editable: isEditing,
									}}
									componentClassName="flex-1"
									errorColor="text-danger-light"
									labelColor="text-success"
									inputTextColor="text-success-medium"
									inputAreaColor="bg-primary-heavy/30"
								/>
								<FormInput<UpdateUserForm>
									control={control}
									name="lastName"
									label="Last Name"
									errors={errors}
									resetBackendMutation={backendReset}
									clearErrors={clearErrors}
									inputProps={{
										returnKeyType: "next",
										onSubmitEditing: () => phoneRef.current?.focus(),
										submitBehavior: "submit",
										editable: isEditing,
									}}
									inputRef={lastNameRef}
									componentClassName="flex-1"
									errorColor="text-danger-light"
									labelColor="text-success"
									inputTextColor="text-success-medium"
									inputAreaColor="bg-primary-heavy/30"
								/>
							</View>
							<FormInput<UpdateUserForm>
								control={control}
								name="phone"
								label="Phone"
								errors={errors}
								resetBackendMutation={backendReset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => emailRef.current?.focus(),
									submitBehavior: "submit",
									editable: isEditing,
								}}
								inputRef={phoneRef}
								componentClassName=""
								errorColor="text-danger-light"
								labelColor="text-success"
								inputTextColor="text-success-medium"
								inputAreaColor="bg-primary-heavy/30"
							/>
							<FormInput<UpdateUserForm>
								control={control}
								name="email"
								label="E-mail"
								errors={errors}
								resetBackendMutation={backendReset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "done",
									onSubmitEditing: handleSubmit(onSubmit),
									editable: isEditing,
								}}
								inputRef={emailRef}
								componentClassName=""
								errorColor="text-danger-light"
								labelColor="text-success"
								inputTextColor="text-success-medium"
								inputAreaColor="bg-primary-heavy/30"
							/>
							{isEditing ? (
								<>
									{errors.root && 
										<Text className="self-start px-1 text-danger-light text-sm font-bold">
											{errors.root.message}
										</Text>
									}
									<TouchableOpacity
										onPress={handleSubmit(onSubmit)}
										disabled={isUpdatePending}
										className={`
											w-full py-3 
											flex-row gap-1
											items-center justify-center 
											rounded-lg 
											${isUpdateError 
												? "border-2 border-danger-light" 
												: "bg-primary border-2 border-warning"
											}
										`}
									>
										{isUpdatePending 
											? 	<ActivityIndicator color="white" />
											: 	(
													<>
														<SquareCheck size={20} color={
																isUpdateError 
																	? colors.dangerLight()
																	: colors.warning()
															} 
														/>
														<Text className={`
															font-bold
															${isUpdateError ? "text-danger-light" : "text-warning"}
														`}>
															Save Changes
														</Text>
													</>
												)
										}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={onCancel}
										disabled={isUpdatePending}
										className={`
											w-full py-3 
											flex-row gap-1
											items-center justify-center 
											rounded-lg 
											bg-neutral
											mt-1
										`}
									>
										<CircleX size={20} color="white" />
										<Text className={`
											font-bold text-white
										`}>
											Cancel
										</Text>
									</TouchableOpacity>
								</>
							) : (
								<TouchableOpacity
									onPress={() => setIsEditing(true)}
									disabled={isUpdatePending}
									className={`
										w-full py-3 
										flex-row gap-1
										items-center justify-center 
										rounded-lg 
										bg-warning
									`}
								>
									<Pencil size={20} color={colors.primary()} />
									<Text className={`
										font-bold text-primary
									`}>
										Edit Personal Info
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
