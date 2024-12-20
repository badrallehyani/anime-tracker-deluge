import React, { useEffect, useState } from "react";
import EmptyFiles from './helpers_components/EmptyFiles'
import LoadingFiles from "./helpers_components/LoadingFiles";
import AnimeRow from "./custom_components/AnimeRow";

const reqSender = require("./helpers/requests_sender")

function Edit() {

    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true)

    var requestLoading = false

    const fetchAnimeFunction = async () => {
        // requestLoading is used to avoid sending
        // requests while the previous request is
        // still pending

        if (requestLoading) {
            return
        }

        requestLoading = true

        const animes = await reqSender.getAnimes()
        setAnimeList(animes)

        setLoading(false)
        requestLoading = false
    }

    useEffect(() => {
        fetchAnimeFunction()

        const number = setInterval(() => {
            fetchAnimeFunction()
        }, 5000)

        console.log(`created a new interval for fetchAnimeFunction: ${number}`)


        // when the component is 'unmount'ed the return function is executed.
        // so, we clear the interval to avoid creating multiple intervals
        return () => {
            console.log(`clearInterval(${number}) for fetchAnimeFunction`)
            clearInterval(number)
        }

    }, [])

    if (loading) {
        return <LoadingFiles />
    }

    if (animeList.length === 0) {
        return <EmptyFiles />
    }



    return <div>

        <div className="all-animes-container">
            {
                animeList.map((anime) => {
                    return <AnimeRow 
                        anime={anime}
                        fetchAnimeFunction = {fetchAnimeFunction}
                        removeAnime = {async (name)=>{
                            const response = await reqSender.removeAnime(name)
                            alert(JSON.stringify(response))
                        }}
                    />
                })
            }

        </div>

    </div>
}

export default Edit;