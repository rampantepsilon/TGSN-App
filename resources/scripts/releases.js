const API_KEY = 'b63637150ba04bd0875170eb434424ab'; // Replace with your actual key
const BASE_URL = 'https://api.rawg.io/api';

function date() {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0]

    console.log(formatDate(today))
}

async function fetchGames(year, month, day) {
    // Calculate dynamic date range
    const today = new Date(year + '-' + month + '-' + day);
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    // Format dates to ISO string format (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];

    const startDate = formatDate(today);          // e.g., "2026-10-24"
    const endDate = formatDate(twoWeeksLater);    // e.g., "2026-11-07"

    try {
        // Build the query with ordering set by release date
        const url = `${BASE_URL}/games?key=${API_KEY}&dates=${startDate},${endDate}&ordering=released`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response error');

        const data = await response.json();
        console.log(`Games releasing between ${startDate} and ${endDate}:`, data.results);
        return data.results;
    } catch (error) {
        console.error('Failed to fetch upcoming games:', error);
    }
}

async function fetchToday() {
    // Calculate dynamic date range
    const today = new Date();

    // Format dates to ISO string format (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];

    const startDate = formatDate(today);          // e.g., "2026-10-24"

    try {
        // Build the query with ordering set by release date
        const url = `${BASE_URL}/games?key=${API_KEY}&dates=${startDate}&ordering=released`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response error');

        const data = await response.json();
        console.log(`Games releasing on ${startDate}:`, data.results);
        return data.results;
    } catch (error) {
        console.error('Failed to fetch upcoming games:', error);
    }
}

async function platforms() {
    try {
        const response = await fetch(`${BASE_URL}/platforms?key=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        var gameslist = [];
        for (i in data.results) {
            gameslist.push({ id: data.results[i].id, name: data.results[i].name, slug: data.results[i].slug })
        }
        console.log(gameslist);
        return gameslist;
    } catch (error) {
        console.error('Failed to fetch games:', error);
    }
}
