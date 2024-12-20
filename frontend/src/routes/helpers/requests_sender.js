const BASE_URL = require("../../config/config").backendBaseURL

async function getAnimes(){
    const response = await fetch(BASE_URL + "get_animes", {
        method: "GET"
    })
    const responseJSON = await response.json()
    const animeList = responseJSON.anime_list

    return animeList
}

async function getRecent(){
    const response = await fetch(BASE_URL + "get_recent", {
        method: "GET"
    })
    const responseJSON = await response.json()
    const recentFiles = responseJSON
    return recentFiles
}

async function addAnime(name, keyword, submitter, path){
    const response = await fetch(BASE_URL + "add_anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            keyword: keyword,
            submitter: submitter,
            path: path
        })
    })
    
    const responseJSON = await response.json()
    const animeList = responseJSON.anime_list

    return animeList   
}

async function removeAnime(name){
    const response = await fetch(BASE_URL + "remove_anime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
        })
    })
    
    const responseJSON = await response.json()
    const animeList = responseJSON.anime_list

    return animeList  
}

async function refresh(){
    const response = await fetch(BASE_URL + "refresh", {
        method: "POST"
    })
    const responseJSON = await response.json()

    return responseJSON
}

async function getUpdatesInfo(){
    const response = await fetch(BASE_URL + "get_updates_info", {
        method: "GET"
    })
    const responseJSON = await response.json()
    return responseJSON
}

async function clearRecent(){
    const response = await fetch(BASE_URL + "clear_recent", {
        method: "POST"
    })
    const responseJSON = await response.json()

    return responseJSON
}

async function getLogs(){
    const response = await fetch(BASE_URL + "get_logs", {
        method: "GET"
    })
    const responseText = await response.text()

    return responseText
}

async function clearLogs(){
    const response = await fetch(BASE_URL + "clear_logs", {
        method: "POST"
    })
    const responseText = await response.text()

    return responseText 
}

const reqSender = {
    getAnimes: getAnimes,
    getRecent: getRecent,
    addAnime: addAnime,
    removeAnime: removeAnime,
    refresh: refresh,
    getUpdatesInfo: getUpdatesInfo,
    clearRecent: clearRecent,
    getLogs: getLogs,
    clearLogs: clearLogs,
}


module.exports = reqSender