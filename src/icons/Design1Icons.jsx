// Иконки Design 1 — спокойные скруглённые линии (stroke 1.8).

const base = {
	xmlns: "http://www.w3.org/2000/svg",
	width: "24",
	height: "24",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.8",
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

export const D1Weight = (props) => (
	<svg {...base} {...props}>
		<path d="M4.4 9.4v5.2" />
		<path d="M7.2 7.4v9.2" />
		<path d="M16.8 7.4v9.2" />
		<path d="M19.6 9.4v5.2" />
		<path d="M7.2 12h9.6" />
	</svg>
);

export const D1Volume = (props) => (
	<svg {...base} {...props}>
		<path d="M12 3.8c3.2 3.7 5.8 6.8 5.8 9.9a5.8 5.8 0 1 1-11.6 0c0-3.1 2.6-6.2 5.8-9.9z" />
		<path d="M9.3 13.8a2.8 2.8 0 0 0 2.1 2.7" />
	</svg>
);

export const D1Pieces = (props) => (
	<svg {...base} {...props}>
		<path d="M4.2 8.4 12 4.2l7.8 4.2v7.2L12 19.8l-7.8-4.2z" />
		<path d="M4.2 8.4 12 12.6l7.8-4.2" />
		<path d="M12 12.6v7.2" />
	</svg>
);

export const D1Chevron = (props) => (
	<svg {...base} {...props}>
		<path d="m7.2 9.6 4.8 4.8 4.8-4.8" />
	</svg>
);

// Ластик — кнопка «Очистить» в карточке продукта.
export const D1Clear = (props) => (
	<svg {...base} {...props}>
		<path d="m7 20.4-4.1-4.1a2.2 2.2 0 0 1 0-3.1l9.2-9.2a2.2 2.2 0 0 1 3.1 0l5.3 5.3a2.2 2.2 0 0 1 0 3.1L13.4 20.4H7z" />
		<path d="M20.6 20.4H7" />
		<path d="m5.5 10.9 7.6 7.6" />
		<path d="M19.4 3.8v2.8" />
		<path d="M18 5.2h2.8" />
	</svg>
);

// Крест в круге — кнопка «Удалить» в карточке продукта.
export const D1Remove = (props) => (
	<svg {...base} {...props}>
		<circle cx="12" cy="12" r="8.6" />
		<path d="M9.2 9.2l5.6 5.6" />
		<path d="M14.8 9.2l-5.6 5.6" />
	</svg>
);
