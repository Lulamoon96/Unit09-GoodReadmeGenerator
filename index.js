const fs = require("fs")
const inquirer = require("inquirer")
const util = require("util")

const appendFileAsync = util.promisify(fs.appendFile)

inquirer
  .prompt([
    {
      type: "input",
      message: "What is your user name?",
      name: "username"
    },
    {
      type: "input",
      message: "Put some crap here.",
      name: "confirm"
    }
  ])
  .then(function(response) {

    for (let [key, value] of Object.entries(response)) {
    
        appendFileAsync("readme/test.txt", `${key}: ${value}` + "\n")
    
    }

  })
