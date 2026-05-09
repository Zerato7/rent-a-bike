import { useState } from "react";
import z, { ZodType } from "zod";

export function useZodForm<T extends object>(
	schema: ZodType<T>,
	initialValues: T,
) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

	function validate(nextValues: T, allTouched: boolean = false) {
		const result = schema.safeParse(nextValues);

		if (!result.success) {
			const flattenedErrors = z.flattenError(result.error);

			const effectiveTouched = allTouched
			? Object.fromEntries(Object.keys(nextValues).map(k => [k, true]))
			: touched;

			const filteredErrors = Object.fromEntries(
			Object.entries(
				flattenedErrors.fieldErrors as Record<string, string[]>,
			).filter(([field]) => allTouched || effectiveTouched[field]),
			);

			setErrors(filteredErrors);
			return false;
		}

		setErrors({});
		return true;
	}

	function setField<K extends keyof T>(key: K, value: T[K]) {
		const next = { ...values, [key]: value };
		setTouched({ ...touched, [key]: true });
		setValues(next);
		validate(next);
	}

	function reset(nextValues: T) {
		setValues(nextValues);
		setErrors({});
		setTouched({});
	}

	return {
		values,
		errors,
		setField,
		setErrors,
		validate,
		reset,
	};
}
