require("dotenv").config();

const winston = require("winston");

const username = process.env.USERNAME;
const personalAccessToken = process.env.PAT;
const repositoryId = process.env.REPO_ID;
const author = process.env.AUTHOR;
const organizationName = process.env.ORGANIZATION_NAME;
const projectName = process.env.PROJECT_NAME;

const request = require("request");
const express = require("express");

const app = express();
const port = 80;

app.use(express.static("public"));
app.get("/", (req, res) => {
  const url = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repositoryId}/commits?searchCriteria.author=${author}&api-version=5.1`;

  const options = {
    url,
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${username}:${personalAccessToken}`
      ).toString("base64")}`,
    },
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const commits = JSON.parse(body).value.map((commit) => ({
        id: commit.commitId,
        author: commit.author.name,
        message: commit.comment,
        date: commit.author.date,
      }));

      res.send(`
        <html>
          <head>
            <title>Commits for ${projectName} by ${author}</title>
            <link rel="stylesheet" href="/css/bootstrap.min.css">
            <link rel="stylesheet" href="/css/style.css">
            <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.11.4/datatables.min.css"/>
          </head>
          <body>
            <div class="container">
              <h1>Commits for ${projectName} by ${author}</h1>
              <table id="commitsTable" class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Author</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${commits
                    .map(
                      (commit) => `
                    <tr>
                      <td><a href="https://dev.azure.com/${organizationName}/${projectName}/_git/${repositoryId}/commit/${
                        commit.id
                      }" target="_blank">${commit.id}</a></td>
                      <td>${commit.author}</td>
                      <td>${commit.message}</td>
                      <td>${new Date(commit.date).toLocaleString()}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script src="https://cdn.datatables.net/v/bs4/dt-1.11.4/datatables.min.js"></script>
            <script>
              $(document).ready(function() {
                $('#commitsTable').DataTable();
              });
            </script>
          </body>
        </html>
      `);
    } else {
      logger.error(`Failed to connect to Azure DevOps: ${error.message}`);
      res.status(500).send("Failed to retrieve commits");
    }
  });
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
