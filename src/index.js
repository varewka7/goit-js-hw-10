import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

// fetchCountries('canada').then((result) => console.log(result));

const countryInput = document.querySelector('#search-box')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')

countryInput.addEventListener("input", debounce(onInputContries, DEBOUNCE_DELAY));

function onInputContries(e) {
    const countryName = e.target.value.trim();
    if (countryName === '') {
        return clerarAll();
    }

    fetchCountries(countryName)
    .then(countries => {
        clerarAll();

      if (countries.length < 2) {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(countries))
        countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries))
      } else if (countries.length > 10 ) {
        alertTooManyMatches()
      } else {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(countries))
      }
    })
    .catch(alertWrongName)
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  return markup
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  return markup
}

function clerarAll() {
    countryList.innerHTML = ''
    countryInfo.innerHTML = ''
}

function alertTooManyMatches() {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
}

function alertWrongName() {
    Notiflix.Notify.failure("Oops, there is no country with that name")
}