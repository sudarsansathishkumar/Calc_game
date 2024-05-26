import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
	const min = 2;
	const max = 100;
	const omax = 4  		// It defines the operations (1 = addition only, 2 = add + sub, 3 = add + sub + mul, 4 = add + sub + mul + div)
	const maxques = 10;  	// Number of questions
	const maxtiming = 10;  	// Seconds for each questions
	const [score, setscore] = useState(0);
	const [time, settime] = useState(maxtiming);
	const timer = useRef();
	const [f, setf] = useState(1);  		// First number
	const [s, sets] = useState(1);  		// Second number
	const [a, seta] = useState();   		// Answer
	const [o, seto] = useState('+');		// Operation
	const [count, setcount] = useState(1);	// To count number of questions went

	const fixquestion = () => {
		const fi = Math.floor(Math.random() * (max - min + 1)) + min;
		setf(fi);
		const op = Math.floor(Math.random() * (omax - 1 + 1)) + 1;
		if(op === 1) {
			const se = Math.floor(Math.random() * (max - min + 1)) + min;
			sets(se);
			seto("+");
			seta(fi + se);
		}
		else if(op === 2) {
			const se = Math.floor(Math.random() * (fi - min + 1)) + min;  // For subtraction second number will not exceed the first number
			sets(se);
			seto("-");
			seta(fi - se);
		}
		else if(op === 3) {
			const se = Math.floor(Math.random() * (16 - min + 1)) + min;  // For multiplication second number will not be greater than 16
			sets(se);
			seto("*");
			seta(fi * se);
		}
		else if(op === 4) {
			const se = Math.floor(Math.random() * (10 - min + 1)) + min;  // For division the range in from 2 to 10
			sets(se);
			seto("/");
			seta(Math.round(((fi / se) + Number.EPSILON) * 100) / 100);   // For division the answer will be precised to 2 decimal points
		}
	}

	const handlesubmit = (e) => {
		if(parseFloat(e.target.value) === parseFloat(a)) {
			setscore(score + 1);
			setcount(count + 1);
			if(count < maxques){
				settime(maxtiming);
				e.target.value = '';
				fixquestion();
			}
			else {
				clearInterval(timer.current);
				settime(0);
			}
		}
	}

	// To start the quiz
	useEffect(() => {
		fixquestion();
	}, []);

	// eslint-disable-next-line
	useEffect(() => {
		if(count <= maxques) {
			timer.current = setInterval(() => {
				settime(time - 1);
			}, 1000)
			if(time < 0) {
				clearInterval(timer.current);
				// setscore(score - 1);
				setcount(count + 1);
				if(count < maxques){
					fixquestion();
					settime(maxtiming);
				}
				else settime(0);
			}
			return () => clearInterval(timer.current)
		}
	})

	return (
		<div className="App">
			<div className="desc">
				<h1>
					Addition 
					{omax > 1 ? <>, Subtraction</> : <></>}
					{omax > 2 ? <>, Multiplication</> : <></>}
					{omax > 3 ? <>, Division</> : <></>}
				</h1>
			</div>
			
			{
				count <= maxques ? 
					<>
						<div className="timerpanel">
							<h2>
								CountDown : {time} , Question : {count} / {maxques}
							</h2>
						</div>
						<div className="qpanel">
							<h1 className="question f">
								{f}
							</h1>
							<h1 className="question o">
								{o}
							</h1>
							<h1 className="question s">
								{s}
							</h1>
							<h1> = </h1>
							<input type="number" className="answer" onChange={handlesubmit} autoFocus={true} />
						</div>
						<div className="cpanel">
							<h2>
								Score : {score}
							</h2>
						</div>
					</>
				: 
					<>
						<h1>
							Your Score is {score} / {maxques}
						</h1>
						<h3>
							Your Percentage : {score * 100 / maxques}%
						</h3>
						<input type="button" value="Replay" onClick={() => window.location.reload()} autoFocus={true} />
					</>
			}
		</div>
	);
}

export default App;