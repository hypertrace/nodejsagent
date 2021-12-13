import sizeof from 'object-sizeof'

export class BodyCapture {
    private data: any[];
    private currentSize : number;
    private maxReportingSize: number;
    private full: boolean
    private maxProcessingSize: number;
    private contentLength: number

    // whichever is larger(processing or reporting) use that to limit how much data BodyCapture will record
    private internalMaxRecordingSize: number;

    constructor(maxSize : number, maxProcessingSize : number) {
        this.data = []
        this.contentLength = 0
        this.currentSize = 0
        this.maxReportingSize = maxSize  // data that is sent out for reporting
        this.maxProcessingSize = maxProcessingSize // data that is sent to filter api internally
        this.internalMaxRecordingSize = Math.max(maxSize, maxProcessingSize);
        this.full = false
    }

    appendData(chunk : any) {
        if(!chunk) {
            return
        }
        if(this.full){
            return
        }

        let chunkSize = sizeof(chunk)
        if(!Buffer.isBuffer(chunk)) {
            if(chunk instanceof Object){
                chunk = JSON.stringify(chunk)
            }
            chunk = Buffer.from(chunk)
        }
        if(this.currentSize + chunkSize <= this.internalMaxRecordingSize) {
            this.data.push(chunk)
        } else {
            let remainingSpace = this.internalMaxRecordingSize - this.currentSize
            let gapFill = chunk.slice(0, remainingSpace)
            this.data.push(gapFill)
            this.full = true
        }
        this.contentLength += chunk.length
        this.currentSize += chunkSize
    }

    getContentLength() : number {
        return this.contentLength;
    }

    processableString() : string {
        return Buffer.concat(this.data).toString('utf8', 0, this.maxProcessingSize)
    }

    dataString() : string{
        return  Buffer.concat(this.data).toString('utf8', 0, this.maxReportingSize)
    }
}