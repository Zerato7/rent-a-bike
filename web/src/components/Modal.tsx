import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";

interface ModalProps<T = void> {
	open: boolean;
	onClose: (reuslt?: T) => void;
	title: string;
	titleAlign?: "center" | "between";
	titleColor?: string;
	contentClassName: string;
	children: (close: (result?: T) => void) => ReactNode;
}

export function Modal<T = void>({
	open,
	onClose,
	title,
	titleAlign = "between",
	titleColor = "text-primary",
	contentClassName,
	children
}: ModalProps<T>) {

	const headerClass = titleAlign === "center"
		? "flex justify-center relative mb-4"
		: "flex justify-between mb-4";

	const closeBtnClass = titleAlign === "center"
		? "absolute right-0 top-1/2 -translate-y-1/2"
		: "";

	return (
		<Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
				<Dialog.Content 
					aria-describedby={undefined}
					className={`
						fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
						border-4
						w-full max-w-lg rounded-lg shadow-xl
						${contentClassName} pt-2 pb-4 px-4
					`}
				>
					<Dialog.Title>
						<div className={headerClass}>
							<h2 className={`
								text-lg font-bold
								${titleColor}
							`}>
								{title}
							</h2>
							<button
								onClick={() => onClose()}
								className={closeBtnClass}
							>
								<X className={`
									h-5 w-auto
									cursor-pointer
									${titleColor} 
									hover:${titleColor} hover:opacity-80
								`} />
							</button>
						</div>
					</Dialog.Title>
					{children(onClose)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
