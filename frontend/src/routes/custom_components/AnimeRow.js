import { useState } from 'react'
import editSVG from './edit.svg'

function AnimeRow({ anime, fetchAnimeFunction, removeAnime }) {

    const reqSender = require("../helpers/requests_sender")

    const getSubmitterURL = (submitterName) => {
        return `https://nyaa.si/user/${submitterName}`
    }
    const getSearchBySubmitterAndKeywordURL = (submitterName, keyword) => {
        return getSubmitterURL(submitterName) + "?q=" + keyword
    }

    const [editable, setEditable] = useState(false);
    const [name, setName] = useState(anime.name);
    const [keyword, setKeyword] = useState(anime.keyword);
    const [submitter, setSubmitter] = useState(anime.submitter);
    const [path, setPath] = useState(anime.path);

    const submitOnClick = async () => {
        const response = await reqSender.editAnime(
            anime.name, // old name
            name,       // new name 
            keyword, 
            submitter, 
            path
        )
        
        if(response.ok){
            setEditable(false)
            fetchAnimeFunction()
        }

        alert(JSON.stringify(response))
    }

    if (editable) {
        return (
            <div className="anime-editable" key={anime.name}>
                <div className="anime-editable-field">
                    <span className="anime-editable-field-title">Name</span>
                    <input
                        style={{ width: "100%" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                </div>
                <div className="anime-editable-field">
                    <span className="anime-editable-field-title">Keyword</span>
                    <input
                        style={{ width: "100%" }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Keyword"
                    />
                </div>
                <div className="anime-editable-field">
                    <span style={{textAlign: "start"}}>Submitter</span>
                    <input
                        style={{ width: "100%" }}
                        value={submitter}
                        onChange={(e) => setSubmitter(e.target.value)}
                        placeholder="Submitter"
                    />
                </div>
                <div className="anime-editable-field">
                    <span className="anime-editable-field-title">Path</span>
                    <input
                        style={{ width: "100%" }}
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        placeholder="Path"
                    />
                </div>

                <button
                    onClick={submitOnClick}
                >Submit</button>

            </div>
        )

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
                onClick={(e) => {
                    if (e.target.style.whiteSpace == 'normal')
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
            <div className="anime-edit-button-container">
                <button onClick={
                    () => {
                        setEditable(true);
                    }
                } className="anime-edit-button">

                    <img src={editSVG} style={{ width: "100%" }} />

                </button>
            </div>


        </div>
    )
}

export default AnimeRow

