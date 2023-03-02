# GetMyCommits

This is a simple Node.js app that retrieves all commits by a given author from a public Azure DevOps repository and displays them in a sortable table using the `datatables` library.

## Prerequisites

Before running this app, you will need:

- Node.js installed on your machine
- A public Azure DevOps repository to fetch commits from
- A personal access token (PAT) with the appropriate scopes to access the Azure DevOps REST API

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/Propeltsi/GetMyCommits.git
```

2. Install the required dependencies by running:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and add the following variables:

```js
ORGANIZATION_NAME=<your_azure_devops_organization_name>
PROJECT_NAME=<your_azure_devops_project_name>
REPOSITORY_ID=<your_azure_devops_repository_id>
PERSONAL_ACCESS_TOKEN=<your_azure_devops_personal_access_token>
```
For example, if your Azure DevOps organization is named `myorg`, your project is named `myproject`, your repository ID is `myrepo`, and your personal access token is `abc123`, the `.env` file should contain:

```js
ORGANIZATION_NAME=myorg
PROJECT_NAME=myproject
REPOSITORY_ID=myrepo
PERSONAL_ACCESS_TOKEN=abc123
```

1. Start the Node.js server by running:

```bash
npm start
```

The app will be running at `http://localhost:3000`.

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.

2. Enter the author's name and click "Get Commits" to retrieve all commits by that author from the specified Azure DevOps repository.

3. The commits will be displayed in a sortable table with columns for the commit ID, author name, commit message, and commit date.

4. Click on any column header to sort the table by that column.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
