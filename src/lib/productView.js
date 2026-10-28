// Презентационный помощник для новых дизайнов (Design 1–5).
// Содержит ТОЛЬКО отображение уже вычисленных полей продукта:
// без расчётов, без формул, без бизнес-логики.
// Статусы и тексты совпадают со смыслом оригинального дизайна.

export const getUnitFieldLabel = (unitName, unitSmall) =>
	unitName === "Штуки" ? unitName : `${unitName}, ${unitSmall}.`;

export const getPriceSuffix = (unitLarge) => `р/${unitLarge}`;

export const getProductView = (product, unitLarge, comparedProducts) => {
	if (product.haveProblems) {
		if (product.unitInputError || product.priceInputError) {
			return { status: "error", text: "Введите положительное число (макс. 10 знаков)" };
		}
		return { status: "incomplete", text: "Заполните поля" };
	}

	if (product.extremePricePerUnit) {
		return {
			status: "excluded",
			price: `${product.extremePricePerUnit} ${getPriceSuffix(unitLarge)}`,
			text: "не участвует в сравнении",
		};
	}

	if (product.placeInRating === 1) {
		return {
			status: "best",
			price: `${product.pricePerUnit} ${getPriceSuffix(unitLarge)}`,
			text: "Лучшая цена",
		};
	}

	if (product.placeInRating === comparedProducts) {
		return {
			status: "worst",
			price: `${product.pricePerUnit} ${getPriceSuffix(unitLarge)}`,
			text: "Дороже на:",
			diff: `${product.extraCost} ${getPriceSuffix(unitLarge)}`,
			percent: product.extraPercent || product.extremeExtraPercent,
		};
	}

	if (product.placeInRating > 1) {
		return {
			status: "mid",
			price: `${product.pricePerUnit} ${getPriceSuffix(unitLarge)}`,
			text: "Дороже на:",
			diff: `${product.extraCost} ${getPriceSuffix(unitLarge)}`,
			percent: product.extraPercent || product.extremeExtraPercent,
		};
	}

	return {
		status: "single",
		price: `${product.pricePerUnit} ${getPriceSuffix(unitLarge)}`,
	};
};

// Полный текст статуса (для дизайнов, где статус отображается одной строкой)
export const getStatusText = (view) => {
	if (!view.text) return "";
	if (view.status === "mid" || view.status === "worst") {
		return `${view.text} ${view.diff} · ${view.percent}`;
	}
	return view.text;
};
