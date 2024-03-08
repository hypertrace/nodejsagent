import {MESSAGE} from "../../filter/Filter";
import {available, ResponseEnded} from "./ExpressWrapper";
import {logger} from "../../Logging";
import {BodyCapture} from "../BodyCapture";
import {Config} from "../../config/config";
import {context, trace} from "@opentelemetry/api";

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

    try {
        const sailsResponse = require('sails/node_modules/express/lib/response')
        let originalSend = sailsResponse.send
        sailsResponse.send = function(body) {
            let span = trace.getSpan(context.active())
            if(span == undefined){
                return originalSend.apply(this, arguments)
            }
            // @ts-ignore
            span.inHtCaptureScope = true
            try {
                let bodyCapture: BodyCapture = new BodyCapture(Config.getInstance().config.data_capture.body_max_size_bytes,
                    Config.getInstance().config.data_capture.body_max_processing_size_bytes)
                bodyCapture.appendData(body)
                span.setAttribute('http.response.body', bodyCapture.dataString())
            } catch(e){
            }
            return originalSend.apply(this, arguments)
        }
    }catch(e){
        logger.debug("Could not configure sails res capture - continuing without sails instrumentation")
    }

}