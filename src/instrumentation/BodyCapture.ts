import sizeof from 'object-sizeof'

export class BodyCapture {
    private data: any[];
    private currentSize : number;
    private maxSize: number;
    constructor(maxSize : number) {
        this.data = []
        this.currentSize = 0
        this.maxSize = maxSize
    }

    appendData(chunk : any) {
        let chunkSize = sizeof(chunk)
        if(this.currentSize + chunkSize <= this.maxSize) {
            this.data.push(chunk)
        } // if we still have < chunk size but not at max size should take slice of data of difference between 2 valus
        this.currentSize += chunkSize
    }

    dataString() : string{
        return  Buffer.concat(this.data).toString()
    }
}