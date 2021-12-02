import {expect} from "chai";
import {BodyCapture} from "../../src/instrumentation/BodyCapture";

describe('Body Capture tests', () => {
    it('will capture body data size < max size ', () => {
        let maxSize = 20
        let maxProcessingSize = 22;
        let bodyCap = new BodyCapture(maxSize, maxProcessingSize)
        let bodyChunk = Buffer.from("some data")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data")
        expect(bodyCap.processableString()).to.equal("some data")
    });

    it('will capture until body data exceeds max data', () => {
        let maxSize = 20
        let maxProcessingSize = 30;
        let bodyCap = new BodyCapture(maxSize, maxProcessingSize)
        let bodyChunk = Buffer.from("some data that is more than 20 bytes")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data that is mo")
        expect(bodyCap.processableString()).to.equal("some data that is more than 20")
    });

    it('will capture body that is exact size of max data', () => {
        let maxSize = 20
        let maxProcessingSize = 20
        let bodyCap = new BodyCapture(maxSize, maxProcessingSize)
        let bodyChunk = Buffer.from("some data that is mo")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data that is mo")
        expect(bodyCap.processableString()).to.equal("some data that is mo")
    })
})
