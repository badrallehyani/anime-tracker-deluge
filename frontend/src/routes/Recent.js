import React, { useEffect, useState } from "react";
import EmptyFiles from './helpers_components/EmptyFiles'
import LoadingFiles from "./helpers_components/LoadingFiles";

const reqSender = require("./helpers/requests_sender")

function Recent() {

    const toDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString()
    }

    const [recentFiles, setRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true)

    var requestLoading = false
    
    const fetchRecentFunction = async ()=>{
        // requestLoading is used to avoid sending
        // requests while the previous request is
        // still pending
        
        if(requestLoading){
            return
        }

        requestLoading = true

        setRecentFiles(await reqSender.getRecent())
        
        setLoading(false)
        requestLoading = false
    }

    useEffect( ()=>{
        fetchRecentFunction()

        const number = setInterval(() => {
            fetchRecentFunction()
        }, 5000)

        console.log(`created a new interval for fetchRecentFunction: ${number}`)


        // when the component is 'unmount'ed the return function is executed.
        // so, we clear the interval to avoid creating multiple intervals
        return () => {
            console.log(`clearInterval(${number}) for fetchRecentFunction`)
            clearInterval(number)
        }

    }, [])

    const clearRecentOnClick = async ()=>{
        const response = await reqSender.clearRecent()
        alert(JSON.stringify(response))
        // Refresh After Clear
        fetchRecentFunction()
    }

    if(loading){
        return <LoadingFiles/>
    }

    if(recentFiles.length === 0){
        return <EmptyFiles/>
    }

    return <div>
        
        <div>
            <button onClick={clearRecentOnClick}>Clear Recent</button>
        </div>

        <div className="all-files-container">
            
            {
                recentFiles.map((file) => {
                    return (
                        <div className="file-container" key={file.ID}>
                            <div className="file-name">{file.name}</div>
                            <div className="file-date">{toDate(file.timestamp)}</div>
                        </div>
                    )
                })
            }

        </div>
    </div>
}

export default Recent;