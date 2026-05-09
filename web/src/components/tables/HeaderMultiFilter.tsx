import { Circle, CircleCheck, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Portal } from "../Portal";

interface HeaderMultiFilterProps<T extends string> {
	headerLabel: string;
	options: readonly T[];
	selected: Set<T>;
	onToggle: (value: T) => void;
}

export function HeaderMultiFilter<T extends string>({
	headerLabel,
	options,
	selected,
	onToggle
}: HeaderMultiFilterProps<T>) {
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState<{ top: number, left: number }>({
		top: 0,
		left: 0
	});
	const headerRef = useRef<HTMLDivElement>(null);
	const spanRef = useRef<HTMLSpanElement>(null);
	const divRef = useRef<HTMLDivElement>(null);

	const updatePosition = () => {
		if (!spanRef.current) return;

		const rect = spanRef.current.getBoundingClientRect();
		setPos({
			top: rect.bottom + 6,
			left: rect.left
		});
	};

	useEffect(() => {
		if (!open) return;

		updatePosition();

		const handler = (e: MouseEvent) => {
			if (!divRef.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);

		return () => {
			document.removeEventListener("mousedown", handler);
		}
	}, [open, selected]);

	return (
		<div ref={headerRef} className="relative">
			<span
				ref={spanRef}
				className="flex items-center gap-2 font-bold text-primary"
			>
				{headerLabel}
				<List 
					onMouseDown={(e) => {
						e.stopPropagation();
						setOpen((v) => !v);
					}}
					className={`
						h-4 w-auto cursor-pointer
						${open ? "text-primary" : "text-primary/70"}
						hover:text-primary
					`
				} />
			</span>

			{open && (
				<Portal>
					<div 
						ref={divRef}
						className="
							fixed z-[9999] 
							bg-success-light border-2 border-success rounded-md shadow-lg 
							min-w-[10rem]
						"
						style={{
							top: pos.top,
							left: pos.left,
						}}
					>
						{options.map((option) => {
							const isActive = selected.has(option);

							return (
								<button
									key={option}
									onClick={() => onToggle(option)}
									className="
										w-full px-3 py-2
										flex items-center gap-2
										text-left font-semibold
										hover:bg-success/20
									"
								>
									{isActive 
										? <CircleCheck className="h-4 w-auto text-primary cursor-pointer" />
										: <Circle className="h-4 w-auto text-primary cursor-pointer" />
									}
									{option}
								</button>
							);
						})}
					</div>
				</Portal>
			)}
		</div>
	);
}
