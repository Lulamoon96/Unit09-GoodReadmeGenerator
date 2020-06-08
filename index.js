const fs = require("fs")
const inquirer = require("inquirer")
const util = require("util")
const axios = require("axios")

const appendFileAsync = util.promisify(fs.appendFile)
const writeFileAsync = util.promisify(fs.writeFile)

inquirer
  .prompt([
    {
      type: "input",
      message: "What is your github user name?",
      name: "username"
    },
    {
      type: "input",
      message: "What is your project called?",
      name: "name"
    },
    {
        type: "input",
        message: "Please type in the exact repo of the project if applicable. If not, leave blank.",
        name: "repo"
    },
    {
      type: "input",
      message: "Please type in a short description of the project.",
      name: "description"
    },
    {
      type: "input",
      message: "Would you like a table of contents? (true or false)",
      name: "contents"
    }
  ])
  .then(async function(response) {

    // console.log(response)
    // const queryUrl = `https://api.github.com/users/${username}`
    const { name, description, contents } = response


    await writeFileAsync("readme/README.md", `[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)` + "\n")
    await appendFileAsync("readme/README.md", `# ${name}` + "\n")
    await appendFileAsync("readme/README.md", `${description}` + "\n")
    .catch(function(err) {

        console.log(err);

    })
    
    if (contents === 'true'){
        
        await appendFileAsync("readme/README.md", `# Table of Contents` + "\n")
        await appendFileAsync("readme/README.md", 
        `
- [Usage](#usage)
- [License](#License)
- [Contributing](#Contributing)
- [Tests](#Test)
- [Questions](#Question)
        ` + "\n")
        .catch(function(err) {

            console.log(err);
    
        })

    }
    // axios
    //     .get(queryUrl)
    //     .then(function(res) {

    //         const { login, avatar_url } = res.data

    //     })
    //     .catch(function(err) {

    //         console.log(err);

    //     })

  })
