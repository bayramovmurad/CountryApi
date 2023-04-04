const btnSearch = document.querySelector("#btnSearch");
const details = document.querySelector("#details");
const countryDetails = document.querySelector("#country-details");
const neighbors = document.querySelector("#neighbors");
const errors = document.querySelector("#errors");


btnSearch.addEventListener("click", () => {
    const text = document.querySelector("#txtSearch").value;
    details.style.opacity = 0;
    getCountry(text);
});


// We got countries and their neighbor countries with fetch api
function getCountry(country) {
    // Country
    fetch('https://restcountries.com/v3.1/name/' + country)
        .then((response) => {
            // Error when entering wrong country
            if (!response.ok)
                throw new Error("Country not found");
            return response.json();
        })
        // Neighbors country
        .then((data) => {
            renderCountry(data[0]);
            const countries = data[0].borders;
            // Error when entering wrong neighbors country
            if (!countries)
                throw new Error("Neighbors country not found")
            return fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
        })
        .then(response => response.json())
        .then((data) => renderNeighbors(data))
        // to catch errors in console
        .catch(err => renderError(err))
}


// Here I got the information of the countries

function renderCountry(data) {
    countryDetails.innerHTML = "";
    neighbors.innerHTML = "";

    let html = `                   
            <div class="col-4">
                <img src="${data.flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-4">Population: </div>
                    <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
                </div>
                <div class="row">
                    <div class="col-4">Language: </div>
                    <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Capital: </div>
                    <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                    <div class="col-4">Currency: </div>
                    <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                </div>
                
            </div>
    `;
    details.style.opacity = 1;
    countryDetails.innerHTML = html;
}

// Here I got the information of the neighboring countries

function renderNeighbors(data) {
    let html = "";
    for (let country of data) {
        html += `
            <div class="col-2 mt-2">
                <div class="card">
                    <img src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;

    }
    neighbors.innerHTML = html;
}

// to print errors on the screen
function renderError(err) {
    let html = ''
    html = `
        <div class="alert alert-danger">
        ${err.message}
        </div>
    `;
    setTimeout(() => {
        errors.innerHTML = "";
    }, 3000);
    errors.innerHTML = html;
}