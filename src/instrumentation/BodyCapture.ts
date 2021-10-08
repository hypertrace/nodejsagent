import sizeof from 'object-sizeof'

export class BodyCapture {
    private data: any[];
    private currentSize : number;
    private maxSize: number;
    private full: boolean
    constructor(maxSize : number) {
        this.data = []
        this.currentSize = 0
        this.maxSize = maxSize
        this.full = false
    }

    appendData(chunk : any) {
        if(this.full){
            return
        }

        let chunkSize = sizeof(chunk)
        if(!Buffer.isBuffer(chunk)) {
            chunk = Buffer.from(chunk)
        }
        if(this.currentSize + chunkSize <= this.maxSize) {
            this.data.push(chunk)
        } else {
            let remainingSpace = this.maxSize - this.currentSize
            let gapFill = chunk.slice(0, remainingSpace)
            this.data.push(gapFill)
            this.full = true
        }
        this.currentSize += chunkSize
    }

    dataString() : string{
        return  Buffer.concat(this.data).toString()
    }
}