import { useState } from "react";
import { Units } from "@components/Units";
import { Products } from "@components/Products";

function App() {
	const unitsData = {
		weight: ["Вес", "кг", "г"],
		volume: ["Объём", "л", "мл"],
		pieces: ["Штуки", "шт", "шт"],
	};
	const [activeUnit, setActiveUnit] = useState("weight");
	const handleUnitClick = (btnName) => {
		setActiveUnit(btnName);
	};

	return (
		<div className="App">
			<main className="main">
				<Units {...{ unitsData, activeUnit, handleUnitClick }}/>
				<Products activeUnitData={unitsData[activeUnit]}/>
			</main>
		</div>
	);
}

export default App;
