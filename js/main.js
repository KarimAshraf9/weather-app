const userInput = document.querySelector(".userrInputSearch input");
const buttonInput = document.querySelector(".userrInputSearch button");

buttonInput.addEventListener("click", displayWeatherData);

navigator.geolocation.getCurrentPosition(
  (location) => {
    getData(`${location.coords.longitude},${location.coords.latitude}`);
  },
  (error) => {
    console.log("error", error);
  }
);

function displayWeatherData() {
  const searchLocation = userInput.value;
  if (!searchLocation) {
    return alert("Please enter country name");
  }
  getData(userInput.value);
}

function getTodayData(day, location) {
  const forecastDate = day.last_updated.split(" ", 1)[0];
  const forecastDateDescriptive = new Date(forecastDate);
  const forecastWeekDay = forecastDateDescriptive.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const forecastDayMonth =
    forecastDateDescriptive.toLocaleDateString("en-US", { day: "numeric" }) +
    ` ` +
    forecastDateDescriptive.toLocaleDateString("en-US", { month: "long" });

  return `
        <div class="col-lg-4 p-0 pb-2 today">
            <div class="forecastDate px-2 d-flex justify-content-between align-items-center">
                <p class="mb-0">${forecastWeekDay}</p>
                <p class="mb-0">${forecastDayMonth}</p>
            </div>
            <div class="forecastbody  p-3">
                <p class="mt-3 mb-0">${location.name}</p>
                <p class="temp fw-bold text-white">${day.temp_c}&#8451</p>
                <figure>
                    <img src="${day.condition.icon}" alt="">
                    <figcaption class="mt-2">
                        <p class="fw-light info">${day.condition.text}</p>
                    </figcaption>
                </figure>
            </div>
            <div class="forecastfoot  p-3">
                <ul class="list-unstyled d-flex">
                    <li class="me-4"><img src="./images/icon-umberella.png" alt=""> 20%</li>
                    <li class="me-4"><img src="./images/icon-wind.png" alt=""> 18km/h</li>
                    <li class="me-4"><img src="./images/icon-compass.png" alt=""> East</li>
                </ul>
            </div>
        </div>
    `;
}

function getForecastDay(day) {
  const date = new Date(day.date);
  const forecastWeekDay = date.toLocaleDateString("en-US", { weekday: "long" });

  return `
        <div class="col-lg-4 p-0 tomorrow d-flex flex-column">
            <div class="forecastDate text-center">
                <p class="mb-0">${forecastWeekDay}</p>
            </div>
            <div class="forecastbody flex-grow-1 text-center py-5">
                <figure class="h-100 mb-0">
                    <img src="${day.day.condition.icon}" class="mb-4" alt="">
                    <figcaption>
                        <p class="tempMax fw-bold mb-1 text-white fs-4">${day.day.maxtemp_c} &#8451</p>
                        <p class="tempMin fw-light">${day.day.mintemp_c} &#8451</p>
                        <p class="fw-light info">${day.day.condition.text}</p>
                    </figcaption>
                </figure>
            </div>
        </div>
    `;
}

function getData(queryParams) {
  const data = new XMLHttpRequest();
  data.open(
    "get",
    `http://api.weatherapi.com/v1/forecast.json?key=d9b110a8d13a48d6b24215512241306&q=${queryParams}&days=3`
  );
  data.send();

  data.addEventListener("loadend", function () {
    const response = JSON.parse(data.response);
    if (data.status >= 200 && data.status <= 299) {
      showData(response);
    } else {
      alert(response.error.message);
    }
  });
}

function showData(response) {
  let cartoona = getTodayData(response.current, response.location);
  cartoona += getForecastDay(response.forecast.forecastday[1]);
  cartoona += getForecastDay(response.forecast.forecastday[2]);

  document.querySelector(".forecast .row").innerHTML = cartoona;
}

