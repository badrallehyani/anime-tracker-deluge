import { useEffect, useState } from "react";

const reqSender = require("./helpers/requests_sender")

function LogsRouter() {

    const jumpToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const [logs, setLogs] = useState("")
    const [loading, setLoading] = useState(true)

    const updateLogs = async () => {
        const fetchedLogs = await reqSender.getLogs()
        setLogs(fetchedLogs)
        setLoading(false)
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
                style={{ marginRight: "15px" }}>
                Jump To Buttom
            </button>

            <button
                onClick={clearLogs}>Clear</button>

            <div style={{display: "flex", justifyContent: "center", marginTop: "2rem"}}>

                <div style={{
                        whiteSpace: "pre", 
                        overflow: "scroll", 
                        width: "65%", 
                        border: "1px purple solid",
                        padding: "1rem",
                        textAlign: loading? "center": "start",
                        fontSize: "1rem"
                    }}>

                    {loading? "Loading Logs" : 

                        logs? logs: "No Logs Yet"
                    
                    }
                </div>

            </div>

        </div>

    )
}

export default LogsRouter;