async function ip(){
    // Fetch IP and country data from a geolocation API
    const ipApiResponse = await fetch('http://ip-api.com/json');
    const ipData = await ipApiResponse.json();
    return ipData
}
ip()
