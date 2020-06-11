// Calling all the dependencies and packages that I need
const fs = require("fs")
const inquirer = require("inquirer")
const util = require("util")
const axios = require("axios")
const figlet = require('figlet');

// Making my async write and append functions
const appendFileAsync = util.promisify(fs.appendFile)
const writeFileAsync = util.promisify(fs.writeFile)

//This is the function I use to make a repo specific badge
//I had to have this outside because of problem with it being in a callback function
//I forge why honestly
const axiosGetContributors = async (url, repo) => {

  //Call axios with the given url and save the data
  const data = await axios
    .get(url)

  const returnData = []
  //Look for the repo in the list of user repos
  const relevantRepo = data.data.filter(repos => {return repos.name === repo})

  //If the repo was not found, return an invalid state
  if (relevantRepo.length === 0){

    return "Invalid"

  }

  //Get the contributors url
  //toWriteBadge should always be 1 if a repo was present (true)
  const contriURL = relevantRepo[0].contributors_url
  const toWriteBadge = relevantRepo.length

  //Adds that data to the array to be returned
  returnData.push(contriURL, toWriteBadge)

  return returnData

}

//ASCII Art title
console.log(figlet.textSync('README Generator', {
  horizontalLayout: 'default',
  verticalLayout: 'default'
  })
)

//Some filler description text
console.log("Hello! This README generator will generate a good starting point for a README file.")
console.log("Use it as a template and add to it as needed!")
console.log("Just answer the following questions to get started." + "\n")

//Start of prompts to create the README
//Notice that some choices are booleans to decide whether or not sections will be included
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

    //Destructuring the response
    const { username, name, repo, description, contents, install, usage, testBool, tests, contributingBool, contributing, license } = response
    const queryUrl = `https://api.github.com/users/${username}`
    const queryRepoUrl = `https://api.github.com/users/${username}/repos?per_page=100`

    //If no repo was entered, no repo specific badge will be used
    if (repo === "") {

      await writeFileAsync("readme/README.md", `[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)` + "\n")

    }

    //Otherwise a repo specific badge will be used
    else {

      //axios call using a built url given the user's inputs
      let badgesData = await axiosGetContributors(queryRepoUrl, repo)

      //What to do if state is invalid
      if (badgesData === "Invalid"){
  
        console.log("Repo name not found! No badge added.")
        await writeFileAsync("readme/README.md", `[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)` + "\n")

      }
      
      else {
  
        await writeFileAsync("readme/README.md", `[![GitHub contributors](https://img.shields.io/github/contributors/${username}/${repo}.svg)](${badgesData[0]})` + "\n")
  
      }

    }

    //Start adding pieces to the README
    await appendFileAsync("readme/README.md", `# ${name}` + "\n")
    await appendFileAsync("readme/README.md", `${description}
    ` + "\n")
    //I don't really know where to put catch statements so they're just everywhere
    .catch(

      err => console.log(err)

    )
    
    //Multiple if statements with all the needed permutations of the table of contents
    //Changes based on what the user decided they need
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

    else if (contents === 'true') {

      await appendFileAsync("readme/README.md", `# Table of Contents` + "\n")
      await appendFileAsync("readme/README.md", 
      `   
- [Installation](#Installation)
- [Usage](#Usage)
- [License](#License)
- [Questions](#Questions)` + "\n")

    }

  //Building up more of the README
  await appendFileAsync("readme/README.md", `
# Installation
${install}` + "\n")

  await appendFileAsync("readme/README.md", `
# Usage
${usage}` + "\n")
  .catch(

    err => console.log(err)

  )  

  //bools deciding on tests and contributing
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

  //axios call in order to get user avatar and Github URL
  axios
    .get(queryUrl)
    .then(async function(res) {

      const { login, avatar_url, html_url, email} = res.data

      //Response changes if user has public email or not
      if (email === null){

        await appendFileAsync("readme/README.md", `
# Questions
## ${login}

![${login}'s profile picture](${avatar_url})


Please visit my GitHub: ${html_url}

Questions can be sent there.
` + "\n")

      }

      else {

        await appendFileAsync("readme/README.md", `
# Questions
## ${login}

![${login}'s profile picture](${avatar_url})


Please visit my GitHub: ${html_url}

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


