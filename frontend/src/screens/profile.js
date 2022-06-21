import React from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import Posts from "../components/Posts";
import { Link } from "react-router-dom";

const Profile = () => {
	React.useEffect(() => {
		fetchDetails()
	}, []);
	
	const [applications,setapplications] = React.useState(null)
	const [user,setuser] =React.useState(null)
	const auth = "Bearer " + localStorage.getItem("jwt"); 
	const fetchDetails = async() => {
		const response = await axios.get('/profile', {
			headers: {
				"Authorization": auth,
			},
		})
		if(response){
			// console.log(response.data.user);
			setuser(response.data.userData)
			setapplications((response.data.foods))
		}
	}

	if(!applications || !user){
		return (
			<h1>
				Loading
			</h1>
		)
	}
	else {
	user.password=null
// console.log(user);
		let pos = Array.from(applications)

		return (
			<div className="d-flex main-profile">
				<div className="p-2 left flex-fill bd-highlight">
					<div className="card" style={{ padding: "20px" }}>
						<img
							style={{
								borderRadius: "50%",
								maxWidth: "150px",
								maxHeight: "150px",
							}}
							src={user.photo}
							alt=""
						/>
						<h5>{user.name.toUpperCase()}</h5>
						<div className="inContent" style={{ textAlign: "left" }}>

							<h6>Favourites</h6>
							{
								user.likes.length>0  ?
																	
									user.favourites.map(p =>
										<p> <Link to={"/post/" + p._id}>{p.title}</Link> </p>
									)
								: <p>Click <Link to="/">here</Link> to explore Reviews and make some favourites</p>
							}
							
							
						
						</div>
					</div>
				</div>

				<div className="p-2 slider flex-fill bd-highlight">
					{/* { if (pos.length>0) {
						<Posts data = {pos}></Posts>
					}} */}
					<Posts applications={pos} flag={true}></Posts>
				</div>

				<div className="p-2 right flex-fill bd-highlight">
					<div
						className="card"
						style={{
							padding: "30px",
							shadow: "inset 0px 8px 8px rgba(0, 0, 0, 0.25)",
						}}
					>
						<h4>Likes</h4>
						<div className="inContent" style={{ textAlign: "left",width: "8vw" }}>
							{	
								user.likes.length>0  ?
								user.likes.map(p =>
									// console.log(p),
									<h6> <Link to={"/post/" + p._id}>{p.title}</Link> </h6>
								)
								: <p>Click <Link to="/">here</Link> to explore Reviews </p>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Profile;

