const axios = require('axios');

class GeocodingAPI {

    static async getCoordinates(country, city, street, house_number) {
        const url = `${process.env.GEOCODE_API_URL}?q=${country}+${city}+${street}+${house_number}&apiKey=${process.env.GEOCODE_API_KEY}`;
        const response = await axios.get(url);

        if (response.data.items.length === 0) {
            return null;
        }
        return response.data.items[0].position;
    }


    static async getCoordinatesByIp(ip) {
        const url = `${process.env.IP_FINDER_URL}/${ip}`;
        const response = await axios.get(url);

        if (!response.data.success) {
            return null;
        }

        return { latitude: response.data.latitude, longitude: response.data.longitude };
    }

}

module.exports = GeocodingAPI;