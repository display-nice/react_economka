function App() {
	return (
		<div className="App">
			<main className="main">
				<section className="units">
					<button className="units__btn">
						<div className="units__container">Вес</div>
					</button>
					<button className="units__btn">
						<div className="units__container">Объём</div>
					</button>
					<button className="units__btn">
						<div className="units__container">Штуки</div>
					</button>
				</section>
				<section className="products">
					<div className="product">
						<div className="product__main">
							<label htmlFor="product1__unitinput" className="product__unitlabel">
								Объём
							</label>
							<input
								id="product1__unitinput"
								type="number"
								placeholder="0"
								className="product__unitinput"
							/>
							<label htmlFor="product1__priceinput" className="product__pricelabel">
								Цена
							</label>
							<input
								id="product1__priceinput"
								type="number"
								placeholder="0"
								className="product__priceinput"
							/>
							<div className="product__result">
								<p>1 из 2</p>
								<p>50р/л</p>
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
					<div className="products__add"></div>
				</section>
			</main>
		</div>
	);
}

export default App;
