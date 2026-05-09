import "../styles/PageNotFound.css"
import PageNotFoundImg from "../assets/PageNotFound.jpg"
import { useNavigate } from "react-router-dom";
import React from 'react'

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="notFoundContainer">

            <div className="notFoundBox">
                <img src={PageNotFoundImg} alt="Page not found" />
                <p>The page you are looking for does not exist.</p>
                <button onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>

        </div>

    )
}

export default PageNotFound
