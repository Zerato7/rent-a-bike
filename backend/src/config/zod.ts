import z from "zod";

export const configZod = () => {
	z.config({
		customError: (iss) => {
			if (iss.input === undefined) return `${iss.path?.join(".")} is required`;
		}
	});
};
