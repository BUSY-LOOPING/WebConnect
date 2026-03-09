import fs from 'fs';

const bumpType = process.argv[2] || 'minor';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

let [major, minor, patch] = pkg.version.split('.').map(Number);

if (bumpType === 'major') {
    major += 1; minor = 0; patch = 0;
} else if (bumpType === 'minor') {
    minor += 1; patch = 0;
} else {
    patch += 1;
}

pkg.version = `${major}.${minor}.${patch}`;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(pkg.version);