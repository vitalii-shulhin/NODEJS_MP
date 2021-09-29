import fs from 'fs';
import { pipeline } from 'stream';

import csv from 'csvtojson';

const csvFilePath = './task2/csv/ex1.csv';
const csvOutputFilePath = './task2/csv/csvOutputFile.txt';


// check and remove if csvOutputFile exists
try {
    if (fs.existsSync(csvOutputFilePath)) {
        fs.unlinkSync(csvOutputFilePath);
    }
  }  catch(err) {
    console.error('Error: ', err)
}

const readStream = fs.createReadStream(csvFilePath, 'utf-8');
const writeStream = fs.createWriteStream(csvOutputFilePath);

pipeline(
    readStream,
    csv({
        colParser :{
            price : {
                cellParser: "number"
            },
            amount: "omit",
        }
    })
    .preFileLine(
        (fileLineString, lineIdx) => lineIdx === 0 ? fileLineString.toLowerCase() : fileLineString
    ).on('error',(err)=> {
            console.log('Error: ', err)
        }),
    writeStream,
    (err) => {
        if (err) {
        console.error('Convert pipeline failed.', err);
        } else {
        console.log('Convert pipeline succeeded.');
        }
    }
);