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
const port = 3000;

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
            <title>Commits by ${author}</title>
            <link rel="stylesheet" href="/css/bootstrap.min.css">
            <link rel="stylesheet" href="/css/style.css">
          </head>
          <body>
            <div class="container">
              <h1>Commits by ${author}</h1>
              <table class="table table-striped">
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
          </body>
        </html>
      `);
    } else {
      res.send("Error");
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
