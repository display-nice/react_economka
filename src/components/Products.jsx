import { useState, useEffect } from "react";
import { ReactComponent as IconSvgAdd } from "../icons/add.svg";
import { ReactComponent as IconSvgClose } from "../icons/close.svg";
import { ReactComponent as IconSvgClear } from "../icons/clear.svg";

export const Products = ({ activeUnitData }) => {
	const [unitName, unitLarge, unitSmall] = activeUnitData;
	const initialState = [
		{
			id: 0,
			unitInput: "",
			unitInputIsEmpty: false,
			unitInputError: false,
			priceInput: "",
			priceInputIsEmpty: false,
			priceInputError: false,
			haveProblems: false,
			pricePerUnit: "",
			extremePricePerUnit: false,
			extraCost: "",
			extraPercent: "",
			extremeExtraPercent: "",
			placeInRating: "",
		},
		{
			id: 1,
			unitInput: "",
			unitInputIsEmpty: false,
			unitInputError: false,
			priceInput: "",
			priceInputIsEmpty: false,
			priceInputError: false,
			haveProblems: false,
			pricePerUnit: "",
			extremePricePerUnit: false,
			extraCost: "",
			extraPercent: "",
			extremeExtraPercent: "",
			placeInRating: "",
		},
	];
	const [state, setProdState] = useState(initialState);
	const [comparedProducts, setComparedProducts] = useState(0);
	const defaultProduct = {
		id: null,
		unitInput: "",
		unitInputIsEmpty: false,
		unitInputError: false,
		priceInput: "",
		priceInputIsEmpty: false,
		priceInputError: false,
		haveProblems: false,
		pricePerUnit: "",
		extremePricePerUnit: false,
		extraCost: "",
		extraPercent: "",
		extremeExtraPercent: "",
		placeInRating: "",
	};

	function checkAndCalc(incomingState) {
		const inputNames = ["unitInput", "priceInput"];

		let havePPU = [];
		let doesntHavePPU = [];

		let changedState = incomingState.map((product, i) => {
			let changedProduct = { ...product };

			inputNames.forEach((inputName) => {
				const inputValue = product[`${inputName}`];
				if (inputValue > 0 && inputValue.length <= 6) {
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
			product.placeInRating = "";
			product.pricePerUnit = "";
			product.extremePricePerUnit = "";
			product.extraCost = "";
			product.extraPercent = "";
			product.extremeExtraPercent = "";
			if (product.haveProblems === false) {
				// Определение множителя. Для разных ед.изм. он может отличаться.
				// Для получения килограммов и литров множитель = 1000
				// для ед.изм. "Штуки" множитель = 1 ;
				let multiplier;
				if (unitName === "Вес" || unitName === "Объём") multiplier = 1000;
				if (unitName === "Штуки") multiplier = 1;

				let pricePerUnit = ((product.priceInput / product.unitInput) * multiplier).toFixed(2);

				if (pricePerUnit < 1) {
					product.extremePricePerUnit = "менее 1";
					doesntHavePPU.push(product);
				} else if (pricePerUnit > 1000000) {
					product.extremePricePerUnit = "более 1 млн.";
					doesntHavePPU.push(product);
				} else {
					product.pricePerUnit = pricePerUnit;
					havePPU.push(product);
				}
			} else doesntHavePPU.push(product);
		}

		// определить кол-во продуктов, готовых к вычислениям
		// Если готовых к расчётам продуктов нет или он всего один, то сравнивать и считать рейтинг.
		if (havePPU.length === 0 || havePPU.length === 1) {
			let newState = havePPU.concat(doesntHavePPU);
			newState.sort((a, b) => a.id - b.id);
			setProdState(newState);
			setComparedProducts(0);
			return;
		}
		// Если их два и больше, то уже можемс равнивать и считать рейтинг.
		if (havePPU.length >= 2) {
			// Сортировка копии макета состояния по pricePerUnit (PPU), по возрастанию
			havePPU.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));
			// Заполнение поля "Место в рейтинге" на основании индекса
			// + Подсчёт, насколько товар дороже чем лучший по цене
			havePPU.forEach((product, index) => {
				product.placeInRating = index + 1;
				if (product.placeInRating === 1) {
					product.extraCost = "";
					product.extraPercent = "";
				} else {
					product.extraCost = (product.pricePerUnit - havePPU[0].pricePerUnit).toFixed(2);

					let EP = `${(
						((product.pricePerUnit - havePPU[0].pricePerUnit) / havePPU[0].pricePerUnit) *
						100
					).toFixed(0)}`;

					if (EP < 1) {
						product.extremeExtraPercent = "менее 1%";
					} else if (EP > 1000) {
						product.extremeExtraPercent = "более 1000%";
					} else {
						product.extraPercent = EP += '%';						
					}
					
				}
			});

			// отсортировать по id чтоб сохранить оригинальный порядок вывода.
			const newState = havePPU.concat(doesntHavePPU).sort((a, b) => a.id - b.id);
			setComparedProducts(havePPU.length);
			setProdState(newState);
		}
	}

	function changeInput(id, value, inputName) {
		const stateCopy = JSON.parse(JSON.stringify(state));
		const i = stateCopy.findIndex((product) => product.id === id);
		stateCopy[i][`${inputName}`] = value;
		checkAndCalc(stateCopy);
	}

	const addNewProduct = () => {
		const stateCopy = JSON.parse(JSON.stringify(state));
		const existingIds = stateCopy.map((product) => product.id);
		let newId = Math.max(...existingIds) + 1;
		if (newId === -Infinity) newId = 0;
		stateCopy.push({ ...defaultProduct, id: newId });
		checkAndCalc(stateCopy);
	};

	const removeProduct = (id) => {
		let stateCopy = JSON.parse(JSON.stringify(state));
		const i = stateCopy.findIndex((product) => product.id === id);
		stateCopy.splice(i, 1);
		checkAndCalc(stateCopy);
	};

	const clearInputs = (inputId) => {
		const stateCopy = JSON.parse(JSON.stringify(state));
		const i = stateCopy.findIndex((product) => product.id === inputId);
		stateCopy[i] = { ...defaultProduct, id: inputId };
		checkAndCalc(stateCopy);
	};

	useEffect(() => {
		const stateCopy = JSON.parse(JSON.stringify(state));
		checkAndCalc(stateCopy);
	}, []);

	// -------------------------- Рендер -----------------------------

	let products;
	if (state.length === 0) {
		products = "";
	} else {
		products = state.map((product) => {			
			let resultClasses = "product__result";
			let unitInputClasses = "product__input product__input--unit";
			let priceInputClasses = "product__input product__input--price";

			let price;
			let priceDesc;
			let priceDiff;
			let priceDiffPercent;
			
			if (product.haveProblems) {
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
				
				if (product.extremePricePerUnit) {
					// Не участвует в сравнении
					price = (
						<p className="product__price">{`${product.extremePricePerUnit} р/${unitLarge}`}</p>
					);
					priceDesc = <p className="price-desc">Не участвует в сравнении</p>;
				} else {
					if (product.placeInRating === "") {
						// Не участвует в сравнении
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
								<span className="worst-price">{`${product.extraPercent || product.extremeExtraPercent}`}</span>
							</p>
						);
					}
					if (product.placeInRating > 1 && product.placeInRating < comparedProducts) {
						resultClasses += " product__result--mid-price";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="price-desc mid-price">Дороже на:</p>;
						priceDiff = (
							<p className="price-diff">
								<span className="mid-price">{`${product.extraCost} р/${unitLarge}`}</span> |{" "}
								<span className="mid-price">{`${product.extraPercent || product.extremeExtraPercent}`}</span>
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
