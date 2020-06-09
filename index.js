const fs = require("fs")
const inquirer = require("inquirer")
const util = require("util")
const axios = require("axios")
const figlet = require('figlet');

const appendFileAsync = util.promisify(fs.appendFile)
const writeFileAsync = util.promisify(fs.writeFile)

console.log(figlet.textSync('README Generator', {
  horizontalLayout: 'default',
  verticalLayout: 'default'
  })
)

console.log("Hello! This README generator will generate a good starting point for a README file.")
console.log("Use it as a template and add to it as needed!")
console.log("Just answer the following questions to get started." + "\n")

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
        message: "Please type in the exact repo name of the project if applicable. If not, leave blank.",
        name: "repo"
    },
    {
      type: "input",
      message: "Please type in a brief description of the project.",
      name: "description"
    },
    {
      type: "input",
      message: "Would you like a table of contents? (true or false)",
      name: "contents"
    },
    {
      type: "input",
      message: "Please type in a brief description of how to install this program.",
      name: "install"
    },
    {
      type: "input",
      message: "Please type in a brief description of how this program is to be used.",
      name: "usage"
    },
    {
      type: "input",
      message: "Are there tests that can be done for this program? (true or false)",
      name: "testBool"
    },
    {
      type: "input",
      message: "Please type in a brief description of how this program can be tested. (Leave blank if last answer was false.)",
      name: "tests"
    },
    {
      type: "input",
      message: "Can users contribute to your program? (true or false)",
      name: "contributingBool"
    },
    {
      type: "input",
      message: "Please type in a brief description of how a user can contribute to this program. (Leave blank if last answer was false.)",
      name: "contributing"
    },
    {
      type: "input",
      message: "What license will this program fall under?",
      name: "license"
    }  
  ])
  .then(async function(response) {

    // console.log(response)
    const { username, name, repo, description, contents, install, usage, testBool, tests, contributingBool, contributing, license } = response
    const queryUrl = `https://api.github.com/users/${username}`
    const queryRepoUrl = `https://api.github.com/users/${username}/repos?per_page=100`
    const queryEmailUrl = `https://api.github.com/users/${username}/public_emails`


    await writeFileAsync("readme/README.md", `[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)` + "\n")
    await appendFileAsync("readme/README.md", `# ${name}` + "\n")
    await appendFileAsync("readme/README.md", `${description}
    ` + "\n")
    .catch(function(err) {

        console.log(err);

    })
    
    if (contents === 'true' && testBool === 'true' && contributingBool === 'true'){
        
        await appendFileAsync("readme/README.md", `# Table of Contents` + "\n")
        await appendFileAsync("readme/README.md", 
        `   
- [Installation](#Installation)
- [Usage](#Usage)
- [Tests](#Tests)
- [Contributing](#Contributing)
- [License](#License)
- [Questions](#Questions)` + "\n")
        .catch(

          err => console.log(err)

        )  

    }

    else if (contents === 'true' && contributingBool === 'true') {
    
      await appendFileAsync("readme/README.md", `# Table of Contents` + "\n")
      await appendFileAsync("readme/README.md", 
      `   
- [Installation](#Installation)
- [Usage](#Usage)
- [Contributing](#Contributing)
- [License](#License)
- [Questions](#Questions)` + "\n")
      .catch(

        err => console.log(err)

      )  

    }

    else if (contents === 'true' && testBool === 'true') {

      await appendFileAsync("readme/README.md", `# Table of Contents` + "\n")
      await appendFileAsync("readme/README.md", 
      `   
- [Installation](#Installation)
- [Usage](#Usage)
- [Tests](#Tests)
- [License](#License)
- [Questions](#Questions)` + "\n")
      .catch(

        err => console.log(err)

      )  

    }

  await appendFileAsync("readme/README.md", `
# Installation
${install}` + "\n")

  await appendFileAsync("readme/README.md", `
# Usage
${usage}` + "\n")
  .catch(

    err => console.log(err)

  )  

  if (testBool === 'true'){

    await appendFileAsync("readme/README.md", `
# Tests
${tests}` + "\n")

  }

  if (contributingBool === 'true'){

    await appendFileAsync("readme/README.md", `
# Contributing
${contributing}

For more details on how to contribute, see CONTRIBUTING.MD.` + "\n")
    .catch(

      err => console.log(err)

    )  

  }

  await appendFileAsync("readme/README.md", `
# License
This project is licensed under the ${license} license. Please see the LICENSE.MD file for more details.` + "\n")
.catch(

  err => console.log(err)

)  


  axios
    .get(queryUrl)
    .then(async function(res) {

      const { login, avatar_url, html_url, email} = res.data
      if (email === null){

        await appendFileAsync("readme/README.md", `
# Questions
## ${login}

![${login}'s profile picture](${avatar_url})


Please visit my GitHub repo: ${html_url}

Questions can be sent there.
` + "\n")

      }

      else {

        await appendFileAsync("readme/README.md", `
# Questions
## ${login}

![${login}'s profile picture](${avatar_url})


Please visit my GitHub repo: ${html_url}

Questions can be sent there.

Or, send an email: ${email}
` + "\n")

      }
      
    })
    .catch(
      
      err => console.log(err)

    )

.then(

  console.log("README generated!")

)


    })


