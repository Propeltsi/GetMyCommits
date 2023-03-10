require("dotenv").config();

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

var isEnvVarOK = true;

if (
  !username ||
  !personalAccessToken ||
  !repositoryId ||
  !author ||
  !organizationName ||
  !projectName
) {
  isEnvVarOK = false;
}

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
    if (!error && response.statusCode == 200 && isEnvVarOK) {
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
            <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.3/css/dataTables.bootstrap5.min.css"/>
          </head>
          <body>
            <div class="container">
              <h1>Commits for ${projectName} by ${author}</h1>
              <table id="commitsTable" class="table-hover">
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
            <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
            <script src="https://cdn.datatables.net/1.13.3/js/jquery.dataTables.min.js"></script>
            <script>
              $(document).ready(function() {
                $('#commitsTable').DataTable({
                  order: [[3, 'asc']],
                });
              });
            </script>
          </body>
        </html>
      `);
    } else if (!isEnvVarOK) {
      res
        .status(500)
        .send(
          "One or more required environment variables are missing or null."
        );
    } else {
      res.status(500).send("Failed to retrieve commits");
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
