function AnimeRow({ anime, fetchAnimeFunction, removeAnime }) {

    const getSubmitterURL = (submitterName) =>{
        return `https://nyaa.si/user/${submitterName}`
    }
    const getSearchBySubmitterAndKeywordURL = (submitterName, keyword)=>{
        return getSubmitterURL(submitterName) + "?q=" + keyword
    }

    return (
        <div className="anime-container" key={anime.name}>


            <div className="anime-name-and-submitter" >

                <a
                    className="anime-submitter"
                    title="Show Keyword Search Results"
                    href={
                        getSearchBySubmitterAndKeywordURL(anime.submitter, anime.keyword)
                    }
                    target="_blank"
                >
                    [{anime.submitter}]
                </a>


                <div className="anime-name">{anime.name}</div>

            </div>


            <div 
                className="anime-path" 
                title="Click To Expand"
                onClick={(e)=>{
                    if(e.target.style.whiteSpace == 'normal')
                        e.target.style.whiteSpace = 'nowrap'
                    else
                        e.target.style.whiteSpace = 'normal'
                    
                }}
            >
                {anime.path}
            </div>


            <div className="anime-delete-button-container">
                <button onClick={
                    () => {
                        removeAnime(anime.name)
                    }
                } className="anime-delete-button">x</button>
            </div>


        </div>
    )
}

export default AnimeRow

