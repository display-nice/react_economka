import { useState } from "react";
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
		},
	];
	const [state, setProdState] = useState(initialState);
	const stateLength = state.length;

	const validateInput = (value) => {
		let validity = {
			onlyPositiveNumbers: false,
			sixDigits: false,
		};
		if (/^0*[1-9]\d*$/.test(value)) validity.onlyPositiveNumbers = true;
		if (String(value).length <= 6) {
			validity.sixDigits = true;
		}
		return validity;
	};

	const changeInput = (id, value, inputName) => {
		// Этап 1. Определяем инпут, в котором произошли изменения и валидируем эти изменения.
		// Если всё валидно, то идём дальше. Если нет - показываем ошибку.
		let newState = [...state];
		const i = newState.findIndex((product) => product.id === id);
		console.log(value, typeof(value))

		const validity = validateInput(value);

		if (!validity.sixDigits) return

		if (!validity.onlyPositiveNumbers) {
			newState[i][`${inputName}Error`] = true;			
		} else {
			newState[i][`${inputName}Error`] = false;
			newState[i][`${inputName}`] = value;
		}

		// Этап 2. Для продуктов с заполненными обоими инпутами считаем ЦЗЕИ (цену за ед. изм)
		let havePPU = [];
		let doesntHavePPU = [];
		newState.forEach((product) => {
			if (product.unitInput != "" && product.priceInput != "") {
				// Определение множителя. Для разных ед.изм. он может отличаться.
				// Для получения килограммов и литров множитель = 1000
				// для ед.изм. "Штуки" множитель = 1 ;
				let multiplier;
				if (unitName === "Вес" || unitName === "Объём") multiplier = 1000;
				if (unitName === "Штуки") multiplier = 1;
				product.pricePerUnit = ((product.priceInput / product.unitInput) * multiplier).toFixed(1);
				havePPU.push(product);
			} else {
				doesntHavePPU.push(product);
			}
		});
		// Этап 3, вариант 1:
		// Если продукт всего один, то больше ничего делать не нужно.
		if (stateLength === 1) {
			// console.log("newState этап 3, вариант 1", newState);
			setProdState(newState);
			return;
		}
		// Этап 3, вариант 2:
		// Если продуктов два и более, то нужно:
		// 1. Для продуктов, у которых есть ЦЗЕИ, нужно определить их место в рейтинге
		// 	Это делается путём сортировки (по возрастанию ЦЗЕИ).
		// 2. Соединить полученный массив с продуктами, у которых нет ЦЗЕИ,
		// 	Такие продукты лежат в массиве doesntHavePPU ещё с этапа 2.
		if (stateLength >= 2) {
			// Сортировка копии макета состояния по ЦЗЕИ, по возрастанию
			const sortedHavePPU = havePPU.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));

			// Заполнение поля "Место в рейтинге" на основании индекса
			// + Подсчёт, насколько товар дороже чем лучший по цене
			sortedHavePPU.forEach((product, index) => {
				product.placeInRating = index + 1;
				if (product.placeInRating === 1) {
					product.extraCost = "";
					product.extraPercent = "";
				} else {
					product.extraCost = (product.pricePerUnit - sortedHavePPU[0].pricePerUnit).toFixed(0);
					product.extraPercent = `${(
						((product.pricePerUnit - sortedHavePPU[0].pricePerUnit) /
							sortedHavePPU[0].pricePerUnit) *
						100
					).toFixed(0)}%`;
				}
			});
			
			// похоже надо законкатить sortedHavePPU и doesntHavePPU
			// а затем отсортировать его по id чтоб сохранить оригинальный порядок вывода.
			newState = sortedHavePPU.concat(doesntHavePPU).sort((a, b) => a.id - b.id);
			// console.log("newState этап 3, вариант 2", newState);
		}
		console.log(newState[i]);
		setProdState(newState);
	};

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
						resultClasses += " product__result--best-price"
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="price-desc best-price">Лучшая цена</p>;
					}
				}
				if (product.placeInRating > 1) {
					resultClasses += " product__result--worst-price"
					price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
					priceDesc = <p className="price-desc worst-price">Дороже на:</p>;
					priceDiff = <p className="price-diff"><span className="worst-price">{`${product.extraCost} р/${unitLarge}`}</span> | <span className="worst-price">{`${product.extraPercent}`}</span></p>;
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
							<p>{unitName == "Штуки" ? unitName : unitName + `, ${unitSmall}.`}</p>
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
						<IconSvgClose className="product__remove" />
						<IconSvgClear className="product__clear" />
					</div>
				</div>
			);
		});
	}
	return (
		<section className="products">
			<form>{products}</form>
			<button className="products__addnew">
				<IconSvgAdd />
				<p>Добавить продукт</p>
			</button>
		</section>
	);
};
