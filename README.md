# GetMyCommits

- [GetMyCommits](#getmycommits)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Docker](#docker)
  - [License](#license)

This is a simple Node.js app that retrieves all commits by a given author from a Azure DevOps repository and displays them in a sortable table using the `datatables` library.

## Prerequisites

Before running this app, you will need:

- An Azure DevOps repository to fetch commits from
- A personal access token (PAT) with Code (read), Code (write), Code (manage) scopes to access the Azure DevOps REST API
- A .env -file which contains all the needed variables

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

```
USERNAME=<your_azure_devops_username>
AUTHOR=<your_azure_devops_firstname_lastname>
ORGANIZATION_NAME=<your_azure_devops_organization_name>
PROJECT_NAME=<your_azure_devops_project_name>
REPOSITORY_ID=<your_azure_devops_repository_id>
PERSONAL_ACCESS_TOKEN=<your_azure_devops_personal_access_token>
```
For example, if your Azure DevOps organization is named `myorg`, your project is named `myproject`, your repository ID is `myrepo`, and your personal access token is `abc123`, the `.env` file should contain:

```js
USERNAME="john.doe@example.com"
AUTHOR="John Doe"
ORGANIZATION_NAME="myorg"
PROJECT_NAME="myproject"
REPOSITORY_ID="myrepo"
PERSONAL_ACCESS_TOKEN="abc123"
```

1. Start the Node.js server by running:

```bash
npm start
```

The app will be running at `http://localhost:80`.

## Usage

1. Open your web browser and navigate to `http://localhost:80`.

2. The commits will be displayed in a sortable table with columns for the commit ID, author name, commit message, and commit date.

3. Click on any column header to sort the table by that column.

## Docker

You can also run the app using Docker. To do so, follow these steps:

1. Run docker-compose with created .env file

```
docker-compose --env-file .env up
```

The app will start and be available at http://localhost:80 in your web browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
