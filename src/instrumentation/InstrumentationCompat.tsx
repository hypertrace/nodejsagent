const m = process.version.match(/(\d+)\.(\d+)\.(\d+)/);
const [processMajor, processMinor, processPatch] = m.slice(1).map(_ => parseInt(_));

export function isCompatible(minVersion){
    const minMajor, _minor, _patch = parseCurrentVersions(minVersion)
    return minMajor > processMajor
}

function parseCurrentVersions(minVersion){
    const m = process.version.match(/(\d+)\.(\d+)\.(\d+)/);
    return m.slice(1).map(_ => parseInt(_));
}