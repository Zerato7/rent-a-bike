import type { ErrorResponse } from "@project/shared/index";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export function myToast(variant: "success" | "warning" | "danger" | "neutral" | "danger-light", title: string) {
	toast((t) => (
			<span className={`
				flex justify-between items-center gap-2
				${variant === "danger" ? "text-white" : "text-black"}
			`}>
				{title}
				<X size={20} className="cursor-pointer" onClick={() => toast.dismiss(t.id)} />
			</span>
		),
		{
			style: {
				background: `rgb(var(--${variant}))`,
				color: "#000",
				fontWeight: "bold",
				padding: "0.5rem",
				border: "1px solid black",
			}
		}
	);
}

export function myToastError(error: ErrorResponse) {
	myToast("danger", error.error ?? "Sorry, seems something went wrong.");
}
