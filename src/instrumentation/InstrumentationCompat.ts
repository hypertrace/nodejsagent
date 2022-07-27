const m = process.version.match(/(\d+)\.(\d+)\.(\d+)/);
// @ts-ignore
const [processMajor, processMinor, processPatch] = m.slice(1).map(_ => parseInt(_));

export function isCompatible(minVersion){
    try {
        // @ts-ignore
        const [minMajor, minMinor, minPatch] = parseCurrentVersions(minVersion)
        return minMajor > processMajor
    } catch {
        return false
    }

}

function parseCurrentVersions(minVersion){
    const m = minVersion.match(/(\d+)\.(\d+)\.(\d+)/);
    // @ts-ignore
    return m.slice(1).map(_ => parseInt(_));
}