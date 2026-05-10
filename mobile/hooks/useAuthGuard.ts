
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export function useAuthGuard() {
	const segments = useSegments();
	const router = useRouter();
	const [isCheckDone, setIsCheckDone] = useState(false);

	useEffect(() => {
		async function checkAuth() {
			try {
				const savedUser = await AsyncStorage.getItem("loggedIn");
				const isProtectedRoute = segments[0] !== "login" && segments[0] !== "register";
				if (!savedUser && isProtectedRoute) {
					router.replace("/login");
				}
				if (savedUser && !isProtectedRoute) {
					router.replace("/map");
				}
			} catch (e) {
				console.log("Error while loading data from async storage", e);
				router.replace("/login");
			} finally {
				setIsCheckDone(true);
			}
		}
		checkAuth();
	}, [segments, router]);

	return isCheckDone;
}