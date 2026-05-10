import { type User } from "@project/shared/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAuthUser() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			try {
				const savedUser = await AsyncStorage.getItem("loggedIn");
				if (savedUser) {
					setUser(JSON.parse(savedUser));
				}
			} catch(e) {
				console.log("Error while loading data from async storage", e);
			} finally {
				setIsLoading(false);
			}
		}
		loadUser();
	});

	return {
		user,
		userId: user?.id,
		isLoading,
	};
}
