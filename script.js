const apiKey = "dc870223e3c5cb24ee61b8734a9dcac7";
const suggestionsBox = document.getElementById("suggestions");
searchBox.addEventListener("input", () => {
	const query = searchBox.value.trim();
	if (query.length > 2) {
		const api = new XMLHttpRequest();
		api.open(
			"GET",
			`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
				query
			)}&limit=5&appid=${apiKey}`
		);

		api.onreadystatechange = () => {
			if (api.readyState === 4 && api.status === 200) {
				try {
					const geoData = JSON.parse(api.responseText);
					console.log(geoData);
					updateSuggestions(geoData);
				} catch (error) {
					console.error("Error parsing suggestion data:", error);
				}
			}
		};

		api.send();
	}
});

function updateSuggestions(geoData) {
	suggestionsBox.innerHTML = "";
	geoData.forEach((location) => {
		const option = document.createElement("div");
		option.innerHTML = `${location.name}, ${location.country}`;
		option.onclick = () => {
			searchBox.value = location.name;
			suggestionsBox.innerHTML = "";
			fetchWeather(location.name);
		};
		suggestionsBox.appendChild(option);
	});
}

function fetchWeather(location) {
	const api = new XMLHttpRequest();
	api.open(
		"GET",
		`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
	);
	api.onreadystatechange = () => {
		if (api.readyState === 4) {
			if (api.status === 200) {
				try {
					const weatherData = JSON.parse(api.responseText);
					console.log("Current Weather:", weatherData);
					temp.innerHTML = Math.floor(weatherData.main.temp - 273.15);
					high.innerHTML = Math.floor(weatherData.main.temp_max - 273.15);
					low.innerHTML = Math.floor(weatherData.main.temp_min - 273.15);
					switch (weatherData.weather[0].icon.slice(0, 2)) {
						case "01":
							icon.src = "assets/01.svg";
							break;
						case "02":
							icon.src = "assets/02.svg";
							break;
						case "03":
							icon.src = "assets/03.svg";
							break;
						case "09":
							icon.src = "assets/09.svg";
							break;
						case "10":
							icon.src = "assets/10.svg";
							break;
						case "11":
							icon.src = "assets/11.svg";
							break;
						case "13":
							icon.src = "assets/13.svg";
							break;
						case "50":
							icon.src = "assets/50.svg";
							break;
						default:
							icon.src = "assets/02.svg";
							break;
					}
					hum.innerHTML = weatherData.main.humidity;
					ftemp.innerHTML = Math.floor(weatherData.main.feels_like - 273.15);
					cloud.innerHTML = weatherData.clouds.all;
					speed.innerHTML = Math.floor(weatherData.wind.speed);
				} catch (error) {
					console.error("Error parsing JSON response:", error);
				}
			}
		}
	};
	api.send();
}
