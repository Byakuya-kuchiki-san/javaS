const subscribe = document.querySelector(".js-subscribe-button");
const costOfOrder = document.querySelector(".costOfOrder");
const calculate = document.querySelector(".calculate");
subscribe.addEventListener("click",()=>{
    if(subscribe.innerHTML === "Subscribed"){
         subscribe.innerHTML = "Subscribe";
         subscribe.classList.remove("subscribe-2");
    }else{
         subscribe.innerHTML = "Subscribed";
         subscribe.classList.add("subscribe-2");
    }
});

calculate.addEventListener("click",()=>{
   const order = Number(costOfOrder.value || costOfOrder.innerText);
   const result = ( order > 40 )?order:order+10;
   document.querySelector(".result").innerHTML = "$"+result;
})

