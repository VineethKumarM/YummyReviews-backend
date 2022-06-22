import React,{useContext,useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import  '@fortawesome/fontawesome-free-solid'
import { UserContext } from "../App";
import Mapview from "./Mapview";

export default function Posts(data) {

	const {state,dispatch} = useContext(UserContext)
	const [coord,setcoord] = useState([78.265199,18.045879])
	const [hotel, sethotel] = useState("");
	const [modalState,setmodalState] = useState(true)
	const history=useNavigate()


	function openModal() {
		setmodalState(!modalState)
	}


	const isLiked = function(list) {
		const user = localStorage.getItem("jwt");
		if(list.includes(user)) return "icon clicked"
		return "icon"
	}

	const favpost = async (id) => {
		const jwt = localStorage.getItem("jwt");
		if(!jwt) history('/login');
		let res  = await fetch('/favpost', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body:JSON.stringify({
				foodId:id,
			})
		})
		console.log(res);
	}

	const likepost = async (id) => {

		const jwt = localStorage.getItem("jwt");

		if(!jwt) history('/login');
		let res  = await  fetch('/like', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body:JSON.stringify({
				foodId:id,
			})
		})
		console.log(res);
	
	}
	
	
	const unlikepost = async (id) => {
		const jwt = localStorage.getItem("jwt");
		if(!jwt) history('/login');
		let res  = await fetch('/unlike', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body: JSON.stringify({
				foodId:id,
			})
		})
		console.log(res);
		
	}

	const deletePost = async (postid)=>{
        let res  = await fetch(`/delPost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
		let result = await res.json()
        console.log(result)

    }


	if(!data.applications){
		return (
			<h1>
				Loading
			</h1>
		)
	}
	else {
		let pos = Array.from(data.applications)
		if (pos.length===0) {
			return (
					<div className="card home-card">
						<div className="top">
							<h6>Sample Post</h6>
							<span>author</span>
							<div className="top-right">
								
							<FontAwesomeIcon className="icon" icon="fa-heart" />
							</div>
						</div>
						<div className="photo">
							<img
								className="post-img"
								src="./images/demo.webp"
								alt=""
							/>
						</div>
						<div className="buttom">
							<p>
								<i>Post Description</i> Lorem ipsum dolor, sit amet consectetur adipisicing
								elit. Neque, facere quos vero!
							</p>
							<FontAwesomeIcon className="icon " icon="thumbs-up" />
							<span>10</span>
							<div className="buttom-right">
								<span>
								<FontAwesomeIcon className="icon" icon="map-pin" onClick={() => {
									setcoord([14,14]);
									sethotel("Chandrabhavan")
									openModal();
									}}/>location</span>
							</div>
						</div>	

						<Mapview toggle = {modalState} points={coord} hotel={hotel} action={openModal}></Mapview>

					</div>
					
			)
		}

		return (
			<div className="home">
			{
			pos.reverse().map(post =>  
				
					<div className="card home-card" key={post._id}>
						<div className="top" style={{ textAlign: "left" }}>
							
							<div className="top-left" style={{float:"left"}}>
								<div><h4>{post.title}</h4></div>
								<div>
									<Link to={state && post.postedBy._id != state._id ? "/profile/"+post.postedBy.name : "/profile"}>
										<span>{post.postedBy.name.length>12 ?  post.postedBy.name.slice(0,12) + "..." : post.postedBy.name }</span>
									</Link>
								</div>
							</div>
							
							<div className="top-right">
								{data.flag && post.postedBy._id == state._id &&
									<FontAwesomeIcon className="icon" icon="trash" onClick={()=>deletePost(post._id)}/>
								
								}

								{state && state.favourites && state.favourites.includes(post._id)
									? 
									<FontAwesomeIcon className="icon clicked" icon="heart"/>
									: 
									<FontAwesomeIcon className="icon" icon="heart" onClick={(e) =>{
											favpost(post._id)
											e.target.parentNode.classList.add('clicked')

									}}/>
								}
							</div>
						</div>

					<div className="photo">
						<img
							className="post-img"
							src={post.photo}
							alt="Food Item"
						/>
					</div>
					<div className="buttom">
						<p>
							{post.body}
						</p>
						{state && post.likes.includes(state._id)
                            ? 
							<FontAwesomeIcon className="icon clicked" icon="thumbs-up" onClick={(e) =>{
												
									unlikepost(post._id)
									e.target.parentNode.classList.remove('clicked')

								}}/>

                            : 
							<FontAwesomeIcon className="icon" icon="thumbs-up" onClick={(e) =>{
									
									likepost(post._id)
									e.target.parentNode.classList.add('clicked')

							}}/>

                            }
							
						<span>{post.likes.length} likes</span>
						<div className="buttom-right">
							<span>
								<FontAwesomeIcon className="icon" icon="map-pin" onClick={() => {
									setcoord(post.location.coordinates);
									sethotel(post.hotel);
									// console.log(coord);/
									openModal();
									}}/>location
							</span>

						</div>
					</div>
				</div>
				)}
				
				<Mapview toggle = {modalState} points={coord} hotel={hotel} action={openModal}></Mapview>
			
			</div> 
			
		)
	}
	
	
};


