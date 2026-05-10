import { useTheme } from "@/hooks/useTheme";
import { ActivityIndicator, Image as ImagePng, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Image as ImageSvg} from "expo-image";
import {
	useRegisterUser,
	type RegisterUserForm,
	registerUserFrontend,
	type ErrorResponse,
	type User,
} from "@project/shared/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef } from "react";
import { FormInput } from "@/components/forms/FormInput";
import { PasswordInput } from "@/components/forms/PasswordInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
const logoLight = require("../assets/logo-light.png");
const logoDark = require("../assets/logo-dark.png");
const avatarLight = require("../assets/avatar-light.svg");
const avatarDark = require("../assets/avatar-dark.svg");

export default function Login() {
	const insets = useSafeAreaInsets();
	const { isDark } = useTheme();
	const { mutate: register, isPending, isError, reset } = useRegisterUser();
	const router = useRouter();

	const lastNameRef = useRef<TextInput>(null);
	const phoneRef = useRef<TextInput>(null);
	const emailRef = useRef<TextInput>(null);
	const usernameRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	const { control, handleSubmit, setError, clearErrors, formState: { errors } } = 
		useForm<RegisterUserForm>({
			resolver: zodResolver(registerUserFrontend),
			defaultValues: { 
				username: "", 
				password: "",
				confirmPassword: "",
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
			},
		});

	function onSubmit(data: RegisterUserForm) {
		register(data, {
			onSuccess: async (user: User) => {
				try {
					await AsyncStorage.setItem("loggedIn", JSON.stringify(user));
					router.replace("/map");
				} catch (e) {
					console.log("Error at async storage saving user", e);
				}
			},
			onError: (err: ErrorResponse) => {
				console.log(err);
				setError("root", { message: err.error });
			}
		})
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
					<View className="bg-primary items-center" style={{
						paddingTop: insets.top,
					}}>
						<ImagePng 
							source={isDark ? logoDark : logoLight}
							className="my-2"
							style={{ height: 80 }}
							resizeMode="contain"
						/>
					</View>
					<View className="flex-1 items-center pt-10 pb-[200px]">
						<View className={`
							w-[85%]
							text-primary
							dark:bg-success bg-success-light
							border-4 border-primary-medium rounded-2xl
							px-6 py-8
						`}>
							<View className="flex items-center mb-6">
								<ImageSvg 
									source={isDark ? avatarDark : avatarLight}
									style={{
										height: 50, width: 50,
									}}
									contentFit="contain"
								/>
								<Text className="text-primary text-xl font-bold">REGISTER</Text>
							</View>
							<View className="flex-row gap-2">
								<FormInput<RegisterUserForm>
									control={control}
									name="firstName"
									label="First Name*"
									errors={errors}
									resetBackendMutation={reset}
									clearErrors={clearErrors}
									inputProps={{
										returnKeyType: "next",
										onSubmitEditing: () => lastNameRef.current?.focus(),
										submitBehavior: "submit",
									}}
									componentClassName="flex-1"
								/>
								<FormInput<RegisterUserForm>
									control={control}
									name="lastName"
									label="Last Name*"
									errors={errors}
									resetBackendMutation={reset}
									clearErrors={clearErrors}
									inputProps={{
										returnKeyType: "next",
										onSubmitEditing: () => phoneRef.current?.focus(),
										submitBehavior: "submit",
									}}
									inputRef={lastNameRef}
									componentClassName="flex-1"
								/>
							</View>
							<FormInput<RegisterUserForm>
								control={control}
								name="phone"
								label="Phone"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => emailRef.current?.focus(),
									submitBehavior: "submit",
								}}
								inputRef={phoneRef}
								componentClassName=""
							/>
							<FormInput<RegisterUserForm>
								control={control}
								name="email"
								label="E-mail*"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => usernameRef.current?.focus(),
									submitBehavior: "submit",
								}}
								inputRef={emailRef}
								componentClassName=""
							/>
							<FormInput<RegisterUserForm>
								control={control}
								name="username"
								label="Username*"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => passwordRef.current?.focus(),
									submitBehavior: "submit",
								}}
								inputRef={usernameRef}
								componentClassName=""
							/>
							<PasswordInput 
								control={control}
								name="password"
								label="Password*"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "next",
									onSubmitEditing: () => confirmPasswordRef.current?.focus(),
									submitBehavior: "submit",
								}}
								inputRef={passwordRef}
								componentClassName=""
							/>
							<PasswordInput 
								control={control}
								name="confirmPassword"
								label="Confirm Password*"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									returnKeyType: "done",
									onSubmitEditing: handleSubmit(onSubmit)
								}}
								inputRef={confirmPasswordRef}
								componentClassName=""
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
									items-center justify-center 
									rounded-lg 
									${isError 
										? "border-2 border-danger-light" 
										: "bg-primary"
									}
								`}
							>
								{isPending 
									? 	<ActivityIndicator color="white" />
									: 	<Text className={`
											font-bold
											${isError ? "text-danger-light" : "text-white"}
										`}>
											Login
										</Text>
								}
							</TouchableOpacity>
							<View className="flex items-center mt-2">
								<Text className="text-primary">Already have an account?</Text>
								<Link href="/login" className="underline text-primary-heavy">Sing In here.</Link>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
