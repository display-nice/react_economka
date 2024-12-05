import { useState, useEffect } from "react";
import { ReactComponent as IconSvgAdd } from "../icons/add.svg";
import { ReactComponent as IconSvgClose } from "../icons/close.svg";
import { ReactComponent as IconSvgClear } from "../icons/clear.svg";

export const Products = ({ activeUnitData }) => {
	const [unitName, unitLarge, unitSmall] = activeUnitData;
	const initialState = [
		{
			id: 0,
			unitInput: 1000,
			priceInput: 86,
			pricePerUnit: "",
			extraCost: "",
			extraPercent: "",
			placeInRating: "",
			unitInputError: false,
			priceInputError: false,
			someInputIsEmpty: false,
			readyToCalc: true,
		},
		{
			id: 1,
			unitInput: 800,
			priceInput: 86,
			pricePerUnit: "",
			extraCost: "",
			extraPercent: "",
			placeInRating: "",
			unitInputError: false,
			priceInputError: false,
			someInputIsEmpty: false,
			readyToCalc: true,
		},
	];
	const [state, setProdState] = useState(initialState);
	const stateLength = state.length;

	const validateInput = (value, product, inputName) => {
		const updatedProduct = { ...product };
		if (value === "") {
			updatedProduct.someInputIsEmpty = true;
			updatedProduct[`${inputName}Error`] = false;
			updatedProduct.readyToCalc = false;
		} else {
			if (Number.isInteger(value) && value > 0 && String(value).length <= 6) {
				updatedProduct.someInputIsEmpty = false;
				updatedProduct[`${inputName}Error`] = false;
				updatedProduct.readyToCalc = true;
			} else {
				updatedProduct.someInputIsEmpty = false;
				updatedProduct[`${inputName}Error`] = true;
				updatedProduct.readyToCalc = false;
			}
		}
		return updatedProduct;
	};

	const makeCalculations = (state) => {
		let newState = [...state];
		// определить кол-во продуктов, готовых к вычислениям
		let productsReadyToCalc = [];
		let productsNOTReadyToCalc = [];
		newState.forEach((product) => {
			if (product.readyToCalc) {
				// Определение множителя. Для разных ед.изм. он может отличаться.
				// Для получения килограммов и литров множитель = 1000
				// для ед.изм. "Штуки" множитель = 1 ;
				let multiplier;
				if (unitName === "Вес" || unitName === "Объём") multiplier = 1000;
				if (unitName === "Штуки") multiplier = 1;
				product.pricePerUnit = ((product.priceInput / product.unitInput) * multiplier).toFixed(1);
				productsReadyToCalc.push(product);				
			} else {
				product.pricePerUnit = "";
				product.extraCost = "";
				product.extraPercent = "";
				product.placeInRating = "";
				productsNOTReadyToCalc.push(product);
			}
		});

		if (productsReadyToCalc.length === 0) {			
			return;
		}
		// Если готовый к расчётам продукт всего один, то больше ничего делать не нужно.
		if (productsReadyToCalc.length === 1) {
			setProdState(newState);
			return;
		}
		// Если их два и больше, то уже можем посчитать среднюю цену и определить место в рейтинге
		if (productsReadyToCalc.length >= 2) {
			
			// Сортировка копии макета состояния по ЦЗЕИ, по возрастанию
			const sortedPRTC = productsReadyToCalc.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));

			// Заполнение поля "Место в рейтинге" на основании индекса
			// + Подсчёт, насколько товар дороже чем лучший по цене
			sortedPRTC.forEach((product, index) => {
				product.placeInRating = index + 1;
				if (product.placeInRating === 1) {
					product.extraCost = "";
					product.extraPercent = "";
				} else {
					product.extraCost = (product.pricePerUnit - sortedPRTC[0].pricePerUnit).toFixed(0);
					product.extraPercent = `${(
						((product.pricePerUnit - sortedPRTC[0].pricePerUnit) /
						sortedPRTC[0].pricePerUnit) *
						100
					).toFixed(0)}%`;
				}
			});
			
			// отсортировать по id чтоб сохранить оригинальный порядок вывода.
			newState = sortedPRTC.concat(productsNOTReadyToCalc).sort((a, b) => a.id - b.id);			
			setProdState(newState);
		}
	};

	const changeInput = (id, value, inputName) => {
		let newState = [...state];
		const i = newState.findIndex((product) => product.id === id);
		newState[i] = validateInput(value, newState[i], inputName);
		newState[i][`${inputName}`] = value;
		makeCalculations(newState);
	};
	
	const addNewProduct = () => {
		const newState = [...state];
		const existingIds = newState.map((product) => product.id);
		let newId = Math.max(...existingIds) + 1;
		if (newId === -Infinity) newId = 0;
		newState.push({
			id: newId,
			unitInput: "",
			priceInput: "",
			pricePerUnit: "",
			extraCost: "",
			extraPercent: "",
			placeInRating: "",
			unitInputError: false,
			priceInputError: false,
		});
		// setProdState(newState);
		makeCalculations(newState)
	};

	const removeThisProduct = (id) => {
		console.log("removeThisProduct start");
		let newState = [...state];
		const i = newState.findIndex((product) => product.id === id);
		newState.splice(i, 1)
		makeCalculations(newState)
		// setProdState(newState);
	};

	const clearInputs = (id) => {
		console.log("clearInputs start");
		const newState = [...state];
		const i = newState.findIndex((product) => product.id === id);
		newState[i].unitInput = "";
		newState[i].priceInput = "";
		makeCalculations(newState)
		// setProdState(newState);
	};

	useEffect(() => {
		makeCalculations(state)
	}, [])
	

	// -------------------------- Подготовка продуктов к рендеру -----------------------------

	let products;
	if (stateLength === 0) {
		products = "";
	}
	if (stateLength >= 1) {
		products = state.map((product, index) => {
			// console.log("product.id = ", product.id, "product.placeInRating = ", product.placeInRating);
			let resultClasses = "product__result";
			let unitInputClasses = "product__input product__input--unit";
			let priceInputClasses = "product__input product__input--price";

			let price;
			let priceDesc;
			let priceDiff;
			let priceDiffPercent;

			if (product.unitInputError || product.priceInputError) {
				priceDesc = (
					<p className="text-error">Введите целое положительное число (макс. 6 знаков)</p>
				);
				if (product.unitInputError) unitInputClasses += " product__input--error";
				if (product.priceInputError) priceInputClasses += " product__input--error";
			} else {
				if (product.placeInRating === "") {
					priceDesc = <p>Заполните поля</p>;
				}
				if (product.placeInRating === 1) {
					if (product.pricePerUnit !== "") {
						resultClasses += " product__result--best-price";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="price-desc best-price">Лучшая цена</p>;
					}
				}
				if (product.placeInRating > 1) {
					resultClasses += " product__result--worst-price";
					price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
					priceDesc = <p className="price-desc worst-price">Дороже на:</p>;
					priceDiff = (
						<p className="price-diff">
							<span className="worst-price">{`${product.extraCost} р/${unitLarge}`}</span> |{" "}
							<span className="worst-price">{`${product.extraPercent}`}</span>
						</p>
					);
					// priceDiff = <p className="text-error">{`${product.extraCost} р/${unitLarge}`}</p>;
					// priceDiffPercent = <p className="text-error">{`${product.extraPercent}`}</p>;
				}
			}
			return (
				<div className="product" key={"product_id_" + product.id}>
					<div className="product__main">
						<label
							htmlFor={"product_id_" + product.id + "_unitinput"}
							className="product__label product__label--unit"
						>
							<p>{unitName === "Штуки" ? unitName : unitName + `, ${unitSmall}.`}</p>
						</label>
						<input
							id={"product_id_" + product.id + "_unitinput"}
							type="number"
							placeholder="0"
							className={unitInputClasses}
							name="unitInput"
							value={+product.unitInput}
							onChange={(e) => changeInput(product.id, Number(e.target.value), e.target.name)}
						/>

						<label
							htmlFor={"product_id_" + product.id + "_priceinput"}
							className="product__label product__label--price"
						>
							<p>Цена, р.</p>
						</label>
						<input
							id={"product_id_" + product.id + "_priceinput"}
							type="number"
							placeholder="0"
							className={priceInputClasses}
							name="priceInput"
							value={+product.priceInput}
							onChange={(e) => changeInput(product.id, Number(e.target.value), e.target.name)}
						/>
						<div className={resultClasses}>
							{price}
							{priceDesc}
							{priceDiff}
							{priceDiffPercent}
						</div>
					</div>
					<div className="product__controls">
						<IconSvgClose
							className="product__remove"
							onClick={() => removeThisProduct(product.id)}
						/>
						<IconSvgClear className="product__clear" onClick={() => clearInputs(product.id)} />
					</div>
				</div>
			);
		});
	}
	return (
		<section className="products">
			<form>{products}</form>
			<button className="products__addnew" onClick={addNewProduct}>
				<IconSvgAdd />
				<p>Добавить продукт</p>
			</button>
		</section>
	);
};
