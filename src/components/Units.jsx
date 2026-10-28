import {WeightSvg} from "../icons/WeightSvg.jsx";
import {VolumeSvg} from "../icons/VolumeSvg.jsx";
import {PiecesSvg} from "../icons/PiecesSvg.jsx";

export const Units = ({unitsData, activeUnit, handleUnitClick}) => {	
	const icons = {
		weight: WeightSvg,
		volume: VolumeSvg,
		pieces: PiecesSvg,
	};
	let UnitButtons = [];
	for (let keyName in unitsData) {		
		const value = unitsData[keyName][0];
		const IconsSvg = icons[keyName];
		UnitButtons.push(
			<button
				key={keyName + "_btn"}
				className={`units__btn ${activeUnit === keyName ? "units__btn--active" : ""}`}
				name={keyName}
				onClick={(e) => handleUnitClick(e.currentTarget.name)}
			>
				<IconsSvg/>
				<div className="units__container">{value}</div>
			</button>
		);
	}
	return <section className="units">{UnitButtons}</section>;
};
