export type SortDir = "asc" | "desc";

export const compare = <T,>(sortDir: SortDir, a: T, b: T): number => {
	if (a > b) return sortDir !== "desc" ? 1 : -1;
	if (a < b) return sortDir !== "desc" ? -1 : 1;
	return 0;
}

export function sortDirNeg(sortDir: SortDir) {
	return sortDir === "asc" ? "desc" : "asc";
}
