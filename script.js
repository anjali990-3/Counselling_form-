import { Country, State, City } from 'https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/+esm';

window.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect');
    const countries = Country.getAllCountries();
    
    countries.forEach(country => {
        let option = document.createElement('option');
        option.value = country.name;
        option.text = `${country.flag || ''} ${country.name}`;
        option.dataset.isoCode = country.isoCode;
        countrySelect.appendChild(option);
    });
});

window.onCountryChange = function() {
    const countrySelect = document.getElementById('countrySelect');
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const countryCode = selectedOption.dataset.isoCode;

    stateSelect.innerHTML = '<option value="" disabled selected>Select Your State / Province</option>';
    citySelect.innerHTML = '<option value="" disabled selected>Select Your City / Location</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;

    if (countryCode) {
        const states = State.getStatesOfCountry(countryCode);
        if (states && states.length > 0) {
            states.forEach(state => {
                let option = document.createElement('option');
                option.value = state.name;
                option.text = state.name;
                option.dataset.stateCode = state.isoCode;
                option.dataset.countryCode = countryCode;
                stateSelect.appendChild(option);
            });
            stateSelect.disabled = false;
        } else {
            let option = document.createElement('option');
            option.value = countrySelect.value;
            option.text = "General / " + countrySelect.value;
            stateSelect.appendChild(option);
            stateSelect.disabled = false;
        }
    }
};

window.onStateChange = function() {
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];
    const stateCode = selectedOption.dataset.stateCode;
    const countryCode = selectedOption.dataset.countryCode;

    citySelect.innerHTML = '<option value="" disabled selected>Select Your City / Location</option>';
    citySelect.disabled = true;

    if (stateCode && countryCode) {
        const cities = City.getCitiesOfState(countryCode, stateCode);
        if (cities && cities.length > 0) {
            cities.forEach(city => {
                let option = document.createElement('option');
                option.value = city.name;
                option.text = city.name;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } else {
            let option = document.createElement('option');
            option.value = stateSelect.value;
            option.text = "General / " + stateSelect.value;
            citySelect.appendChild(option);
            citySelect.disabled = false;
        }
    }
};

const formForm = document.getElementById('webinarForm');
if (formForm) {
    formForm.addEventListener('submit', function() {
        setTimeout(function() {
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('thankyou-container').style.display = 'block';
        }, 500);
    });
}