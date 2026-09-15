import {
    Country,
    State,
    City
} from "https://cdn.jsdelivr.net/npm/country-state-city@3.2.1/+esm";


document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------
       GET HTML ELEMENTS
    -------------------------------- */

    const form = document.getElementById("webinarForm");

    const countrySelect =
        document.getElementById("countrySelect");

    const phoneCodeSelect =
        document.getElementById("phoneCodeSelect");

    const stateSelect =
        document.getElementById("stateSelect");

    const citySelect =
        document.getElementById("citySelect");

    const phoneInput =
        document.getElementById("phoneNumberInput");

    const fullPhoneInput =
        document.getElementById("fullPhoneInput");

    const formContainer =
        document.getElementById("form-container");

    const thankyouContainer =
        document.getElementById("thankyou-container");


    /* --------------------------------
       LOAD COUNTRIES
    -------------------------------- */

    const countries = Country.getAllCountries();


    countries.forEach((country) => {

        const option =
            document.createElement("option");

        option.value = country.name;

        /*
            IMPORTANT:
            No flags/emojis here.

            This keeps the dropdown simple
            and avoids unnecessary iOS Safari
            rendering issues.
        */

        option.textContent = country.name;

        option.dataset.isoCode =
            country.isoCode;

        countrySelect.appendChild(option);

    });


    /* --------------------------------
       LOAD PHONE CODES
    -------------------------------- */

    countries.forEach((country) => {

        if (!country.phonecode) {
            return;
        }

        const option =
            document.createElement("option");

        option.value =
            `+${country.phonecode}`;

        option.textContent =
            `+${country.phonecode} (${country.isoCode})`;

        option.dataset.isoCode =
            country.isoCode;

        /*
            India is selected by default.
        */

        if (country.isoCode === "IN") {
            option.selected = true;
        }

        phoneCodeSelect.appendChild(option);

    });


    /* --------------------------------
       PHONE VALIDATION
    -------------------------------- */

    function updatePhoneValidation() {

        const selectedOption =
            phoneCodeSelect.options[
                phoneCodeSelect.selectedIndex
            ];


        if (!selectedOption) {
            return;
        }


        const isoCode =
            selectedOption.dataset.isoCode;


        /*
            Clear previous validation.
        */

        phoneInput.removeAttribute("pattern");

        phoneInput.removeAttribute("minlength");

        phoneInput.removeAttribute("maxlength");


        /*
            INDIA
        */

        if (isoCode === "IN") {

            phoneInput.pattern = "[0-9]{10}";

            phoneInput.minLength = 10;

            phoneInput.maxLength = 10;

            phoneInput.placeholder =
                "10-digit mobile number";

        }


        /*
            USA / CANADA
        */

        else if (
            isoCode === "US" ||
            isoCode === "CA"
        ) {

            phoneInput.pattern = "[0-9]{10}";

            phoneInput.minLength = 10;

            phoneInput.maxLength = 10;

            phoneInput.placeholder =
                "10-digit number";

        }


        /*
            OTHER COUNTRIES
        */

        else {

            phoneInput.pattern = "[0-9]{7,12}";

            phoneInput.minLength = 7;

            phoneInput.maxLength = 12;

            phoneInput.placeholder =
                "Phone number";

        }

    }


    updatePhoneValidation();


    phoneCodeSelect.addEventListener(
        "change",
        updatePhoneValidation
    );


    /* --------------------------------
       PHONE INPUT
       NUMBERS ONLY
    -------------------------------- */

    phoneInput.addEventListener(
        "input",
        () => {

            phoneInput.value =
                phoneInput.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );


    /* --------------------------------
       COUNTRY CHANGE
    -------------------------------- */

    countrySelect.addEventListener(
        "change",
        () => {

            const selectedOption =
                countrySelect.options[
                    countrySelect.selectedIndex
                ];


            const countryCode =
                selectedOption.dataset.isoCode;


            /*
                Reset State
            */

            stateSelect.innerHTML =
                `<option value="" disabled selected>
                    Select Your State / Province
                </option>`;


            /*
                Reset City
            */

            citySelect.innerHTML =
                `<option value="" disabled selected>
                    Select Your City / Location
                </option>`;


            stateSelect.disabled = true;

            citySelect.disabled = true;


            /*
                Automatically select
                matching phone code.
            */

            const matchingPhoneOption =
                Array.from(
                    phoneCodeSelect.options
                ).find(
                    option =>
                        option.dataset.isoCode ===
                        countryCode
                );


            if (matchingPhoneOption) {

                phoneCodeSelect.value =
                    matchingPhoneOption.value;

                updatePhoneValidation();

            }


            /*
                Load States
            */

            if (!countryCode) {
                return;
            }


            const states =
                State.getStatesOfCountry(
                    countryCode
                );


            if (
                states &&
                states.length > 0
            ) {

                states.forEach((state) => {

                    const option =
                        document.createElement("option");

                    option.value =
                        state.name;

                    option.textContent =
                        state.name;

                    option.dataset.stateCode =
                        state.isoCode;

                    option.dataset.countryCode =
                        countryCode;

                    stateSelect.appendChild(
                        option
                    );

                });


                stateSelect.disabled = false;

            }


            /*
                Countries without
                state information
            */

            else {

                const option =
                    document.createElement("option");

                option.value =
                    countrySelect.value;

                option.textContent =
                    `General / ${countrySelect.value}`;

                option.dataset.countryCode =
                    countryCode;

                stateSelect.appendChild(
                    option
                );

                stateSelect.disabled = false;

            }

        }
    );


    /* --------------------------------
       STATE CHANGE
    -------------------------------- */

    stateSelect.addEventListener(
        "change",
        () => {

            const selectedOption =
                stateSelect.options[
                    stateSelect.selectedIndex
                ];


            const stateCode =
                selectedOption.dataset.stateCode;

            const countryCode =
                selectedOption.dataset.countryCode;


            /*
                Reset City
            */

            citySelect.innerHTML =
                `<option value="" disabled selected>
                    Select Your City / Location
                </option>`;


            citySelect.disabled = true;


            if (
                !stateCode ||
                !countryCode
            ) {

                /*
                    If the country has no
                    real state database,
                    provide a general location.
                */

                const option =
                    document.createElement("option");

                option.value =
                    stateSelect.value;

                option.textContent =
                    `General / ${stateSelect.value}`;

                citySelect.appendChild(
                    option
                );

                citySelect.disabled = false;

                return;

            }


            /* --------------------------------
               LOAD CITIES
            -------------------------------- */

            const cities =
                City.getCitiesOfState(
                    countryCode,
                    stateCode
                );


            if (
                cities &&
                cities.length > 0
            ) {

                cities.forEach((city) => {

                    const option =
                        document.createElement("option");

                    option.value =
                        city.name;

                    option.textContent =
                        city.name;

                    citySelect.appendChild(
                        option
                    );

                });


                citySelect.disabled = false;

            }

            else {

                const option =
                    document.createElement("option");

                option.value =
                    stateSelect.value;

                option.textContent =
                    `General / ${stateSelect.value}`;

                citySelect.appendChild(
                    option
                );

                citySelect.disabled = false;

            }

        }
    );


    /* --------------------------------
       GMAIL VALIDATION
    -------------------------------- */

    function isValidGmail(email) {

        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
            .test(email);

    }


    /* --------------------------------
       FORM SUBMISSION
    -------------------------------- */

    form.addEventListener(
        "submit",
        (event) => {

            const emailInput =
                form.querySelector(
                    'input[type="email"]'
                );


            const email =
                emailInput.value.trim();


            /*
                Gmail check
            */

            if (!isValidGmail(email)) {

                event.preventDefault();

                alert(
                    "Please enter a valid Gmail address ending in @gmail.com."
                );

                emailInput.focus();

                return;

            }


            /*
                Check phone
            */

            const phone =
                phoneInput.value.trim();

            const phoneCode =
                phoneCodeSelect.value;


            if (!phoneCode) {

                event.preventDefault();

                alert(
                    "Please select your country phone code."
                );

                phoneCodeSelect.focus();

                return;

            }


            /*
                Combine country code
                + phone number.

                Example:
                +91 9876543210
            */

            fullPhoneInput.value =
                `${phoneCode} ${phone}`;


            /*
                Let Google Forms receive
                the submission.

                Then show the thank-you
                screen.
            */

            setTimeout(
                () => {

                    formContainer.hidden =
                        true;

                    document.getElementById(
                        "header-helper-text"
                    ).style.display = "none";


                    thankyouContainer.hidden =
                        false;


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                },
                700
            );

        }
    );

});
