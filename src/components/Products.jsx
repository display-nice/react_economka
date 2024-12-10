import { useState, useEffect } from "react";
import { ReactComponent as IconSvgAdd } from "../icons/add.svg";
import { ReactComponent as IconSvgClose } from "../icons/close.svg";
import { ReactComponent as IconSvgClear } from "../icons/clear.svg";

export const Products = ({ activeUnitData }) => {
	const [unitName, unitLarge, unitSmall] = activeUnitData;
	const initialState = [
		{
			id: 0,
			// unitInput: "1000",
			unitInput: "999999",
			unitInputIsEmpty: false,
			unitInputError: false,
			// priceInput: "86",
			priceInput: "6",
			priceInputIsEmpty: false,
			priceInputError: false,
			TEST: false,
			haveProblems: false,
			pricePerUnit: "",
			extremePricePerUnit: false,
			extraCost: "",
			extraPercent: "",
			placeInRating: "",
		},
		{
			id: 1,
			unitInput: "800",
			unitInputIsEmpty: false,
			unitInputError: false,
			priceInput: "86",
			priceInputIsEmpty: false,
			priceInputError: false,
			TEST: false,
			haveProblems: false,
			pricePerUnit: "",
			extremePricePerUnit: false,
			extraCost: "",
			extraPercent: "",
			placeInRating: "",
		},
	];
	const [state, setProdState] = useState(initialState);
	const [comparedProducts, setComparedProducts] = useState(0);
	const defaultProduct = {
		id: null,
		unitInput: "",
		unitInputIsEmpty: true,
		unitInputError: false,
		priceInput: "",
		priceInputIsEmpty: true,
		priceInputError: false,
		haveProblems: false,
		pricePerUnit: "",
		extremePricePerUnit: false,
		extraCost: "",
		extraPercent: "",
		placeInRating: "",
	};

	function checkAndCalc(incomingState) {
		// console.log("state на старте checkAndCalc", incomingState);
		const inputNames = ["unitInput", "priceInput"];

		let havePPU = [];
		let doesntHavePPU = [];

		let changedState = incomingState.map((product, i) => {
			let changedProduct = { ...product };

			inputNames.forEach((inputName) => {
				const inputValue = product[`${inputName}`];
				if (inputValue > 0 && inputValue.length <= 6) {
					// if (product.id === 0 && inputName === "unitInput") console.log(inputValue.length);
					changedProduct[`${inputName}IsEmpty`] = false;
					changedProduct[`${inputName}Error`] = false;
				} else {
					if (Number(inputValue) === 0) {
						changedProduct[`${inputName}IsEmpty`] = true;
					}
					if (inputValue.length > 6) {
						changedProduct[`${inputName}Error`] = true;
					}
				}
			});

			if (
				changedProduct.unitInputIsEmpty ||
				changedProduct.priceInputIsEmpty ||
				changedProduct.unitInputError ||
				changedProduct.priceInputError
			) {
				changedProduct.haveProblems = true;
			} else changedProduct.haveProblems = false;

			return changedProduct;
		});

		// !! можно объединить цикл сверху и цикл снизу

		for (let product of changedState) {
			// if (product.id === 0) {
			// 	console.log("пошёл расчёт. changedState[0].haveProblems = ", changedState[0].haveProblems);
			// 	console.log("пошёл расчёт. changedState[0].TEST = ", changedState[0]["TEST"]);
			// }
			product.placeInRating = "";
			product.pricePerUnit = "";
			product.extremePricePerUnit = "";
			product.extraCost = "";
			product.extraPercent = "";
			if (product.haveProblems === false) {
				// Определение множителя. Для разных ед.изм. он может отличаться.
				// Для получения килограммов и литров множитель = 1000
				// для ед.изм. "Штуки" множитель = 1 ;
				let multiplier;
				if (unitName === "Вес" || unitName === "Объём") multiplier = 1000;
				if (unitName === "Штуки") multiplier = 1;

				let pricePerUnit = ((product.priceInput / product.unitInput) * multiplier).toFixed(2);

				if (pricePerUnit < 0.1) {
					product.extremePricePerUnit = "менее 0.1";
					doesntHavePPU.push(product);
				} else if (pricePerUnit > 1000000) {
					product.extremePricePerUnit = "более 1 млн.";
					doesntHavePPU.push(product);
				} else {
					product.pricePerUnit = pricePerUnit;
					havePPU.push(product);
				}
			} else doesntHavePPU.push(product);
			console.log('product после расчёта ППЮ', product);
		}

		// определить кол-во продуктов, готовых к вычислениям

		// console.log('newState после ПЕРВОГО расчёта: ', newState);
		// if (havePPU.length === 0) {
		// 	console.log("havePPU.length === 0, выход без расчётов");			
		// 	setComparedProducts(0);
		// 	return;
		// }
		// Если готовый к расчётам продукт всего один, то больше ничего делать не нужно.
		if (havePPU.length === 0 || havePPU.length === 1) {
			console.log("havePPU.length === 0 or 1");
			let newState = havePPU.concat(doesntHavePPU);
			newState.sort((a, b) => a.id - b.id);
			// console.log(newState[1]);
			setProdState(newState);
			setComparedProducts(0);
			return;
		}
		// Если их два и больше, то уже можем посчитать среднюю цену и определить место в рейтинге
		if (havePPU.length >= 2) {
			console.log("havePPU.length >= 2");
			// Сортировка копии макета состояния по ЦЗЕИ, по возрастанию
			havePPU.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));
			// Заполнение поля "Место в рейтинге" на основании индекса
			// + Подсчёт, насколько товар дороже чем лучший по цене
			havePPU.forEach((product, index) => {
				product.placeInRating = index + 1;
				if (product.placeInRating === 1) {
					product.extraCost = "";
					product.extraPercent = "";
				} else {
					product.extraCost = (product.pricePerUnit - havePPU[0].pricePerUnit).toFixed(0);
					product.extraPercent = `${(
						((product.pricePerUnit - havePPU[0].pricePerUnit) / havePPU[0].pricePerUnit) *
						100
					).toFixed(0)}%`;
				}
			});
			// console.log('havePPU = ', havePPU, 'doesntHavePPU = ', doesntHavePPU);
			// отсортировать по id чтоб сохранить оригинальный порядок вывода.
			const newState = havePPU.concat(doesntHavePPU).sort((a, b) => a.id - b.id);
			// console.log('newState после ВТОРОГО расчёта: ', newState);
			setComparedProducts(havePPU.length);
			setProdState(newState);
		}
	}

	function changeInput(id, value, inputName) {
		// console.log("оригинальный стейт на старте changeInput = ", state);
		const stateCopy = JSON.parse(JSON.stringify(state));
		// console.log("newState на старте changeInput = ", newState);

		const i = stateCopy.findIndex((product) => product.id === id);
		stateCopy[i][`${inputName}`] = value;
		// let productWithNewValue = { ...defaultProduct, [inputName]: value };
		// stateCopy[i] = productWithNewValue;
		// setProdState(stateCopy)
		// newState[i] = validateInput(value, newState[i], inputName);
		// newState[i] = { ...newState[i], [`${inputName}`]: value };
		// console.log("newState в changeInput после изменения value = ", stateCopy);
		checkAndCalc(stateCopy);
	}

	const addNewProduct = () => {
		const newState = JSON.parse(JSON.stringify(state));
		const existingIds = newState.map((product) => product.id);
		let newId = Math.max(...existingIds) + 1;
		if (newId === -Infinity) newId = 0;
		newState.push({ ...defaultProduct });
		checkAndCalc(newState);
	};

	const removeProduct = (id) => {
		console.log("removeProduct start");
		let newState = JSON.parse(JSON.stringify(state));
		const i = newState.findIndex((product) => product.id === id);
		newState.splice(i, 1);
		checkAndCalc(newState);
	};

	const clearInputs = (id) => {
		console.log("clearInputs start");
		const newState = JSON.parse(JSON.stringify(state));
		const i = newState.findIndex((product) => product.id === id);
		newState[i] = { ...defaultProduct, [id]: id };
		// newState[i].id = id;
		console.log(newState[i]);
		checkAndCalc(newState);
	};

	const createNewId = (newState) => {};

	useEffect(() => {
		const stateCopy = JSON.parse(JSON.stringify(state));
		checkAndCalc(stateCopy);
	}, []);

	// -------------------------- Рендер -----------------------------

	// console.log('Рендер. comparedProducts = ', comparedProducts)
	let products;
	if (state.length === 0) {
		products = "";
	} else {
		// console.log('рендер. стейт = ', state);
		products = state.map((product, index) => {
			// console.log("product.id = ", product.id, "product.placeInRating = ", product.placeInRating);
			let resultClasses = "product__result";
			let unitInputClasses = "product__input product__input--unit";
			let priceInputClasses = "product__input product__input--price";

			let price;
			let priceDesc;
			let priceDiff;
			let priceDiffPercent;

			console.log('product.extremePricePerUnit = ', product.extremePricePerUnit);

			// !! здесь надо корректно продумать что показывать, если у нас на одном поле пусто, на другом ошибка
			if (product.haveProblems) {
				console.log("по продукту", product.id, " есть проблемы с инпутами");
				if (product.unitInputError || product.priceInputError) {
					priceDesc = (
						<p className="text-error">Введите целое положительное число (макс. 6 знаков)</p>
					);
					if (product.unitInputError) unitInputClasses += " product__input--error";
					if (product.priceInputError) priceInputClasses += " product__input--error";
				} else {
					if (product.unitInputIsEmpty || product.priceInputIsEmpty) {
						priceDesc = <p>Заполните поля</p>;
					}
				}
			} else {
				// Не участвует в сравнении
				
				if (product.extremePricePerUnit) {
					console.log("у продукта", product.id, " экстремальная цена")
					price = (
						<p className="product__price">{`${product.extremePricePerUnit} р/${unitLarge}`}</p>
					);
					priceDesc = (
						<p className="price-desc">Не участвует в сравнении</p>
					);
				} else {
					// Не участвует в сравнении
					if (product.placeInRating === "") {						
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
					}
					//
					if (product.placeInRating === 1) {
						resultClasses += " product__result--best-price";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="price-desc best-price">Лучшая цена</p>;
					}
					if (product.placeInRating === comparedProducts) {
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
					if (product.placeInRating > 1 && product.placeInRating < comparedProducts) {
						resultClasses += " product__result--mid-price";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="price-desc mid-price">Дороже на:</p>;
						priceDiff = (
							<p className="price-diff">
								<span className="mid-price">{`${product.extraCost} р/${unitLarge}`}</span> |{" "}
								<span className="mid-price">{`${product.extraPercent}`}</span>
							</p>
						);
					}
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
							value={product.unitInput}
							onChange={(e) => changeInput(product.id, e.target.value, e.target.name)}
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
							value={product.priceInput}
							onChange={(e) => changeInput(product.id, e.target.value, e.target.name)}
						/>
						<div className={resultClasses}>
							{price}
							{priceDesc}
							{priceDiff}
							{priceDiffPercent}
						</div>
					</div>
					<div className="product__controls">
						<IconSvgClose className="product__remove" onClick={() => removeProduct(product.id)} />
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
