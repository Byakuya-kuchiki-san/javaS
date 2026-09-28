let choices = ['rock','paper','scissors'];

let computerMove = choices[Math.floor(Math.random()*2)];
console.log(computerMove);


document.querySelectorAll(".images").forEach((x) =>{
    x.addEventListener("click",()=>{
    console.log("Happy birthday to you my sister");
});
});

document.querySelectorAll("button").forEach((x) =>{
    x.addEventListener("click",()=>{
   document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction:row; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                font-family: 'Courier New', Courier, monospace;
                font-size: 2rem;
            ">
    
     Happy birthday today, tomorrow and the day after tomorrow

      <img class="images" src="dp.jpg" alt="Rock" >
            </div>
        `;
});
});