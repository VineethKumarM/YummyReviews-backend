import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const NewPost = () => {
	const [title, setTitle] = useState("");
	const [body, setbody] = useState("");
	const [location, setlocation] = useState("");
	const [hotel, sethotel] = useState("");
	const [image, setimage] = useState("");
	const history = useNavigate();
	const PostData = () => {
		if (!title || !body || !image || !location || !hotel)
			return alert("all fields are compulsory");
		
		const formData = new FormData();
		formData.append("title", title);
		formData.append("body", body);
		formData.append("photo", image);
		formData.append("hotel", hotel);
		formData.append("location", location);
		const auth = "Bearer " + localStorage.getItem("jwt"); 
		fetch("/newPost", {
			method: "post",
			headers: {
				"Authorization": auth,
				// "Content-Type": "application/json",
			},
			body: formData,
			// formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					alert(data.error);
				} else {
					console.log(data);
					history("/");
				}
			})
			.catch((err) => {
				console.log("server sent error", err);
			});
	};

	return (
		<div
			className="card postForm auth-card"
			style={{
				margin: "10px auto",
				maxWidth: "300px",
				textAlign: "center",
				padding: "40px 20px",
			}}
		>
			{/* <label htmlFor="title">Title</label> */}
			{/* <form action="/newPost" method="post"> */}
			<p className="card-text">
				<label htmlFor="">
					Title:
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="title"
					/>
				</label>
			</p>

			{/* <p className="card-text file-field input-field"> */}
			<div className="btn card-text file-field input-field">
				{/* <label htmlFor="">
					File: */}
				<input
					type="file"
					accept=".png, .jpg, .jpeg"
					name="photo"
					onChange={(e) => {
						setimage(e.target.files[0]);
						// console.log(image);
					}}
				/>
				{/* </label> */}
			</div>
			{/* </p> */}
			<p className="card-text">
				<label htmlFor="">
					Description:
					<input
						type="text"
						id="body"
						name="body"
						placeholder="description"
						value={body}
						onChange={(e) => setbody(e.target.value)}
					/>
				</label>
			</p>
			<p className="card-text">
				<label htmlFor="">
					Restaurant:
					<input
						type="text"
						id="hotel"
						name="hotel"
						placeholder="hotel"
						value={hotel}
						onChange={(e) => sethotel(e.target.value)}
					/>
				</label>
			</p>
			<p className="card-text">
				<label htmlFor="">
					Location:
					<input
						type="text"
						id="location"
						name="location"
						placeholder="location"
						value={location}
						onChange={(e) => setlocation(e.target.value)}
					/>
				</label>
			</p>

			<Link to="/"> Cancel</Link>
			<button
				className="btn btn-primary"
				type="submit"
				onClick={() => PostData()}
			>
				Post
			</button>
			{/* </form> */}
			{/* //add location input later */}
		</div>
	);
};

export default NewPost;
