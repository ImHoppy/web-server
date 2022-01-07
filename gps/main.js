const access_token = "pk.eyJ1IjoiaW1ob3BweSIsImEiOiJja3k0OXB4bHEwOXgzMm9vMzkwbjhzaGtoIn0.Frx5osoLqe-Q1dD0PKEwbA";
class Pos {
	constructor(latitude, longitude, date) {
		this.date = date;
		this.latitude = latitude;
		this.longitude = longitude;
		this.data;
	}
	
	async getdata() {
		this.data = await getJSON(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitude},${this.latitude}.json?access_token=${access_token}`);
	}
	get fullAddress() {
		return (this.data.features[0].place_name)
	}

	get Address() {
		return (this.data.features[0].text)
	}

	get getCode() {
		return (this.data.features[1].text)
	}

	get getCity() {
		return (this.data.features[2].text)
	}

	get getRegion() {
		return (this.data.features[3].text)
	}

	get getCountry() {
		return (this.data.features[4].text)
	}
}

const getJSON = async (url) => {
	let result;
	const response = await fetch(url)
	const payload = await response.json();
	console.log(payload)
	return (payload);
};



function getDistanceFromLatLonInKm(pos1, pos2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(pos2.latitude-pos1.latitude);
	var dLon = deg2rad(pos2.longitude-pos1.longitude); 
	var a = 
	Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(deg2rad(pos1.latitude)) * Math.cos(deg2rad(pos2.latitude)) * 
	Math.sin(dLon/2) * Math.sin(dLon/2)
	; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // km
	return d + 0.0;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

function calculateKpH(time, distance) {
	return (distance/time)
}

$(document).ready(async () => {

	let pos = await getJSON('http://hoppy.phserv.net:8080/gps/pos.json');


	function main() {
		let posArray = [];
		pos.forEach(element => {
			posArray.push([element.longitude, element.latitude]);
		});
		
		// TO MAKE THE MAP APPEAR YOU MUST
		// ADD YOUR ACCESS TOKEN FROM
		// https://account.mapbox.com
		mapboxgl.accessToken = access_token;
		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [2.24983763, 48.71646084],//[-122.486052, 37.830348],
			zoom: 13
		});

		map.on('load', () => {
			map.addSource('route', {
				'type': 'geojson',
				'data': {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': posArray
					}
				}
			});
			map.addLayer({
				'id': 'route',
				'type': 'line',
				'source': 'route',
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#1E90FF',
					'line-width': 8
				}
			});
		});
	}
	main()
	let lastpos = new Pos(pos[Object.keys(pos).length - 1].latitude, pos[Object.keys(pos).length - 1].longitude, pos[Object.keys(pos).length - 1].date);
	let lastoflastpos = new Pos(pos[Object.keys(pos).length - 2].latitude, pos[Object.keys(pos).length - 2].longitude, pos[Object.keys(pos).length - 2].date);
	console.log(lastpos)
	await(lastpos.getdata().then(() => {
		$("div#position").text(lastpos.fullAddress);
		let sec = (lastpos.date - lastoflastpos.date).toFixed(2) / 1000
		let minute = parseFloat((sec/60).toFixed(4))
		let mps = getDistanceFromLatLonInKm(lastoflastpos, lastpos)*1000 / sec
		let kph = mps * 3.6
		$("div#km").text(kph.toFixed(2) + " Km/h");
	}))
});