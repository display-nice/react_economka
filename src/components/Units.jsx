export const Units = ({unitsData, activeUnit, handleUnitClick}) => {	
	let UnitButtons = [];
	for (let keyName in unitsData) {		
		const value = unitsData[keyName][0];
		UnitButtons.push(
			<button
				key={keyName + "_btn"}
				className={`units__btn ${activeUnit === keyName ? "units__btn--active" : ""}`}
				name={keyName}
				onClick={(e) => handleUnitClick(e.currentTarget.name)}
			>
				<img src={`${process.env.PUBLIC_URL}/icons/${keyName}.svg`} alt={value} />
				<div className="units__container">{value}</div>
			</button>
		);
	}
	return <section className="units">{UnitButtons}</section>;
};
