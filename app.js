const totalInfected = document.querySelector(".total__cases");
const totalDeath = document.querySelector(".total__deaths");
const totalRecovered = document.querySelector(".total__recovered");
const lastUpdate = document.querySelector(".last__update");
const countrySelector = document.querySelector(".country-selector");
const countryInfo = document.querySelector(".info-block");
const countryInfected = document.querySelector(".country-infected");
const currentDate = document.querySelector(".current-date");
const imageSection = document.querySelector(".graph-section");

let data = {
  lastUpdate: "",
  total: {
    confirmed: 0,
    deaths: 0,
    recovered: 0,
  },
  countries: [],
};

let date;
let today = new Date();
let todayDisplay = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
let yesterday = new Date(today.setDate(today.getDate() - 1));
let yesterdayDisplay = `${yesterday.getDate()}-${yesterday.getMonth()}-${yesterday.getFullYear()}`;
console.log(today.toString().substr(0, 15));
console.log(`Today is ${typeof today}`);
console.log(`Yesterday was ${yesterdayDisplay}`);

// currentDate.innerHTML = today.toString().substr(0, 15);

// Get

function convert(num) {
  return Number(num).toLocaleString();
}
// ===FIND TOTAL CASES ===

const url1 = "https://covid19.mathdro.id/api";
fetch(`${url1}`)
  .then((response) => response.json())
  .then((apiData) => {
    console.log(apiData);
    // ==Add data from API to the data structure==
    data.total.confirmed = apiData.confirmed.value;
    data.total.deaths = apiData.deaths.value;
    data.total.recovered = apiData.recovered.value;
    data.lastUpdate = apiData.lastUpdate;
    // ==INSERT RESULTS TO UI==
    totalInfected.innerHTML = convert(data.total.confirmed);
    totalDeath.innerHTML = convert(data.total.deaths);
    totalRecovered.innerHTML = convert(data.total.recovered);
    lastUpdate.innerHTML = data.lastUpdate.toString().substring(0, 19);

    //     imageSection.innerHTML = `<img src="https://covid19.mathdro.id/api/og" alt = "loading.."">`;
  });

// ===FIND  COUNTRIES AFFECTED
const url2 = "https://covid19.mathdro.id/api/countries";
fetch(`${url2}`)
  .then((response) => response.json())
  .then((apiData) => {
    console.log(apiData.countries);
    //  == GET COUNTRIES TO DATA STRUCTURE
    apiData.countries.forEach((country) => {
      data.countries.push(country.name);
      countrySelector.innerHTML += `<option class = "currency-picked " value = ${country.name}>${country.name}</option>
               
                `;
    });
  });

// ===CASES PER REGION

function displayData() {
  let country;

  data.countries.forEach((region) => {
    if (country === region) {
      fetch(`https://covid19.mathdro.id/api/countries/${country}`)
        .then((response) => response.json())
        .then((apiData) => {
          console.log(apiData.confirmed.value);
          //   element = `<h3 class = "country-infected">Total infected: ${apiData.confirmed.value}</h3>`;
          //   countryInfo.insertAdjacentHTML("afterbegin",element);
        });
    }
  });
}

function displaySummary(event) {
  let country;
  country = event.target.value;
  countryInfo.innerHTML = "";
  data.countries.forEach((region) => {
    if (region === country) {
      renderLoader(imageSection);
      fetch(`https://covid19.mathdro.id/api/countries/${country}`)
        .then((response) => response.json())
        .then((apiData) => {
          console.log(apiData.confirmed.value);
          clearLoader();
          element = `<h1 class = "title">${country}</h1>
                                
                                        <div class = "stats">
                                           <div class="stats__country">
                                                <h3 class = "country-infected">Infected </h3>
                                                <h4>${Number(
                                                  apiData.confirmed.value
                                                ).toLocaleString()}</h4>
                                           </div>
                                           <div class="stats__country"> 
                                                <h3 class = "country-deaths">Deaths </h3>
                                                <h4>${convert(
                                                  apiData.deaths.value
                                                )}</h4>
                                           </div>
                                           <div class="stats__country"> 
                                                <h3 class = "country-recovered">Recovered</h3>
                                                <h4>${convert(
                                                  apiData.recovered.value
                                                )}</h4>
                                           </div>
                                        </div>`;
          countryInfo.insertAdjacentHTML("afterbegin", element);
          imageSection.innerHTML = `<img src="https://covid19.mathdro.id/api/countries/${country}/og" alt="">`;
          // clearLoader();
        });
    }
  });
}

//   ===DISPLAY COUNTRY'S SUMMARY
countrySelector.addEventListener("change", displaySummary);
const renderLoader = (parent) => {
  const loader = `
            <div class = "loader">
                <img class = "spinner" src = "./images/249.gif" alt = "loading.." />    
            </div>
        `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

const clearLoader = () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
};

//  ===STATS PER DAY==
// fetch(`https://covid19.mathdro.id/api/daily`)
// .then(response =>response.json())
// .then(apiData =>{
//         console.log(apiData);
//         apiData.forEach(country =>{
//                 console.log(country.confirmed.total);
//         })

// })

// fetch(`https://covid19.mathdro.id/api/countrieog`)
// .then(response =>response.json())
// .then(apiData =>{
//         console.log(apiData)
// })

console.log(data);
