import React from "react";

export default function PostCard(post) {
	// console.log("hiii");
	// console.log(post);
		return (
			<div className="card home-card">
				<div className="top" style={{ textAlign: "left" }}>
				<h6>{post.title}</h6>
				{/* <p>author</p> */}
				<i className="bi bi-bookmark-fill"></i>
				</div>
				<div className="photo"
				>
					<img
						className="post-img"
						src="../Untitled-1.png"
						alt=""
					/>
				</div>
				<div className="buttom">
					<p>
						{post.body}
					</p>
				</div>
			</div>
		)

		

	}