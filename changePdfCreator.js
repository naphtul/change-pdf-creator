const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
walk = promisify(walk);

const changePdfCreator = async (file) => {
	console.log(`Working on ${file}`);

	// This should be a Uint8Array or ArrayBuffer
	// This data can be obtained in a number of different ways
	// If your running in a Node environment, you could use fs.readFile()
	// In the browser, you could make a fetch() call and use res.arrayBuffer()
	const existingPdfBytes = fs.readFileSync(file);
	 
	// Load a PDFDocument from the existing PDF bytes
	// const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Set all available metadata fields on the PDFDocument. Note that these fields
	// are visible in the "Document Properties" section of most PDF readers.
	pdfDoc.setCreator('PFU ScanSnap Manager 5.1.51 #S1500');	
	
	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();
	 
	// For example, `pdfBytes` can be:
	//   • Written to a file in Node
	//   • Downloaded from the browser
	//   • Rendered in an <iframe>
	fs.writeFileSync(file, pdfBytes);
	
	console.log(`Done with ${file}`);
};

const main = async () => {
	const listPdfs = await walk('C:\\Users\\Public\\Desktop\\personal_to_file');
	// console.log(listPdfs);
	// process.exit(0);
	// const promises = [];
	for (const item of listPdfs) {
		// promises.push(changePdfCreator(item));
		try {
			await changePdfCreator(item);
		} catch (e) {
			console.error(e)
		}
	}
	// await Promise.all(promises);
};

const one = async () => {
	await changePdfCreator('C:\\Users\\Public\\Desktop\\personal_to_file\\Life Insurance in Retirement Concept.pdf');
};

main();
// one();
