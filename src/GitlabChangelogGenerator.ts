import Gitlab, { MergeRequest, ProjectMilestone } from 'gitlab';
import * as fs from 'fs';
import * as path from 'path';

export interface ClientParameters {
    url: string,
    token: string,
    projectId: number,
}

type MergeRequestsByMilestone = Array<[ ProjectMilestone, MergeRequest[] ]>;

const PLACEHOLDER = {
    HEADER:  /<!-- {{HEADER}} -->/i,
    CONTENT: /<!-- {{CONTENT}} -->/i,
};

const LABELS: { [P: string]: Array<RegExp> } = {
    Added:      [ /feature/i, /feat/i, /added/i ],
    Changed:    [ /improvement/i, /improve/i, /changed/i ],
    Deprecated: [/to-remove/i, /deprecated/i, /to-be-removed/i],
    Removed: [/removed/i],
    Fixed: [/fix/i, /fixed/i, /hotfix/i, /hot-fix/i, /bug/i],
    Security: [/secu/i, /security/i],
};

const LABELS_MISC = LABELS.Added.concat(
    LABELS.Changed,
    LABELS.Deprecated,
    LABELS.Removed,
    LABELS.Fixed,
    LABELS.Security,
);

export default class GitlabChangelogGenerator {
    private url: string;
    private token: string;
    private projectId: number;

    private gitlab: Gitlab;

    constructor(params: ClientParameters) {
        this.url = params.url;
        this.token = params.token;
        this.projectId = params.projectId;

        this.gitlab = new Gitlab({
            url: this.url,
            token: this.token,
        });

        setImmediate(async () => {
            await this.generate();
        });
    }

    private async generate() {
        const milestones = await this.gitlab.ProjectMilestones.all(this.projectId);

        const MRsByMilestone: MergeRequestsByMilestone = [];
        await Promise.all(
            milestones.map(milestone => {
                return this.gitlab.ProjectMilestones.mergeRequests(this.projectId, milestone.id).then(MRs =>
                    MRsByMilestone.push([milestone, MRs.filter(mr => 'merged' === mr.state)]),
                );
            }),
        );

        MRsByMilestone.sort((a, b) => {
            if (a[0].id <= b[0].id) {
                return 1;
            } else {
                return -1;
            }
        });

        const changelog = await this.getChangelog(MRsByMilestone);
        fs.writeFileSync(path.resolve(process.cwd(), './CHANGELOG.md'), changelog, { encoding: 'utf-8' });
    }

    private async getChangelog(mergeRequests: MergeRequestsByMilestone): Promise<string> {
        const projectUrl = (await this.gitlab.Projects.show(this.projectId)).web_url;
        const header = ''; // TODO

        let template: string = fs.readFileSync(path.resolve(__dirname, 'resources/template.md'), { encoding: 'utf-8' });
        template = template.replace(PLACEHOLDER.HEADER, header);

        let content = '';
        const links = [
            `[Unreleased]: ${projectUrl}/compare/${mergeRequests[mergeRequests.length - 1][0].title}...HEAD`,
        ];
        content += '## [Unreleased]\n\n';
        mergeRequests.forEach(([milestone, mrs], index) => {
            const versionTitle = milestone.title.startsWith('v') ? milestone.title.substr(1) : milestone.title;
            content += `## [${versionTitle}] - ${milestone.due_date || '(no release date)'}\n`;

            if (1 === links.length) {
                links.push(`[${versionTitle}]: ${projectUrl}/commits/${milestone.title}`);
            } else {
                links.push(
                    `[${versionTitle}]: ${projectUrl}/compare/${mergeRequests[index - 1][0].title}...${
                        milestone.title
                    }`,
                );
            }

            Object.entries(LABELS).forEach(([section, match]: [string, RegExp[]]) => {
                const filteredMR = mrs.filter(mr => mr.labels.some(l => match.some(reg => reg.test(l))));
                if (filteredMR.length) {
                    content += `### ${section}\n`;
                }

                filteredMR.forEach(mr => {
                    content += `- !${mr.iid} ${mr.title} (@${mr.author.username})\n`;
                });

                if (filteredMR.length) {
                    content += '\n';
                }
            });
        });

        content += '\n' + links.join('\n');

        return template.replace(PLACEHOLDER.CONTENT, content);
    }
}
