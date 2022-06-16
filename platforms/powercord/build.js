const fs = require('fs');
const path = require('path');

const fse = require('fs-extra');
const archiver = require('archiver');

const pkg = require('./package.json');

console.log();
let mode = process.argv[2] ?? 'prod';
mode = mode === 'dev' || mode === 'prod' ? mode : 'prod'; // clamp value

function manifest() {
	const blankManifest = require('./manifest.template.json');
	blankManifest.author = pkg.author;
	blankManifest.name = pkg.displayName;
	blankManifest.description = pkg.description;
	blankManifest.version = pkg.version;
	blankManifest.license = pkg.license;

	return JSON.stringify(blankManifest, null, 2);
}

if (mode === 'dev') {
	if (process.argv.length < 4) {
		console.error('Specify a directory in dev mode.');
		process.exit(1);
	}

	const destination = path.resolve(process.argv[3]);
	if (!fs.existsSync(destination)) fs.mkdirSync(destination);
	fse.copySync(path.join(__dirname, 'src'), destination, { overwrite: true });
	fs.writeFileSync(path.join(destination, 'manifest.json'), manifest());

	console.log(`Dev files copied to ${destination}, complete.`);
} else if (mode === 'prod') {
	const dest = path.join(
		__dirname,
		'dist',
		`${pkg.name}-v${pkg.version}-release.zip`,
	);
	const output = fs.createWriteStream(dest);
	const archive = archiver('zip', {});

	output.on('close', () => {
		console.log(
			`${archive.pointer()} total bytes written to ${dest}, complete.`,
		);
	});

	archive.pipe(output);
	archive.directory('src', false);

	const manifestText = manifest();
	archive.append(manifestText, { name: 'manifest.json' });

	archive.finalize();
}
