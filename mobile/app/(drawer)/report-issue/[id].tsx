import { historyPathRef } from "@/app/_layout";
import { FormInput } from "@/components/forms/FormInput";
import { Pending } from "@/components/states/Pending";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useTheme } from "@/hooks/useTheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportIssueRequest, ReportIssueForm, useReportIssue, ErrorResponse } from "@project/shared/index";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { Camera, Images, X } from "lucide-react-native";

export default function ReportIssue() {
	const { userId, isLoading } = useAuthUser();
	
	if (isLoading) {
		return <Pending />;
	}

	if (!userId) return <Text className="text-danger">User not found</Text>;

	return <ReportIssueContent userId={userId} />;
}

export function ReportIssueContent({ userId }: { userId: string }) {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const { id: bikeId } = useLocalSearchParams();
	const stringBikeId = Array.isArray(bikeId) ? bikeId[0] : bikeId;
	const { mutate: reportIssue, isPending, isError, reset } = useReportIssue();
	const router = useRouter();

	const { control, handleSubmit, setError, clearErrors, reset: frontendReset, setValue, watch, formState: { errors } } = 
		useForm<ReportIssueForm>({
			resolver: zodResolver(reportIssueRequest),
			defaultValues: {
				userId,
				stringBikeId,
				description: "",
				photo: null,
			},
		});

	const photo = watch("photo");

	const handlePickImage = async (useCamera: boolean) => {
        const permission = useCamera 
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission Denied", `${useCamera ? "Camera" : "Gallery"} access is required.`);
            return;
        }

        const result = useCamera 
            ? 	await ImagePicker.launchCameraAsync({ 
					quality: 0.8 
			  	})
            : 	await ImagePicker.launchImageLibraryAsync({ 
                	mediaTypes: ["images"],
                	quality: 0.8 
              	});

        if (!result.canceled) {
            setValue("photo", result.assets[0]);
            clearErrors("photo");
        }
    };

	function onSubmit(data: ReportIssueForm) {
		const payload = {
			...data,
			photo: {
				uri: data.photo.uri,
				type: "image/jpeg",
				name: "issue_photo.jpg",
			}
		}
		reportIssue(payload, {
			onSuccess: async () => {
				onCancel();
				Toast.show({
					type: "success",
					text1: "Report successfully submitted!",
					position: "bottom",
					visibilityTime: 3000,
				});
			},
			onError: (err: ErrorResponse) => {
				console.log(err);
				setError("root", { message: err.error });
			}
		});
	}

	function onCancel() {
		frontendReset({
			description: "",
			photo: null,
		});
		router.push(historyPathRef.current as any);
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
							bg-blackish
							border-4 border-danger-light rounded-2xl
							px-6 py-8
						`}>
							<View className="w-full items-center">
								<Text className="text-danger-light font-bold self-start mb-2">
									Photo*
								</Text>
								
								{photo ? (
									<View className="
										relative w-full h-40 overflow-hidden
										mb-4 
										rounded-lg border-2 border-danger-light
									">
										<Image 
											source={{ uri: photo.uri }} 
											className="w-full h-full" 
										/>
										<TouchableOpacity 
											onPress={() => setValue("photo", null)}
											className="
												absolute top-2 right-2 
												bg-black/50 p-2 rounded-full"
										>
											<X 
												size={20}
												color="white"
											/>
										</TouchableOpacity>
									</View>
								) : (
									<View className="
										w-full
										flex-row self-start items-center justify-between
										mb-4
									">
										<TouchableOpacity 
											onPress={() => handlePickImage(true)}
											className="
												flex-row items-center justify-center gap-1
												bg-danger-light
												p-4 
												rounded-lg border-2 border-danger-light
											"
										>
											<Camera 
												size={20}
												color="white"
											/>
											<Text className="font-semibold text-white">
												Camera
											</Text>
										</TouchableOpacity>
										<TouchableOpacity 
											onPress={() => handlePickImage(false)}
											className="
												flex-row items-center justify-center gap-1
												bg-danger-light 
												p-4 
												rounded-lg border-2 border-danger-light
											"
										>
											<Images 
												size={20}
												color="white"
											/>
											<Text className="font-semibold text-white">
												Gallery
											</Text>
										</TouchableOpacity>
									</View>
								)}
								{errors.photo && (
									<Text className="self-start text-danger text-sm font-bold mb-2">
										Photo is required 
									</Text>
								)}
							</View>
							<FormInput<ReportIssueForm>
								control={control}
								name="description"
								label="Description*"
								errors={errors}
								resetBackendMutation={reset}
								clearErrors={clearErrors}
								inputProps={{
									multiline: true,
									numberOfLines: 5,
									style: {
										height: 110,
										textAlignVertical: "top",
									},
									placeholder: "What issue have you noticed?",
									placeholderTextColor: "rgba(255, 255, 255, 0.5)",
								}}
								componentClassName=""
								errorColor="text-danger"
								labelColor="text-danger-light"
								inputTextColor="text-white"
								inputAreaColor="bg-transparent"
								inputAreaBorderColor="border-danger-light"
							/>
							{errors.root && 
								<Text className="px-1 text-danger text-sm font-bold">
									{errors.root.message}
								</Text>
							}
							<View className="w-full flex-row justify-between">
								<TouchableOpacity
									onPress={onCancel}
									disabled={isPending}
									className={`
										px-4 py-3 
										flex-row gap-1
										items-center justify-center 
										rounded-lg 
										mt-4
										bg-neutral
									`}
								>
									<Text className={`
										font-bold
										text-white
									`}>
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleSubmit(onSubmit)}
									disabled={isPending}
									className={`
										px-4 py-3 
										flex-row gap-1
										items-center justify-center 
										rounded-lg 
										mt-4
										${isError 
											? "border-2 border-danger" 
											: "bg-danger-light border-2 border-white"
										}
									`}
								>
									{isPending 
										? 	<ActivityIndicator color={colors.primary()} />
										: 	<Text className={`
												font-bold
												${isError ? "text-danger" : "text-white"}
											`}>
												Submit Issue
											</Text>
									}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
