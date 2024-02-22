const fs = require('fs');

// Define the file path for package.json
const filePathPackageJson = './package.json';
const args = process.argv.slice(2);

const newVersion = args[0];
if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
    throw new Error("Please pass a valid new version in the format x.x.x");
}

// Read the package.json file
fs.readFile(filePathPackageJson, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const packageJson = JSON.parse(data);

    packageJson.version = newVersion;

    fs.writeFile(filePathPackageJson, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(`Successfully updated the version to ${newVersion} in package.json`);
    });
});