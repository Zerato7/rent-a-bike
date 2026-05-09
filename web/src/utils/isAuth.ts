import type { User } from "@project/shared/index";

export function isAuth(): boolean {
	return localStorage.getItem("loggedIn") ? true : false;
}

export function getProfileId(): string | null {
	const saved = localStorage.getItem("loggedIn");
	if (saved) {
		return (JSON.parse(saved) as User).id;
	}
	return null;
}
