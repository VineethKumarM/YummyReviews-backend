import React,{useContext,useRef,useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import FontAwesomeIcon
import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import  '@fortawesome/fontawesome-free-solid'
import { UserContext } from "../App";
import Mapview from "./Mapview";


// let b=false;
//font awesome packages
    // "@fortawesome/fontawesome-free-regular": "^5.0.13",
    // "@fortawesome/fontawesome-free-solid": "^5.0.13",
    // "@fortawesome/fontawesome-svg-core": "^6.1.1",
    // "@fortawesome/free-regular-svg-icons": "^6.1.1",
    // "@fortawesome/free-solid-svg-icons": "^6.1.1",



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

	const favpost = (id) => {
		const jwt = localStorage.getItem("jwt");
		if(!jwt) history('/login');
		fetch('/favpost', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body:JSON.stringify({
				foodId:id,
			})
		}).then(
			res => {console.log(res);}
		)
	}

	const likepost = (id) => {
		// console.log(1);
		const jwt = localStorage.getItem("jwt");
		// console.log(jwt);
		if(!jwt) history('/login');
		fetch('/like', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body:JSON.stringify({
				foodId:id,
			})
		}).then(
			res => {
				console.log(res);
				// if(res.status == 401) history('/')
			}
		)
	
	}
	
	
	const unlikepost = (id) => {
		const jwt = localStorage.getItem("jwt");
		if(!jwt) history('/login');
		fetch('/unlike', {
			method:"put",
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Bearer " + jwt
			},
			body: JSON.stringify({
				foodId:id,
			})
		}).then(
			 res => {console.log(res);})
		
	}

	const deletePost = (postid)=>{
        fetch(`/delPost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            // const newData = data.filter(item=>{
            //     return item._id !== result._id
            // })
            // setData(newData)
        })
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
		if (pos.length==0) {
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

		let cnt=0;
		return (
			<div className="home">
			{
			pos.map(post =>  
				
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
							src={"../public/images/"+post.photo}
							alt="image"
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

// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/streets-v11', // style URL
//     center: [-74.5, 40], // starting position [lng, lat]
//     zoom: 9 // starting zoom
// });


