import react, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Signup = () => {
	const history = useNavigate();
	const [name, setName] = useState("");
	const [email, setemail] = useState("");
	const [image, setimage] = useState("./images/profile.jpg");
	const [password, setpassword] = useState("");
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
		fetch("/signup", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				password,
				image
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					alert(data.error);
				} else {
					alert(data.message);
					history("/login");
				}
			})
			.catch((err) => {
				console.log("There is some error");
			});
	};

	return (
		<div className="mycard">
			<div className="card auth-card ">
				<h2>Sign up</h2>

				<p className="card-text">
					<img src="./images/profile.jpg" alt="user image" style={{width: "120px",height:"120px"}}/>
				</p>

				<div className="btn card-text file-field input-field">
					<input
						type="file"
						accept=".png, .jpg, .jpeg"
						name="photo"
						placeholder="Select User Image"
						onChange={(e) => {
							setimage(e.target.files[0]);
						}}
					/>
				</div>
				<p className="card-text">
					<input
						type="text"
						name="name"
						id="name"
						placeholder="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</p>
				<p className="card-text">
					<input
						type="email"
						name="email"
						id="email"
						placeholder="email"
						value={email}
						onChange={(e) => setemail(e.target.value)}
					/>
				</p>
				<p className="card-text">
					<input
						type="password"
						name="password"
						id="password"
						placeholder="password"
						value={password}
						onChange={(e) => setpassword(e.target.value)}
					/>
				</p>
			

				<button className="btn btn-primary" onClick={() => PostData()}>
					Sign Up
				</button>

				<p>
					<Link to="/login"> Already have an account?</Link>
				</p> 
			</div>
		</div>
	);
};

export default Signup;
