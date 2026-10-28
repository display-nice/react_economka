import { useState, useEffect } from "react";

// Общая функциональная логика приложения «Экономка».
// Используется всеми вариантами дизайна (Original + Design 1–5).
// Здесь живёт валидация, расчёт цены за единицу и сравнение продуктов.
// Презентационная часть находится в компонентах src/components/.

export const useProducts = (unitName) => {
	const [state, setProdState] = useState([
		{
			id: 0,
			nameInput: "",
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
			nameInput: "",
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
	]);
	const [comparedProducts, setComparedProducts] = useState(0);
	const defaultProduct = {
		id: null,
		nameInput: "",
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

		let havePPU = []; // PPU это pricePerUnit, цена за единицу товара
		let doesntHavePPU = [];

		let changedState = incomingState.map((product, i) => {
			let changedProduct = { ...product };

			inputNames.forEach((inputName) => {
				// Этап 1. Валидация.
				const inputValue = product[`${inputName}`];
				if (inputValue > 0 && inputValue.length <= 10) {
					changedProduct[`${inputName}IsEmpty`] = false;
					changedProduct[`${inputName}Error`] = false;
				} else {
					if (Number(inputValue) === 0) {
						changedProduct[`${inputName}IsEmpty`] = true;
					}
					if (inputValue.length > 10) {
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

		// Этап 2. Подсчёт средней цены и места в рейтинге 
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
		// Если готовых к расчётам продуктов нет или он всего один, то не нужно сравнивать и считать рейтинг.
		if (havePPU.length === 0 || havePPU.length === 1) {
			let newState = havePPU.concat(doesntHavePPU);
			newState.sort((a, b) => a.id - b.id);
			setProdState(newState);
			setComparedProducts(0);
			return;
		}
		// Если их два и больше, то уже можем сравнивать и считать рейтинг.
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
						product.extraPercent = EP += "%";
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
		inputName === "nameInput" ? setProdState(stateCopy) : checkAndCalc(stateCopy);		
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
	// На маунте один раз считаем по текущим данным (поведение оригинала):
	// зависимости намеренно не указываем.
	}, []);

	return {
		products: state,
		comparedProducts,
		changeInput,
		addNewProduct,
		removeProduct,
		clearInputs,
	};
};
