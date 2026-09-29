let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");

const generateComputerScore = () => {
    const choice = ['rock','paper','scissors']
    const compScore = Math.floor(Math.random() * 3);
    return choice[compScore];
}

const reset = () =>{
    userScore = 0;
    compScore = 0;
    document.getElementById("userScore").innerText = userScore;
    document.getElementById("compScore").innerText = compScore;
    document.getElementById("result").innerText = "Place your move";
}

const playGame = (userChoice) => {
   const computerChoice = generateComputerScore();

  if (userChoice === computerChoice) {
   document.getElementById("result").innerHTML = `You choose ${userChoice} and Computer choose ${computerChoice} it's Draw`
  } else {
    // Check all winning conditions
    if (
      (userChoice === "r" && computerChoice === "s") ||
      (userChoice === "p" && computerChoice === "r") ||
      (userChoice === "s" && computerChoice === "p")
    ) {
      document.getElementById("result").innerHTML = `You choose ${userChoice} and computer choose ${computerChoice} You win`;
      userScore++;
      document.getElementById("userScore").innerText = userScore;
    } else {
      document.getElementById("result").innerHTML = `You choose ${userChoice} and computer choose ${computerChoice} Computer wins`;
      compScore++;
      document.getElementById("compScore").innerText = compScore;
    }
  }
}

document.getElementById("resetBtn").addEventListener("click",()=>{
    reset();
})

choices.forEach((choice) => {
   choice.addEventListener("click",()=>{
    const choiceId = choice.getAttribute("id");
    playGame(choiceId);
   }) 
});



