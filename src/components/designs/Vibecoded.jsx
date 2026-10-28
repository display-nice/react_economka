import { useState } from "react";
import { getProductView, getUnitFieldLabel, getStatusText } from "../../lib/productView.js";
import { AddSvg } from "../../icons/AddSvg.jsx";
import favicon from "../../img/favicon.png";
import {
	D1Weight,
	D1Volume,
	D1Pieces,
	D1Chevron,
	D1Clear,
	D1Remove,
} from "../../icons/Design1Icons.jsx";

// Иконки действий в карточке продукта — набор Design 1
// (D1Clear — ластик, D1Remove — крест в круге).
// Рендерим их как элементы (<ActionClear />), а не как саму функцию-компонент:
// иначе React не отрисует кнопки и выдаст ошибку
// «Functions are not valid as a React child».
const ActionClear = D1Clear;
const ActionRemove = D1Remove;

const unitIcons = {
	weight: D1Weight,
	volume: D1Volume,
	pieces: D1Pieces,
};

export const Vibecoded = ({
	unitsData,
	activeUnit,
	onUnitSelect,
	unitName,
	unitLarge,
	unitSmall,
	products,
	comparedProducts,
	changeInput,
	addNewProduct,
	removeProduct,
	clearInputs,
}) => {
	const [unitsOpen, setUnitsOpen] = useState(false);
	const CurrentUnitIcon = unitIcons[activeUnit];
	const unitLabel = getUnitFieldLabel(unitName, unitSmall);

	return (
		<div className="d1">
			<div className="d1__content">
				<header className="d1__header">
					<p className="d1__title">
						<img className="d1__title-icon" src={favicon} alt="" />
						<span>Экономка - сравнение цен</span>
					</p>
					<div className="d1-units">
						<button
							type="button"
							className={`d1-units__btn ${unitsOpen ? "d1-units__btn--open" : ""}`}
							aria-haspopup="true"
							aria-expanded={unitsOpen}
							onClick={() => setUnitsOpen((o) => !o)}
						>
							<CurrentUnitIcon />
							<span className="d1-units__label">{unitLabel}</span>
							<D1Chevron className="d1-units__chevron" />
						</button>
						{unitsOpen && (
							<div className="d1-units__menu" role="menu" aria-label="Единицы измерения">
								{Object.entries(unitsData).map(([key, value]) => {
									const Icon = unitIcons[key];
									return (
										<button
											type="button"
											key={key}
											role="menuitemradio"
											aria-checked={activeUnit === key}
											className={`d1-units__option ${
												activeUnit === key ? "d1-units__option--active" : ""
											}`}
											onClick={() => {
												onUnitSelect(key);
												setUnitsOpen(false);
											}}
										>
											<Icon />
											<span className="d1-units__option-name">{value[0]}</span>
											<span className="d1-units__option-sub">
												{value[1] === value[2] ? value[1] : `${value[1]}/${value[2]}`}
											</span>
										</button>
									);
								})}
							</div>
						)}
					</div>
				</header>

				<div className="d1__list">
					{products.map((product) => {
						const view = getProductView(product, unitLarge, comparedProducts);
						const rank = product.placeInRating === "" ? "none" : product.placeInRating;
						// Восклицательный знак в конце — деталь оформления Design 1,
						// общая логика и тексты (productView) не меняются
						const noteText = getStatusText(view);
						const noteTail = view.status === "best" ? "!" : "";
						return (
							<article
								key={"d1_product_id_" + product.id}
								className={`d1-card d1-card--${view.status}`}
							>
								<div className="d1-card__head">
									<span
										className={`d1-card__rank d1-card__rank--${
											view.status === "best"
												? "best"
												: view.status === "worst"
												? "worst"
												: view.status === "mid"
												? "mid"
												: "none"
										}`}
									>
										{rank === "none" ? "–" : rank}
									</span>
									<input
										className="d1-card__name"
										type="text"
										placeholder="Название продукта"
										aria-label="Название продукта"
										value={product.nameInput}
										onChange={(e) => changeInput(product.id, e.target.value, "nameInput")}
									/>
									<div className="d1-card__actions">
										<button
											type="button"
											className="d1-card__action"
											title="Очистить"
											aria-label="Очистить"
											onClick={() => clearInputs(product.id)}
										>
											<ActionClear />
										</button>
										<button
											type="button"
											className="d1-card__action d1-card__action--remove"
											title="Удалить"
											aria-label="Удалить"
											onClick={() => removeProduct(product.id)}
										>
											<ActionRemove />
										</button>
									</div>
								</div>
								<div className="d1-card__fields">
									<div className="d1-field">
										<label className="d1-field__label" htmlFor={`d1_unit_${product.id}`}>
											{unitLabel}
										</label>
										<input
											id={`d1_unit_${product.id}`}
											type="number"
											placeholder="0"
											className={`d1-field__input ${
												product.unitInputError ? "d1-field__input--error" : ""
											}`}
											value={product.unitInput}
											onChange={(e) => changeInput(product.id, e.target.value, "unitInput")}
										/>
									</div>
									<div className="d1-field">
										<label className="d1-field__label" htmlFor={`d1_price_${product.id}`}>
											Цена, р.
										</label>
										<input
											id={`d1_price_${product.id}`}
											type="number"
											placeholder="0"
											className={`d1-field__input ${
												product.priceInputError ? "d1-field__input--error" : ""
											}`}
											value={product.priceInput}
											onChange={(e) => changeInput(product.id, e.target.value, "priceInput")}
										/>
									</div>
								</div>
								<div className="d1-card__result">
									{view.text ? (
										<span className="d1-card__note">{noteText}{noteTail}</span>
									) : null}
									{view.price ? (
										<span className="d1-card__price">{view.price}</span>
									) : null}
								</div>
							</article>
						);
					})}
				</div>

				<button type="button" className="d1__add" onClick={addNewProduct}>
					<AddSvg />
					<span>Добавить продукт</span>
				</button>
			</div>
		</div>
	);
};
