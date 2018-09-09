declare module 'gitlab' {
    interface GitlabClientParameters {
        url: string;
        token?: string;
        oauthToken?: string;
    }

    interface ResourceResolver<T> {
        all(...args): Promise<T[]>;

        create(...args): Promise<T>;

        edit(...args): Promise<T>;

        show(...args): Promise<T>;

        remove(...args): void;
    }

    interface Milestone {
        id: number;
        iid: number;
        project_id: number;
        title: string;
        description: string;
        state: string;
        created_at: string;
        updated_at: string;
        due_date: string;
        start_date: string;
    }

    interface ProjectMilestone extends Milestone {
    }

    interface MergeRequest {
        id: number;
        iid: number;
        project_id: number;
        title: string;
        description: string;
        state: 'merged' | 'closed';
        created_at: string;
        updated_at: string;
        target_branch: string;
        source_branch: string;
        upvotes: number;
        downvotes: number;
        author: User;
        assignee: User;
        source_project_id: number;
        target_project_id: number;
        labels: string[];
        work_in_progress: boolean;
        milestone: Milestone;
        merge_when_pipeline_succeeds: boolean;
        merge_status: string;
        sha: string;
        merge_commit_sha: string;
        user_notes_count: number;
        discussion_locked: boolean;
        should_remove_source_branch: boolean;
        force_remove_source_branch: boolean;
        web_url: string;
        time_stats: object; //TODO
    }
    
    interface Project {
        id: number;
        description: string;
        default_branch: string;
        visibility: string;
        ssh_url_to_repo: string;
        http_url_to_repo: string;
        web_url: string;
        tag_list: string[];
        owner: User;
        name: string;
        name_with_namespace: string;
        path: string;
        path_with_namespace: string;
        issues_enabled: boolean;
        open_issues_count: number;
        merge_requests_enabled: boolean;
        jobs_enabled: boolean;
        wiki_enabled: boolean;
        snippets_enabled: boolean;
        resolve_outdated_diff_discussions: boolean;
        container_registry_enabled: boolean;
        created_at: string;
        last_activity_at: string;
        creator_id: number;
        namespace: object; //TODO
        import_status: string;
        archived: boolean;
        avatar_url: string;
        shared_runners_enabled: boolean;
        forks_count: number;
        star_count: number;
        runners_token: string;
        public_jobs: boolean;
        shared_with_groups: object[]; //TODO
        only_allow_merge_if_pipeline_succeeds: boolean;
        only_allow_merge_if_all_discussions_are_resolved: boolean;
        request_access_enabled: boolean;
        statistics: object[]; //TODO
        _links: object[]; //TODO
    }

    interface User {
        id: number;
        username: string;
        email: string;
        name: string;
        state: string;
        created_at: string;
    }

    interface MilestoneResolver<T> extends ResourceResolver<T> {
        all(resourceId: number): Promise<T[]>;

        create(resourceId: number, title: string): Promise<T>;

        edit(resourceId: number, milestoneId: number): Promise<T>;

        mergeRequests(resourceId: number, milestoneId: number): Promise<MergeRequest[]>;

        show(resourceId: number, milestoneId: number): Promise<T>;
    }

    interface ProjectMilestoneResolver extends MilestoneResolver<ProjectMilestone> {
    }
    
    export default class Gitlab {
        constructor(param: GitlabClientParameters);

        readonly Groups: ResourceResolver<any>;
        readonly GroupAccessRequests: ResourceResolver<any>;
        readonly GroupBadges: ResourceResolver<any>;
        readonly GroupCustomAttributes: ResourceResolver<any>;
        readonly GroupIssueBoards: ResourceResolver<any>;
        readonly GroupMembers: ResourceResolver<any>;
        readonly GroupMilestones: ResourceResolver<any>;
        readonly GroupProjects: ResourceResolver<any>;
        readonly GroupVariables: ResourceResolver<any>;
        readonly Epics: ResourceResolver<any>;
        readonly EpicIssues: ResourceResolver<any>;
        readonly EpicNotes: ResourceResolver<any>;
        readonly EpicDiscussions: ResourceResolver<any>;
        readonly Users: ResourceResolver<User>;
        readonly UserEmails: ResourceResolver<any>;
        readonly UserImpersonationTokens: ResourceResolver<any>;
        readonly UserKeys: ResourceResolver<any>;
        readonly UserGPGKeys: ResourceResolver<any>;
        readonly Branches: ResourceResolver<any>;
        readonly Commits: ResourceResolver<any>;
        readonly Deployments: ResourceResolver<any>;
        readonly DeployKeys: ResourceResolver<any>;
        readonly Environments: ResourceResolver<any>;
        readonly Issues: ResourceResolver<any>;
        readonly IssueNotes: ResourceResolver<any>;
        readonly IssueDiscussions: ResourceResolver<any>;
        readonly IssueAwardEmojis: ResourceResolver<any>;
        readonly Jobs: ResourceResolver<any>;
        readonly Labels: ResourceResolver<any>;
        readonly MergeRequests: ResourceResolver<MergeRequest>;
        readonly MergeRequestAwardEmojis: ResourceResolver<any>;
        readonly MergeRequestNotes: ResourceResolver<any>;
        readonly Pipelines: ResourceResolver<any>;
        readonly PipelineSchedules: ResourceResolver<any>;
        readonly PipelineScheduleVariables: ResourceResolver<any>;
        readonly Projects: ResourceResolver<Project>;
        readonly ProjectAccessRequests: ResourceResolver<any>;
        readonly ProjectCustomAttributes: ResourceResolver<any>;
        readonly ProjectImportExport: ResourceResolver<any>;
        readonly ProjectIssueBoards: ResourceResolver<any>;
        readonly ProjectHooks: ResourceResolver<any>;
        readonly ProjectMembers: ResourceResolver<any>;
        readonly ProjectMilestones: ProjectMilestoneResolver;
        readonly ProjectSnippets: ResourceResolver<any>;
        readonly ProjectSnippetNotes: ResourceResolver<any>;
        readonly ProjectSnippetDiscussions: ResourceResolver<any>;
        readonly ProjectSnippetAwardEmojis: ResourceResolver<any>;
        readonly ProtectedBranches: ResourceResolver<any>;
        readonly ProjectVariables: ResourceResolver<any>;
        readonly Repositories: ResourceResolver<any>;
        readonly RepositoryFiles: ResourceResolver<any>;
        readonly Runners: ResourceResolver<any>;
        readonly Services: ResourceResolver<any>;
        readonly Tags: ResourceResolver<any>;
        readonly Todos: ResourceResolver<any>;
        readonly Triggers: ResourceResolver<any>;
        readonly ApplicationSettings: ResourceResolver<any>;
        readonly BroadcastMessages: ResourceResolver<any>;
        readonly Events: ResourceResolver<any>;
        readonly FeatureFlags: ResourceResolver<any>;
        readonly GeoNodes: ResourceResolver<any>;
        readonly GitignoreTemplates: ResourceResolver<any>;
        readonly GitLabCIYMLTemplates: ResourceResolver<any>;
        readonly Keys: ResourceResolver<any>;
        readonly Licence: ResourceResolver<any>;
        readonly LicenceTemplates: ResourceResolver<any>;
        readonly Lint: ResourceResolver<any>;
        readonly Namespaces: ResourceResolver<any>;
        readonly NotificationSettings: ResourceResolver<any>;
        readonly PagesDomains: ResourceResolver<any>;
        readonly Search: ResourceResolver<any>;
        readonly SidekiqMetrics: ResourceResolver<any>;
        readonly SystemHooks: ResourceResolver<any>;
        readonly Wikis: ResourceResolver<any>;
    }

}
