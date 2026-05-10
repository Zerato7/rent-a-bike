import { useTheme } from "@/hooks/useTheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { EndRentalForm, endRentalRequest, ErrorResponse, useEndRental } from "@project/shared/index";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, Images, X } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { historyPathRef } from "@/app/_layout";

export default function ReturnBike() {
	const insets = useSafeAreaInsets();
	const { colors } = useTheme();
	const { id } = useLocalSearchParams();
	const stringId = Array.isArray(id) ? id[0] : id;
	const userLocation = [44.787197, 20.457273];
	const { mutate: endRental, isPending, isError } = useEndRental(
		userLocation[1],
		userLocation[0],
	);
	const router = useRouter();

	const { handleSubmit, setError, clearErrors, reset: frontendReset, setValue, watch, formState: { errors } } = 
		useForm<EndRentalForm>({
			resolver: zodResolver(endRentalRequest),
			defaultValues: {
				lng: userLocation[1],
				lat: userLocation[0],
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

	function onSubmit(data: EndRentalForm) {
		const payload = {
			id: stringId,
			photo: {
				uri: data.photo.uri,
				type: "image/jpeg",
				name: "end_rental_photo.jpg",
			}
		}
		endRental(payload, {
			onSuccess: async () => {
				frontendReset({
					photo: null,
				});
				router.push("/rent-history");
				Toast.show({
					type: "success",
					text1: "Rental successfully finished!",
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
							border-4 border-success-light rounded-2xl
							px-6 py-8
						`}>
							<View className="w-full items-center">
								<Text className="text-success-light font-bold self-start mb-2">
									Photo*
								</Text>
								
								{photo ? (
									<View className="
										relative w-full h-40 overflow-hidden
										mb-4 
										rounded-lg border-2 border-success-light
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
												bg-success-light
												p-4 
												rounded-lg border-2 border-success-light
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
												bg-success-light 
												p-4 
												rounded-lg border-2 border-success-light
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
											: "bg-success-light border-2 border-white"
										}
									`}
								>
									{isPending 
										? 	<ActivityIndicator color={colors.primary()} />
										: 	<Text className={`
												font-bold
												${isError ? "text-danger" : "text-white"}
											`}>
												End Rental
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