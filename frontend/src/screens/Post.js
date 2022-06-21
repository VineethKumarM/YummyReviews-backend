import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Posts from "../components/Posts";
const Post = () => {
	React.useEffect(() => {
			fetchDetails()
		}, []);
	
	const {id} = useParams();
	const [postData,setpostData] = React.useState(null)
	const auth = "Bearer " + localStorage.getItem("jwt"); 
	const fetchDetails = async() => {
		const response = await axios.get(`/post/${id}`, {
			headers: {
				"Authorization": auth,
			},
		})
		if(response){

			setpostData((response.data.foods))
			console.log(response,postData);
		}
	}

	if(!postData){
		return (
			<h1>
				Loading
			</h1>
		)
	}
	else {
		// console.log(postData);
		return(

			<div className="home">
			<Posts  applications={postData} flag={false}/>
			
			</div> 
		)
	}
	
	
};

export default Post;
