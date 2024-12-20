import { useState } from "react";

const reqSender = require("./helpers/requests_sender")

function Add(){

    const [name, setName] = useState("")
    const [keyword, setKeyword] = useState("")
    const [submitter, setSubmitter] = useState("")
    const [path, setPath] = useState("")

    const addOnClick = async ()=>{
        if(name === '' || keyword === '' || submitter === '' || path === '' ){
            alert("Fill All Fields")
            return
        }
        const response = await reqSender.addAnime(name, keyword, submitter, path)
        alert(JSON.stringify(response))
    }

    return <div>
        <div>
            <input onChange={
                (e)=>{
                    setName(e.target.value)
                }
            } placeholder="Name (Must Be Unique)"></input>
        </div>

        <div>
            <input onChange={
                (e)=>{
                    setKeyword(e.target.value)
                }
            } placeholder="Keyword"></input>
        </div>

        <div>
            <input onChange={
                (e)=>{
                    setSubmitter(e.target.value)
                }
            } placeholder="Submitter"></input>
        </div>

        <div>
            <input onChange={
                (e)=>{
                    setPath(e.target.value)
                }
            } placeholder="Path"></input>
        </div>

        <div>
        <button onClick={addOnClick}>Add</button>
        </div>
        
    </div>
}

export default Add;