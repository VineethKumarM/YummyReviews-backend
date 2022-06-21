import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
const geoCoder = require('@mapbox/mapbox-sdk/services/directions')

const dirc = geoCoder({ accessToken: 'pk.eyJ1IjoidmluZWV0aGt1bWFybSIsImEiOiJjbDRtOXBqMWkxMzk3M2RtaHk5enNldDdlIn0.48Z2Y_aage38ZnfMdch8eA'});




mapboxgl.accessToken = 'pk.eyJ1IjoidmluZWV0aGt1bWFybSIsImEiOiJjbDRtOXBqMWkxMzk3M2RtaHk5enNldDdlIn0.48Z2Y_aage38ZnfMdch8eA';

export default function Modal (props) {
	console.log(props.hotel);
	const modalState=props.toggle
	const action = props.action
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [zoom, setZoom] = useState(9);


	useEffect(() => {
		if (map.current) map.current = null;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [props.points[0], props.points[1]],
			zoom: zoom
		});
		new mapboxgl.Marker().setLngLat([props.points[0], props.points[1]])
		.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h2>Hotel ${props.hotel}</h2>`))
		.addTo(map.current);

		map.current.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true,
			showUserHeading: true
		}));

		// map.current.addControl(
		// 	new MapboxGeocoder({
		// 	accessToken: mapboxgl.accessToken,
		// 	mapboxgl: mapboxgl
		// 	})
		// )
	});


	return (
		<div className={` ${modalState ? "hide" : null}`}>
		<div className={`deactive ${modalState ? "hide" : null}`}></div>
			<div className={`container`}>
				<div className="modal">
					<div>
						<div ref={mapContainer} className="map-container" />
					</div>
					<div className="close" onClick={action}></div>

				</div>

			</div>
		</div>
	)
}



