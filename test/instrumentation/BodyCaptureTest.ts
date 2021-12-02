import {expect} from "chai";
import {BodyCapture} from "../../src/instrumentation/BodyCapture";

describe('Body Capture tests', () => {
    it('will capture body data size < max size ', () => {
        let maxSize = 20
        let bodyCap = new BodyCapture(maxSize)
        let bodyChunk = Buffer.from("some data")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data")
    });

    it('will capture until body data exceeds max data', () => {
        let maxSize = 20
        let bodyCap = new BodyCapture(maxSize)
        let bodyChunk = Buffer.from("some data that is more than 20 bytes")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data that is mo")
    });

    it('will capture body that is size of max data', () => {
        let maxSize = 20
        let bodyCap = new BodyCapture(maxSize)
        let bodyChunk = Buffer.from("some data that is mo")
        bodyCap.appendData(bodyChunk)
        expect(bodyCap.dataString()).to.equal("some data that is mo")
    })
})
