import { Engine } from "json-rules-engine";
import inquirer from "inquirer";
import { questions } from "./questions.js";

let engine = new Engine();
let currentQuestion = 0;
let question = questions[currentQuestion];

engine.addRule({
  conditions: {
    all: [question],
  },
  onSuccess() {
    currentQuestion = 2;
    askQuestion();
  },
  onFailure() {
    askQuestion();
  },
  event: {
    type: "message",
    params: {
      data: "hello-world!",
    },
  },
});

const askQuestion = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "qOne",
        message: question.question,
        validate: (answer) => {
          let res = runRules(answer);
          return true;
        },
      },
    ])
    .then((answers) => {
      console.info(answers);
    });
};

askQuestion();

const runRules = (answer) => {
  engine
    .run({ [question.fact]: answer })
    .then((results) => {
      console.log("after...", results.events);
      //results.events.map((event) => console.log("value :", event.params.data));
    })
    .catch((err) => console.log("err ", err));
};
