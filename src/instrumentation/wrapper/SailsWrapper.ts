import {MESSAGE} from "../../filter/Filter";
import {available} from "./ExpressWrapper";
import {logger} from "../../Logging";

function sailsErrorHandlerSetup() {
    const sails = require('sails')
    const sailsListener = (err : any, req:any, res:any)  => {
        if(err.message == MESSAGE){
            res.forbidden()
        }
    }
    sails.on('router:request:500', sailsListener)
}

export function patchSails(){
    if(!available('sails')){
        return
    }
    try {
        sailsErrorHandlerSetup()
    } catch(e){
        logger.debug("Could not configure sails listener - continuing without sails instrumentation")
    }

}