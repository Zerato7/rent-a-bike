import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function DrawerHome() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/map");
	}, [router]);

	return null;
}