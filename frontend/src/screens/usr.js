import React from "react";
import Posts from "../components/Posts";
import { useParams} from "react-router-dom";
import { useEffect } from "react";
const Usr = () => {

	const {name} = useParams()
	const [applications,setapplications] = React.useState(null)
	const auth = "Bearer " + localStorage.getItem("jwt"); 

	const [user,setuser] =React.useState(null) 
	useEffect(()=> {
		fetch(`/usr/${name}`, {
			method: "get",
			headers: {
				// "Content-Type": "application/json",
			},
		}).then(res=>res.json())
		.then((response) =>{
			// console.log(response);
			setuser(response.savedUser)
			setapplications((response.foods))
		})
	})

	if(!applications || !user){
		return (
			<h1>
				Loading
			</h1>
		)
	}
	else {
	user.password=null
		let pos = Array.from(applications)

		return (
			<div className="d-flex main-profile" >
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
						<h6>Favourited {user.favourites.length>0? user.favourites.length: "no"} posts</h6>

						</div>
					</div>
				</div>

				<div className="p-2 slider flex-fill bd-highlight">
				
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
						<div className="inContent" style={{ textAlign: "left" }}>
							{

								auth ? user.likes.map(p =>
									console.log(user.likes)
								) : <h6>Liked {user.likes.length>0? user.likes.length: "no"} posts</h6>

								
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Usr;

