import GitlabChangelogGenerator from './GitlabChangelogGenerator';
import * as yargs from 'yargs';

const argv = yargs
    .option('url', {
        alias:    'u',
        string:   true,
        required: true,
    })
    .option('token', {
        alias:    't',
        string:   true,
        required: true,
    })
    .option('projectId', {
        alias:    'p',
        number:   true,
        required: true,
    })
    .help()
    .version()
    .argv;

new GitlabChangelogGenerator({
    url:       argv.url,
    token:     argv.token,
    projectId: argv.projectId,
});
