#Terminal
- terminal is powershell.  when attempting to interact with the operating system use powershell based commands

# Git Repository Rules and Guidelines

## Repository Information
- Repository URL: https://github.com/RobertBergman/screenrecord.git
- Main branch: `main`

## Git Workflow

### Basic Workflow
1. Ensure your local repository is up to date: `git pull origin main`
2. Create feature branches for new work: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them with descriptive messages
4. Push your changes to the remote repository: `git push origin feature/your-feature-name`
5. Create a pull request on GitHub for review
6. After approval, merge your changes into the main branch

### Commit Guidelines
- Write clear, concise commit messages that describe what changes were made
- Use present tense in commit messages (e.g., "Add feature" not "Added feature")
- Keep commits focused on a single logical change
- Include relevant ticket/issue numbers in commit messages when applicable

### Pull Request Guidelines
- Provide a clear description of what changes were made
- Ensure all tests pass before requesting a review
- Address all review comments before merging
- Squash commits when appropriate to maintain a clean history

## Code Deployment
- The `main` branch should always be in a deployable state
- Tagged releases should follow semantic versioning (X.Y.Z)
- Release candidates should be tagged as `vX.Y.Z-rc.N`

## Branch Naming Conventions
- Feature branches: `feature/descriptive-name`
- Bug fix branches: `fix/issue-description`
- Release branches: `release/vX.Y.Z`

## Git Best Practices
- Do not commit directly to the main branch
- Do not commit sensitive information (API keys, credentials, etc.)
- Regularly pull changes from the remote repository
- Resolve merge conflicts properly
- Use `.gitignore` to exclude build artifacts and dependencies

## CI/CD Integration
- All pull requests trigger automated tests
- Successful merges to main trigger automatic deployment to staging
- Release tags trigger deployment to production

Remember to regularly push your changes to the remote repository using:
```
git push origin <branch-name>
```

For the initial push of a new branch, use:
```
git push -u origin <branch-name>
```

# Sequential Thinking Guidelines

Sequential thinking is a structured approach to problem-solving that breaks down complex issues into discrete, ordered steps. This methodology is especially valuable for architectural analysis, debugging, and design decisions.

## When to Use Sequential Thinking

- When analyzing complex system architectures
- During debugging of difficult issues
- For making important design decisions
- When reviewing code structure and organization
- For breaking down requirements into technical specifications
- When documenting thought processes for team understanding

## Sequential Thinking Process

1. **Define the problem scope**: Start by clearly identifying what you're analyzing
2. **Break down into sequential thoughts**: Each thought should build upon previous ones
3. **Number your thoughts**: Keep track of the progression of your analysis
4. **Allow for revisions**: Be willing to revisit and refine earlier thoughts
5. **Branch when necessary**: Create alternative paths when multiple options need exploration
6. **Conclude with synthesis**: End by bringing thoughts together into cohesive understanding

## Best Practices

- Start with an initial estimate of needed thoughts, but be ready to adjust
- Express uncertainty when present rather than making unwarranted assumptions
- Ignore irrelevant information that doesn't contribute to the current step
- Only conclude when you've reached a satisfactory resolution of the problem
- Document the entire sequence to provide transparency in your reasoning

Sequential thinking helps prevent cognitive biases and ensures that all aspects of a problem are considered methodically before reaching conclusions.
