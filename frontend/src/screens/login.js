import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
const Login = () => {
	const history = useNavigate();
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");
	const { state, dispatch } = useContext(UserContext);

	const PostData = () => {
		if (
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			alert("Invalid Email");
			setemail("");
			setpassword("");
			return;
		}
		
		fetch("/login", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			// .then((res) => {
			// 	console.log(res);
			// 	res.json()})
			.then((data) => {
				console.log(data);
				if (data.error) {
					alert(data.error);
				} else {
					localStorage.setItem("jwt", data.token);
					localStorage.setItem("user", JSON.stringify(data.user));
					dispatch({ type: "USER", payload: data.user });
			
					history("/");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="mycard">
			<div className="card auth-card">
				<h2>Login</h2>
				<p className="card-text">
					<input
						type="email"
						placeholder="email"
						value={email}
						onChange={(e) => setemail(e.target.value)}
					/>
				</p>
				<p className="card-text">
					<input
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => setpassword(e.target.value)}
					/>
				</p>
				<button className="btn btn-primary" onClick={() => PostData()}>
					Login
				</button>
				<p>
					<Link to="/signup"> Don't have an account?</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
