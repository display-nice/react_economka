import {ReactComponent as WeightSvg} from "../icons/weight.svg"
import {ReactComponent as VolumeSvg} from "../icons/volume.svg"
import {ReactComponent as PiecesSvg} from "../icons/pieces.svg"

export const Units = ({unitsData, activeUnit, handleUnitClick}) => {	
	const icons = {
		weight: WeightSvg,
		volume: VolumeSvg,
		pieces: PiecesSvg,
	};
	let UnitButtons = [];
	for (let keyName in unitsData) {		
		const value = unitsData[keyName][0];
		const IconSvg = icons[keyName];
		UnitButtons.push(
			<button
				key={keyName + "_btn"}
				className={`units__btn ${activeUnit === keyName ? "units__btn--active" : ""}`}
				name={keyName}
				onClick={(e) => handleUnitClick(e.currentTarget.name)}
			>
				<IconSvg/>
				<div className="units__container">{value}</div>
			</button>
		);
	}
	return <section className="units">{UnitButtons}</section>;
};
