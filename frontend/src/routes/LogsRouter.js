import { useEffect, useState } from "react";

const reqSender = require("./helpers/requests_sender")

function LogsRouter() {

    const jumpToBottom = ()=>{
        window.scrollTo(0, document.body.scrollHeight);
    }

    const [logs, setLogs] = useState("")

    const updateLogs = async () => {
        const fetchedLogs = await reqSender.getLogs()
        setLogs(fetchedLogs)
    }
    const clearLogs = async () => {
        alert(await reqSender.clearLogs())
        updateLogs()
    }

    useEffect(() => {
        updateLogs()
    }, [])

    return (
        <div>
            <button 
            onClick={jumpToBottom} 
            style={{marginRight: "15px"}}>
                Jump To Buttom
            </button>

            <button
            onClick={clearLogs}>Clear</button>

            
            <div style={{ whiteSpace: "pre-line" }}>
                {logs ? logs : "Loading Logs"}
            </div>
        </div>

    )
}

export default LogsRouter;