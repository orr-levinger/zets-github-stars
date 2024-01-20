# Zets Github Starts 

### Fork the Repository
To run this project in your own AWS account, you should first fork this repository:

1. Navigate to the original repository on GitHub.
2. Click the "Fork" button in the top-right corner of the page.

### Prerequisites
- AWS Account
- GitHub Account

## Setting up a Development Environment in GitHub

To deploy and run the application in your own environment, you need to create a development environment in your forked GitHub repository and set up the required secrets.

### Setup Environment Variables in GitHub
1. In your GitHub repository, navigate to the "Settings" tab.
2. On the left sidebar, click on "Environments".
3. Click on "New environment" to create a new environment.
4. Name the environment "dev" (or another name, but make sure it matches the environment name used in the GitHub Actions workflow).
5. Click on "Configure environment".

- **`AWS_ACCESS_KEY_ID`**
    - **Description**: AWS IAM user access key ID with necessary permissions.
    - **Type**: String
    - **Required**: Yes

- **`AWS_SECRET_ACCESS_KEY`**
    - **Description**: AWS IAM user secret access key.
    - **Type**: Secret
    - **Required**: Yes

- **`WEBAPP_BUCKET`**
    - **Description**: The name of the S3 bucket where the frontend will be deployed.
    - **Type**: String
    - **Required**: Yes

### Creating a Secured Variable in AWS
Create a secured variable in your AWS account called `zets-github-token` with your GitHub API token.

1. Navigate to the AWS Management Console.
2. Go to the service that manages your secured variables (e.g., AWS SSM).
3. Create a new secret with the key `zets-github-token` and set your GitHub token as the value.

### Deploying the Application
The application is deployed using GitHub Actions. The workflow is triggered on any push to the master branch or can be manually dispatched:

1. Push changes to the master branch or go to the 'Actions' tab in your GitHub repository.
2. Select the 'Deploy Dev' workflow.
3. Click 'Run workflow' to manually dispatch the workflow.