import "bootstrap/dist/css/bootstrap.min.css"
import "./global/style/root.css"
import "./global/style/background.css"
import "./global/script/function"

import React, { useEffect, lazy, createContext, useState, useRef, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client" 


import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

import { csrftoken } from "./global/script/module";
import { clearStatic } from "./global/script/static";
import styles from "./global/style/main.module.css"

export const FeedbackContext = createContext(null);

clearStatic()

var mainRoot = createRoot(document.getElementById("root"))

const Component = ()=>{
    useEffect(() => {
        
    }, []);

    return (<>
       
    </>)
}
mainRoot.render(<Component/>)
