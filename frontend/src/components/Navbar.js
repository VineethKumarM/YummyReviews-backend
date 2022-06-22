import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	let { state, dispatch } = useContext(UserContext);
	const history = useNavigate()
	let jwt = localStorage.getItem("jwt")
	if(jwt) {
		state=true;
	}


	const renderList = () => {
		if (state) {
			return [
				<span>
					<Link to="/profile">Profile</Link>
					<Link to="/newPost">new post</Link>
					<button className="btn btn-primary" onClick={() => {
							localStorage.clear();
							// localStorage.removeItem("jwt")
							// localStorage.removeItem("user")
							dispatch({type:"CLEAR"})
							history('/')
						}
						}>
						Logout
					</button>
				
				</span>
			];
		} else {
			return [
				<span>
					<Link to="/login">login</Link>
					<Link to="/signup">sign up</Link>
					
				</span>,
			];
		}
	};

	return (
		<nav className="navbar">
			<h2 className="logo">
				<Link to="/"> YummyReviews</Link>{" "}
			</h2>
			<div className="navlinks">{renderList()}</div>
		</nav>
	);
};

export default Navbar;
