import { useState } from "react";
import { Units } from "@components/Units";
import { Products } from "@components/Products";
import { DesignSwitcher } from "@components/DesignSwitcher";
import { useProducts } from "@hooks/useProducts";
import { Vibecoded } from "@components/designs/Vibecoded.jsx";

function App() {
	const unitsData = {
		weight: ["Вес", "кг", "г"],
		volume: ["Объём", "л", "мл"],
		pieces: ["Штуки", "шт", "шт"],
	};
	const [activeUnit, setActiveUnit] = useState("weight");
	const [design, setDesign] = useState("vibecoded"); // Дизайн по умолчанию

	// Единая функциональная логика для всех вариантов дизайна.
	// Данные сохраняются при переключении дизайнов.
	const {
		products,
		comparedProducts,
		changeInput,
		addNewProduct,
		removeProduct,
		clearInputs,
	} = useProducts(unitsData[activeUnit][0]);

	const activeUnitData = unitsData[activeUnit];

	const designProps = {
		unitsData,
		activeUnit,
		onUnitSelect: setActiveUnit,
		unitName: activeUnitData[0],
		unitLarge: activeUnitData[1],
		unitSmall: activeUnitData[2],
		products,
		comparedProducts,
		changeInput,
		addNewProduct,
		removeProduct,
		clearInputs,
	};

	const switcher = <DesignSwitcher active={design} onSelect={setDesign} />;

	// Оригинальный дизайн (структура контейнера приведена к Vibecoded:
	// переключатель расположен снаружи подложки, ширина и фон одинаковы)
	if (design === "original") {
		return (
			<>
				{switcher}
				<div className="App">
					<main className="main">
						<Units {...{ unitsData, activeUnit, handleUnitClick: setActiveUnit }} />
						<Products
							activeUnitData={activeUnitData}
							products={products}
							comparedProducts={comparedProducts}
							changeInput={changeInput}
							addNewProduct={addNewProduct}
							removeProduct={removeProduct}
							clearInputs={clearInputs}
						/>
					</main>
				</div>
			</>
		);
	}

	// Вариант по умолчанию
	switch (design) {
		case "vibecoded":
			return (
				<>
					{switcher}
					<Vibecoded {...designProps} />
				</>
			);
		default:
			return null;
	}
}

export default App;
