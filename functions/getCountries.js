// Default: Returns all countries
// If arg is a function, returns array.filter(arg) -> likely several elements
// If arg is a number, retunrs array[arg] -> one element

// This functions converts the returned objects to a simplified version
/*
  {
    flag: 'https://flagcdn.com/tc.svg',
    names: ['Turks and Caicos Islands', 'Turks and Caicos Islands', 'ETC'],
    currencies: ['Dollar'],
    capital: ['Cockburn Town'],
    altSpellings: ['TC'],
    continents: ['North America'],
    region: 'Americas',
    subregion: 'Caribbean',
    languages: ['English'],
    area: 948.0,
    map: 'https://goo.gl/maps/R8VUDQfwZiFtvmyn8',
    population: 38718,
  }
*/

export async function getCountries(arg) {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();
  if (typeof arg === 'number') return [data[Math.floor(arg)]];
  if (typeof arg === 'function') return data.filter(arg);
  if (typeof arg === 'string' && arg === 'random') {
    return [data[Math.floor(Math.random() * data.length)]];
  }

  // SIMPLIFIED COUNTRY OBJECT BUILD
  const countries = [];

  data.forEach((c) => {
    const country = {};

    // FLAG
    country.flags = c.flags;

    // NAME: Array with name in all available languages
    const names = Object.values(flattenObj(c.name));
    const nameTranslations = Object.values(flattenObj(c.translations));
    const nameSet = new Set([...names, ...nameTranslations]);
    country.name = Array.from(nameSet);

    // CURRENCIES: Array with currency names
    country.currencies = c.currencies
      ? Object.values(c.currencies).map((c) =>
          c.name
            .split(' ')
            .at(-1)
            .split('')
            .map((c, i) => (!i ? c.toUpperCase() : c))
            .join('')
        )
      : undefined;

    country.capital = c.capital ? [...c.capital] : [];
    country.altSpellings = c.altSpellings;
    country.continents = c.continents;
    country.region = c.region;
    country.subregion = c.subregion;
    country.languages = c.languages ? Object.values(c.languages) : [];
    country.area = c.area;
    country.map = c.maps.googleMaps;
    country.population = c.population;

    countries.push(country);
  });

  // return data;
  return countries;
}

function flattenObj(ob) {
  const result = {};
  for (const i in ob) {
    if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + '.' + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
}
