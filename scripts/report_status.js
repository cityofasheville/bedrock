const nodemailer = require('nodemailer');
const fs = require('fs');

let transporter = nodemailer.createTransport({
    host: '192.168.0.8',
});

const workDir = 'C:/jon/etl_jobs_dir';
const files = fs.readdirSync(workDir);

if (files.indexOf('jobs_status.json') < 0) {
  logger.error(`Unable to find jobs_status.json in jobs directory ${workDir}`);
  return console.log(`Unable to find jobs_status.json in jobs directory ${workDir}`);
}
const fd = fs.openSync(`${workDir}/jobs_status.json`, 'r');
const jTracker = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
console.log
fs.closeSync(fd);

const errors = jTracker.errored.length;
const unfinished = jTracker.sequencedToDo.length +
    jTracker.freeToDo.length + jTracker.running.length;
const completed = jTracker.completed.length;
const status = (errors + unfinished > 0) ? 'ERROR' : 'OK';
const emailText = `
Running from directory: ${workDir}

Final status: ${status}

Total errors: ${errors}
Total unfinished: ${unfinished}
Total completed: ${completed}

${errors>0?'Errored Jobs:':''}
${jTracker.errored.map(itm => {
    return `${itm.name}`;
}).join('\n')}

${unfinished>0?'Unfinished Jobs:':''}
${jTracker.sequencedToDo.map(itm => {
    return `${itm.name}`;
}).join('\n')}
${jTracker.freeToDo.map(itm => {
    return `${itm.name}`;
}).join('\n')}
${jTracker.running.map(itm => {
    return `${itm.name}`;
}).join('\n')}

${completed>0?'Completed jobs:':''}
${jTracker.completed.map(itm => {
    return `${itm.name}`;
}).join('\n')}
`;

// ${Object.keys(jTracker.jobStatus).map(itm => {
//     return `${itm}: ${jTracker.jobStatus[itm]}`;
// }).join('\n')}
// `;

let mailOptions = {
    from: 'dataserviceaccount@ashevillenc.gov',
    to: 'gisadmins@ashevillenc.gov;jtwilson@ashevillenc.gov',
    subject: `ETL Jobs Status: ${status}`,
    text: emailText,
};

const doit = true;
if (doit) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message sent: ${info.messageId}`);
    });
}
