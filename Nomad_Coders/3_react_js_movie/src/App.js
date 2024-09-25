import { useEffect, useState } from "react";

function App() {
	const [loading, setLoading] = useState(true);
	const [coins, setCoins] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [money, setMoney] = useState(0);
	const onChangeCoin = (event) => setSelectedIndex(event.target.value);
	const onChaneMoney = (event) => setMoney(event.target.value);
	// const convertMoney = (money) => {};
	useEffect(() => {
		fetch("https://api.coinpaprika.com/v1/tickers")
			.then((response) => response.json())
			.then((json) => {
				setCoins(json); // 상태에 데이터 할당
				setLoading(false); // 기존 로딩 완료 시 false로 전환
			});
	}, []); // 1회만 사용되도록 의존하는 상태를 비웁니다.
	console.log(coins[selectedIndex]);
	return (
		<div>
			<h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
			{loading ? (
				<strong>Loading...</strong>
			) : (
				<div>
					<div>
						<select onChange={onChangeCoin}>
							{coins.map((coin, index) => (
								// index 대신 coin 데이터 내부의 id를 사용
								<option key={coin.id} value={index}>
									{coin.name} ({coin.symbol})
								</option>
							))}
						</select>
					</div>
					<hr />
					<div>
						<input onChange={onChaneMoney} value={money} /> USD
					</div>
					<div>
						{money / coins[selectedIndex].quotes.USD.price}{" "}
						{coins[selectedIndex].symbol}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
