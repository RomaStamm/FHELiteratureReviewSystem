# GitHub Actions CI/CD

This directory contains the CI/CD workflows for the Literature Review System project.

## Workflows

### Test and Quality (`test.yml`)

Runs on every push to `main` or `develop` branches and on all pull requests.

#### Jobs

1. **Lint** - Code quality checks
   - Runs Solhint on Solidity contracts
   - Checks code formatting with Prettier

2. **Test** - Runs tests on multiple Node.js versions
   - Tests on Node.js 18.x and 20.x
   - Compiles contracts
   - Runs test suite
   - Generates coverage reports
   - Uploads coverage to Codecov (Node 20.x only)

3. **Build** - Builds contracts
   - Compiles contracts
   - Checks contract sizes
   - Uploads build artifacts

4. **Security** - Security analysis
   - Runs Slither static analysis
   - Uploads SARIF results to GitHub Security

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions is enabled by default for all repositories. No additional setup needed.

### 2. Configure Codecov (Optional)

To enable code coverage reporting:

1. Go to [Codecov](https://codecov.io) and sign in with GitHub
2. Add your repository
3. Get your Codecov token
4. Add it as a repository secret:
   - Go to repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token

### 3. Configure Branch Protection (Recommended)

Protect your main branches with required status checks:

1. Go to repository Settings > Branches
2. Add branch protection rule for `main`:
   - Require pull request reviews
   - Require status checks to pass before merging:
     - Code Quality Check
     - Test on Node.js 18.x
     - Test on Node.js 20.x
     - Build Contracts
   - Require branches to be up to date before merging

## Local Testing

Run the same checks locally before pushing:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Check formatting
npm run format:check

# Fix formatting
npm run format

# Run tests
npm test

# Generate coverage
npm run coverage

# Check contract size
npm run size-contracts
```

## Workflow Badges

Add these badges to your README.md:

```markdown
[![Test and Quality](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Test%20and%20Quality/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

## Troubleshooting

### Workflow Fails on npm ci

**Problem**: `npm ci` fails with dependency errors

**Solution**:
- Delete `package-lock.json`
- Run `npm install` locally
- Commit the new `package-lock.json`

### Slither Analysis Fails

**Problem**: Security job fails or times out

**Solution**: This is set to `continue-on-error: true`, so it won't block merges. Review the logs and fix any critical issues.

### Coverage Upload Fails

**Problem**: Codecov upload fails

**Solution**:
- Ensure `CODECOV_TOKEN` is set correctly
- Check if the repository is properly connected to Codecov
- Note: This is also set to `fail_ci_if_error: false`

## Maintenance

### Updating Actions Versions

Periodically update the GitHub Actions versions:

```yaml
# Check for updates at: https://github.com/actions
- uses: actions/checkout@v4  # Update version as needed
- uses: actions/setup-node@v4  # Update version as needed
```

### Adding New Checks

To add new checks to the CI pipeline:

1. Add the check as a step in the appropriate job
2. Add the corresponding npm script in `package.json`
3. Test locally before pushing
4. Update this documentation

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Codecov Documentation](https://docs.codecov.com/docs)
