import countries from "world-countries";

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  latLang: item.latlng,
  region: item.region,
}));

const useCountries = () => {
  const getAllCountries = () => countriesFormatted;

  const getCountryByValue = (value) => {
    return countriesFormatted.find((item) => item.value === value);
  };

  return {
    getAllCountries,
    getCountryByValue,
  };
};

export default useCountries;
