const API_URL = 'https://oparchive.com/data/characters.json';
const BASE_IMG_URL = 'https://oparchive.com';

let allCharacters = [];

async function fetchCharactersData() {
    try {
        const response = await fetch(API_URL);
        allCharacters = await response.json();
        return allCharacters;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
