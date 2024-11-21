import { Client, PlaceType2 } from '@googlemaps/google-maps-services-js';

export async function getAddress(geocodeApiKey: string, address: string) {
  if (address == '' || address == undefined) return null;
  const args = {
    params: {
      key: geocodeApiKey,
      address: address
    }
  };
  const client = new Client({});
  const response = await client.geocode(args);
  if (response.data.results.length == 0) return null;
  const result = response.data.results[0];
  const country = result.address_components.find((it) => it.types.includes(PlaceType2.country));
  const locality = result.address_components.find((it) => it.types.includes(PlaceType2.locality));
  return {
    formatted: result.formatted_address.split(', '),
    address: result.formatted_address,
    country: country ? country.long_name : '',
    countryCode: country ? country.short_name : '',
    city: locality ? locality.long_name : '',
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng
  };
}
