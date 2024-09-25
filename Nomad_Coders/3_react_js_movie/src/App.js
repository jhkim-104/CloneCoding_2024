import { useEffect, useState } from "react";

function App() {
	const [loading, setLoading] = useState(true);
	const [coins, setCoins] = useState([]);
	useEffect(() => {
		fetch("https://api.coinpaprika.com/v1/tickers")
			.then((response) => response.json())
			.then((json) => {
				setCoins(json); // 상태에 데이터 할당
				setLoading(false); // 기존 로딩 완료 시 false로 전환
			});
	}, []); // 1회만 사용되도록 의존하는 상태를 비웁니다.
	return (
		<div>
			<h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
			{loading ? (
				<strong>Loading...</strong>
			) : (
				<ul>
					{coins.map((coin) => (
						// index 대신 coin 데이터 내부의 id를 사용
						<li key={coin.id}>
							{coin.name} ({coin.symbol}): $
							{coin.quotes.USD.price} USD
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default App;
