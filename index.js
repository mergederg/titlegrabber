import getTitleAtUrl from 'get-title-at-url';
import csv from 'csvtojson';
import {ExportToCsv} from "export-to-csv";
import fs from "fs";

console.log('Opening input (input.csv) ...');

const csvFilePath='input.csv';
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        debugCSV(jsonObj);
        fetchAndAddTitles(jsonObj).then(value => {
            debugCSV(value);
            outputCSVExport(value);
        });
    });

async function fetchAndAddTitles(importedCSV) {
    console.log('Fetching titles...');

    for (const row of importedCSV) {
        console.log('Processing row: ' + JSON.stringify(row));
        let url = row['url__loc'];
        console.log('URL: ' + url);
        const {title} = await getTitleAtUrl(url);
        console.log('Title: ' + title);
        row['title'] = title;
    }

    return importedCSV;
}

function debugCSV(importedCSV) {
    // console.log('Input was: ');
    // console.log(importedCSV);
    // console.log('Entry 0: ');
    // console.log(importedCSV[0]);
    // console.log('Entry 1: ');
    // console.log(importedCSV[1]);
    // console.log('And so on ...');
}

function outputCSVExport(outputCSV) {
    console.log('Writing output...');

    const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Bogen Sitemap',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    const x = csvExporter.generateCsv(outputCSV, true);

    fs.writeFile('output.csv', x, err => {
        if (err) {
            console.error(err);
        }
    });

    console.log(x);
}