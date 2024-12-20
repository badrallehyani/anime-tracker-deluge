import { useEffect, useState } from "react"

const reqSender = require("./helpers/requests_sender")

function NextRefresh(){

    const toDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString()
    }

    const refresh = async (e)=>{
        e.target.disabled = true

        const response = await reqSender.refresh()
        if(response.length === 0)
            alert("Nothing New")
        else
            alert(JSON.stringify(response))

        e.target.disabled = false
    }

    const [lastUpdate, setLastUpdate] = useState(-1)
    const [nextUpdate, setNextUpdate] = useState(-1)

    const updateUpdatesInfo = async ()=>{
        const updatesInfo = await reqSender.getUpdatesInfo()
        setLastUpdate(updatesInfo.last_update)
        setNextUpdate(updatesInfo.next_update)
    }

    useEffect( ()=>{
        updateUpdatesInfo()
    }, [])

    return <div>
        
        <div>
            <div>
                Last Update: {toDate(lastUpdate)}
            </div>
            <div>
                Next Update: {toDate(nextUpdate)}
            </div>

            <button onClick={refresh}>Refresh Now</button>
        </div>
        
    </div>
}

export default NextRefresh