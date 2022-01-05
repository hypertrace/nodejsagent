import sizeof from 'object-sizeof'

export class BodyCapture {
    private data: string;
    private currentSize : number;
    private maxReportingSize: number;
    private full: boolean
    private maxProcessingSize: number;
    private contentLength: number;
    // whichever is larger(processing or reporting) use that to limit how much data BodyCapture will record
    private internalMaxRecordingSize: number;

    constructor(maxSize : number, maxProcessingSize : number) {
        this.data = ''
        this.currentSize = 0
        this.maxReportingSize = maxSize  // data that is sent out for reporting
        this.maxProcessingSize = maxProcessingSize // data that is sent to filter api internally
        this.internalMaxRecordingSize = Math.max(maxSize, maxProcessingSize);
        this.full = false
        this.contentLength = 0;
    }

    appendData(chunk : any) {
        if(!chunk) {
            return
        }
        if(this.full){
            return
        }
        let receivedData = ''

        let chunkSize = sizeof(chunk)
        if(!Buffer.isBuffer(chunk)) {
            if(chunk instanceof Object){
                receivedData = JSON.stringify(chunk)
            }
            receivedData = Buffer.from(chunk).toString()
        }

        if(this.currentSize + chunkSize <= this.internalMaxRecordingSize) {
            this.data += (receivedData.toString())
        } else {
            let remainingSpace = this.internalMaxRecordingSize - this.currentSize
            let gapFill = receivedData.slice(0, remainingSpace)
            this.data += gapFill
            this.full = true
        }
        this.contentLength += receivedData.length;
        this.currentSize += chunkSize
    }

    processableString() : string {
        return this.data.slice(0, this.maxProcessingSize)
    }

    getContentLength() {
        return this.contentLength;
    }

    dataString() : string{
        return  this.data.slice(0, this.maxReportingSize)
    }
}