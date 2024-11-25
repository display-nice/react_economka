import { useState } from "react";

export const Products = ({ activeUnitData }) => {
	const [unitName, unitLarge, unitSmall] = activeUnitData;
	const initialState = [
		{
			id: 0,
			unitInput: "1000",
			priceInput: "86",
			pricePerUnit: "",
			placeInRating: "",
		},
		{
			id: 1,
			unitInput: "800",
			priceInput: "86",
			pricePerUnit: "",
			placeInRating: "",
		},
	];
	const [state, setProdState] = useState(initialState);

	const changeInput = (id, value, inputName) => {
		const newState = [...state];
		const i = newState.findIndex((product) => product.id === id);
		newState[i][`${inputName}`] = value;
		setProdState(newState);
	};

	const calcPriceAndRating = () => {
		const newState = [...state];
		// Определение множителя. Для разных ед.изм. он может отличаться.
		// Для получения килограммов и литров множитель = 1000
		// для ед.изм. "Штуки" множитель = 1 ;
		let multiplier;
		if (unitName === "Вес" || unitName === "Объём") multiplier = 1000;
		if (unitName === "Штуки") multiplier = 1;

		// Подсчёт цены за ед.изм.
		newState.forEach((product) => {
			product.pricePerUnit = (product.priceInput / product.unitInput) * multiplier;
		});

		// Сортировка копии макета состояния по Цене За Ед.изм., по возрастанию
		const sortedNewState = newState.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));

		// Заполнение поля "Место в рейтинге" на основании индекса.
		sortedNewState.forEach((product, index) => {
			product.placeInRating = index;
		});

		// Сортировка по айди, чтобы вернуть обратно оригинальный порядок отображения карточек на экране
		sortedNewState.sort((a, b) => a.id - b.id);

		setProdState(sortedNewState);
	};

	const products = state.map((product, index) => {

		const resultClassesMapping = [
			"product__result product__result--best-price",   // Для лучшей цены
			"product__result product__result--worst-price", // Для худшей цены
			"product__result product__result--second-price", // Для второй цены после лучшей
			"product__result product__result--third-price",  // Для третьей цены
	  ]; 
	  // Фильтруем классы в зависимости от количества продуктов
	  const filteredClasses = resultClassesMapping.slice(0, state.length); 
	  // Назначаем класс или стандартный, если индекс выходит за пределы
	  const resultClasses = filteredClasses[index] || "product__result";

		return (
			<div className="product" key={"product_id_" + product.id}>
				<div className="product__main">
					<label htmlFor="product1__unitinput" className="product__label product__label--unit">
						{unitName + `, ${unitSmall}.`}
					</label>
					<input
						id="product1__unitinput"
						type="number"
						placeholder="0"
						className="product__input product__input--unit"
						name="unitInput"
						value={+product.unitInput}
						onChange={(e) => changeInput(product.id, e.target.value, e.target.name)}
					/>

					<label htmlFor="product1__priceinput" className="product__label product__label--price">
						Цена, р.
					</label>
					<input
						id="product1__priceinput"
						type="number"
						placeholder="0"
						className="product__input product__input--price"
						name="priceInput"
						value={+product.priceInput}
						onChange={(e) => changeInput(product.id, e.target.value, e.target.name)}
					/>
					<div className={resultClasses}>
						<p>{`${product.pricePerUnit} р/${unitLarge}`}</p>
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
		);
	});
	return (
		<section className="products">
			{products}
			<button className="products__addnew" onClick={calcPriceAndRating}>
				<img src={`${process.env.PUBLIC_URL}/icons/add.svg`} alt="Добавить" />
				<p>Добавить продукт</p>
			</button>
		</section>
	);
};

/* <div className="product">
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
</div> */
