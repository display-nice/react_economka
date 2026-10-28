import { useEffect, useRef, useState } from "react";

// Новая иконка кнопки выбора дизайна (цветовая палитра) — файл из корня проекта:
// palitra_hups7xnhm562.svg (предыдущая tsvetovaya_palitra_jazy6t477gxe.svg
// и прежняя иконка «ползунки» тоже сохранены в корне: sliders.svg).
// import PalitraSvg from "../../palitra_hups7xnhm562.svg";
import { PalitraSvg } from "../icons/PalitraSvg.jsx"

export const DESIGNS = [
	{ id: "vibecoded", label: "Vibecoded" },
	{ id: "original", label: "Original" },
];

const CheckSvg = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="15"
		height="15"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="m5 12.8 4.4 4.4L19 7" />
	</svg>
);

export const DesignSwitcher = ({ active, onSelect }) => {
	const [open, setOpen] = useState(false);
	const rootRef = useRef(null);

	useEffect(() => {
		if (!open) return undefined;
		const onDown = (e) => {
			if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
		};
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	return (
		<div className="switcher" ref={rootRef}>
			<button
				type="button"
				className="switcher__toggle"
				title="Выбор дизайна"
				aria-haspopup="true"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
			>
				<PalitraSvg className="switcher__toggle-icon" />

							
			</button>
			{open && (
				<div className="switcher__menu" role="menu" aria-label="Выбор дизайна">
					{DESIGNS.map((design) => (
						<button
							type="button"
							key={design.id}
							role="menuitemradio"
							aria-checked={active === design.id}
							className={`switcher__item ${active === design.id ? "switcher__item--active" : ""}`}
							onClick={() => {
								onSelect(design.id);
								setOpen(false);
							}}
						>
							<span className="switcher__item-name">{design.label}</span>
							{active === design.id && <CheckSvg />}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
