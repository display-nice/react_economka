import { AddSvg } from "../icons/AddSvg.jsx";
import { ClearSvg } from "../icons/ClearSvg.jsx";
import { CloseSvg } from "../icons/CloseSvg.jsx";

// Оригинальный вариант представления продукта.
// Функциональная логика вынесена в useProducts (общая для всех дизайнов),
// разметка и стиль оригинального дизайна сохранены без изменений.
export const Products = ({
	activeUnitData,
	products,
	comparedProducts,
	changeInput,
	addNewProduct,
	removeProduct,
	clearInputs,
}) => {
	const [unitName, unitLarge, unitSmall] = activeUnitData;

	// -------------------------- Рендер -----------------------------
	
	let productsList;
	if (products.length === 0) {
		productsList = "";
	} else {
		productsList = products.map((product) => {
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
						<p className="text-error">Введите положительное число (макс. 10 знаков)</p>
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
					priceDesc = <p className="product__price-desc">не участвует в сравнении</p>;
				} else {
					if (product.placeInRating === "") {
						// Не участвует в сравнении
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
					}
					//
					if (product.placeInRating === 1) {
						resultClasses += " product__result--best";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="product__price-desc product__price-desc--best">Лучшая цена</p>;
					}
					if (product.placeInRating === comparedProducts) {
						resultClasses += " product__result--worst";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="product__price-desc product__price-desc--worst">Дороже на:</p>;
						priceDiff = (
							<p className="product__price-diff">
								<span className="product__price-desc--worst">{`${product.extraCost} р/${unitLarge}`}</span> |{" "}
								<span className="product__price-desc--worst">{`${
									product.extraPercent || product.extremeExtraPercent
								}`}</span>
							</p>
						);
					}
					if (product.placeInRating > 1 && product.placeInRating < comparedProducts) {
						resultClasses += " product__result--mid";
						price = <p className="product__price">{`${product.pricePerUnit} р/${unitLarge}`}</p>;
						priceDesc = <p className="product__price-desc product__price-desc--mid">Дороже на:</p>;
						priceDiff = (
							<p className="product__price-diff">
								<span className="product__price-desc--mid">{`${product.extraCost} р/${unitLarge}`}</span> |{" "}
								<span className="product__price-desc--mid">{`${
									product.extraPercent || product.extremeExtraPercent
								}`}</span>
							</p>
						);
					}
				}
			}
			return (
				<div className="product" key={"product_id_" + product.id}>
					<div className="product__main">
						<input
							className="product__input product__input--name"
							placeholder="Название"
							type="text"
							name="nameInput"
							value={product.nameInput}
							onChange={(e) => changeInput(product.id, e.target.value, e.target.name)}
						/>
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
						<CloseSvg className="product__remove" onClick={() => removeProduct(product.id)} />
						<ClearSvg className="product__clear" onClick={() => clearInputs(product.id)} />
					</div>
				</div>
			);
		});
	}
	return (
		<section className="products">
			{productsList}
			<button className="products__addnew" onClick={addNewProduct}>
				<AddSvg />
				<p>Добавить продукт</p>
			</button>
		</section>
	);
};
