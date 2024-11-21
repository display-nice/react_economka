import { useState } from "react";
import { Units } from "@components/Units";

function App() {
	const unitBtnsData = {
		weight: "Вес",
		volume: "Объём",
		pieces: "Штуки",
	};
	const [activeUnit, setActiveUnit] = useState("weight");
	const handleUnitClick = (btnName) => {
		setActiveUnit(btnName);
	};

	return (
		<div className="App">
			<main className="main">
				<Units {...{ unitBtnsData, activeUnit, handleUnitClick }}/>
				<section className="products">
					<div className="product">
						<div className="product__main">
							<label htmlFor="product1__unitinput" className="product__label product__label--unit">
								Объём
							</label>
							<input
								id="product1__unitinput"
								type="number"
								placeholder="0"
								className="product__input product__input--unit"
							/>
							<label htmlFor="product1__priceinput" className="product__label product__label--price">
								Цена
							</label>
							<input
								id="product1__priceinput"
								type="number"
								placeholder="0"
								className="product__input product__input--price"
							/>
							<div className="product__result product__result--best-price">
								<p>100р/л</p>
								<p>Лучшая цена</p>
							</div>
						</div>
						<div className="product__controls">
							<img
								className="product__remove"
								src={`${process.env.PUBLIC_URL}/icons/close.svg`}
								alt="Удалить"
							/>
							<img
								className="product__clear"
								src={`${process.env.PUBLIC_URL}/icons/clear.svg`}
								alt="Очистить"
							/>
						</div>
					</div>
					<div className="product">
						<div className="product__main">
							<label htmlFor="product2__unitinput" className="product__label product__label--unit">
								Объём
							</label>
							<input
								id="product2__unitinput"
								type="number"
								placeholder="0"
								className="product__input product__input--unit"
							/>
							<label htmlFor="product2__priceinput" className="product__label product__label--price">
								Цена
							</label>
							<input
								id="product2__priceinput"
								type="number"
								placeholder="0"
								className="product__input product__input--price"
							/>
							<div className="product__result product__result--worst-price">
								<p>120 р/кг</p>
								<p>Дороже на:</p>
								<p>20 р/кг | 20%</p>
							</div>
						</div>
						<div className="product__controls">
							<button className="product__remove">
								<img src={`${process.env.PUBLIC_URL}/icons/close.svg`} alt="Удалить" />
							</button>
							<button className="product__clear">
								<img src={`${process.env.PUBLIC_URL}/icons/clear.svg`} alt="Очистить" />
							</button>
						</div>
					</div>
					<button className="products__addnew">
						<img src={`${process.env.PUBLIC_URL}/icons/add.svg`} alt="Добавить" />
						<p>Добавить продукт</p>
					</button>
				</section>
			</main>
		</div>
	);
}

export default App;
