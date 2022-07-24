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
    question = questions[question.yes];
    askQuestion();
  },
  onFailure() {
    question = questions[question.no];
    askQuestion();
  },
  event: {
    type: "message",
    params: {
      data: question,
    },
  },
});

const askQuestion = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
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
      results.events.map((event) =>
        console.log("next :", event.params.data[answer])
      );
    })
    .catch((err) => console.log("err ", err));
};
