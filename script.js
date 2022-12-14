var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const toolBoxColor = document.querySelectorAll(".toolbox-color-cont>*");
const removeBtn = document.querySelector(".fa-xmark");
// console.log(addBtn);

let colors = ["lightpink", "lightgreen", "lightblue", "black"];
// set the default color of priority is black.
let modalPriorityColor = colors[colors.length - 1];
let ticketArr = [];

// presence of modal on the screen.
// (phase-1)
let isModalPresent = false;
addBtn.addEventListener("click", function(event) {
    // console.log(event);
    // when we add any event after applying that event it will return the object of that event in callback function
    if(!isModalPresent) {
        modalCont.style.display = "flex";
    } else if(isModalPresent) {
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;

});

// generate ticket
// (phase-2)
modalCont.addEventListener("keydown", function(e) {
    console.log(e);
    if(e.key == "Shift") {
        // 1. create a ticket by call function createTicket()
        // phase-2 call from here
        createTicket(modalPriorityColor, textArea.value);
        // 2. hide the modal
        modalCont.style.display = "none";
        // 3.update the information about modal
        isModalPresent = false;
        textArea.value = "";
    }
});

// (phase - 2)
function createTicket(ticketColor, data, ticketId) {
    // generate an Id.
 /*
    if(!ticketId)
        id = uid();
    else
        id = ticketId;
  */      
    let id = ticketId || uid();

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class = "ticket-color ${ticketColor}"></div>
        <div class = "ticket-id">#${id}</div>
        <div class = "task-area">${data}</div>
        <div class = "ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    // if the ticket is generated for the first time stored it into a local storage
    if(!ticketId) {
        ticketArr.push({
            ticketId : id,
            ticketColor,
            ticketTask : data,
        });
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    }

    // call this function to remove the ticket when the removal button is active.
    handleRemoval(ticketCont, id);

    //call this function to handle the ticket Priority color.
    handlePriorityColor(ticketCont, id);

    //call this function to handle the ticket lock to open or lock again.
    handleLock(ticketCont, id);
};

// getting data from the localStorage, to display in the screen or to re rendering the ticket.
// check is anything stored in localStorage.
// (phase 3)
if (localStorage.getItem("tickets")) {
    ticketArr = JSON.parse(localStorage.getItem("tickets"));
    ticketArr.forEach(ticketObj => createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId))
}
// part of phase 2
allPriorityColors.forEach(colorElement => {
    colorElement.addEventListener("click", function() {
        allPriorityColors.forEach(el => {
            el.classList.remove("active");
        });
        colorElement.classList.add("active");
        modalPriorityColor = colorElement.classList[0];
    });
});

// getting tickets on the basis of colors(single click all display all same color tickets).
// (phase 4)
for(let i=0; i<toolBoxColor.length; ++i) {
    // display the same color tickets on single click.
    toolBoxColor[i].addEventListener("click", function() {
        let currColor = toolBoxColor[i].classList[0];
        let filteredTickets = ticketArr.filter(ticketObj => ticketObj.ticketColor == currColor);

        // remove all the tickets.
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(ticket => ticket.remove());

        // display filtered tickets.
        filteredTickets.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    });

    //display the all tickets on double click.
    toolBoxColor[i].addEventListener("dblclick", function() {
        //display all tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(ticket => ticket.remove());

        ticketArr.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    });


};

//(phase 5)
//toggling the remove btn.
let isRemoveBtnActive = false;
removeBtn.addEventListener("click", function() {
    // case 1 -> If removeBtn is not active then make it active i.e. red color.
    if(!isRemoveBtnActive) {
        removeBtn.style.color = "red";
    }
    // case 2 -> If removeBtn is active then make it inactive i.e. white color.
    else if(isRemoveBtnActive) {
        removeBtn.style.color = "white";
    }
    isRemoveBtnActive = !isRemoveBtnActive;
});

//(phase 6)
function handleRemoval(ticketCont, id) {
    ticketCont.addEventListener("click", function() {
        if(!isRemoveBtnActive)
            return;

        //1.remove the ticket from ticketArr.
        let index = getTicketIdx(id);
        ticketArr.splice(index, 1);
        //2.set in localStorage.
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
        //3.remove from the frontend.
        ticketCont.remove();
    });
};

//it will return the index of that specific ticket.
function getTicketIdx(id) {
    let index = ticketArr.findIndex(ticketObj => {
        return ticketObj.ticketId == id;
    });
    return index;
};

// (phase 7)
//set the new Priority color if priorty of that work is changed after creating the ticket.
function handlePriorityColor(ticketCont, id) {
    let ticketColor = ticketCont.querySelector(".ticket-color");

    //add event listener of type click on ticketColor
    ticketColor.addEventListener("click", function(){
        let currTicketColor = ticketColor.classList[1];
        let currTicketIndex = colors.indexOf(currTicketColor);
        let newTicketIndex = (currTicketIndex + 1) % 4;
        let newTicketColor = colors[newTicketIndex];

        //remove current color class from that ticket.
        ticketColor.classList.remove(currTicketColor);
        //add that new color class in that ticket.
        ticketColor.classList.add(newTicketColor);

        //get the index of new color.
        let index = getTicketIdx(id);
        ticketArr[index].ticketColor = newTicketColor;
        //set in localStorage.
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
};


{/* <i class="fa-solid fa-lock-open"></i> */}
const unlock = "fa-lock-open";
function handleLock(ticketCont, id) {
    let ticketLock = ticketCont.querySelector(".ticket-lock");
    let lock = ticketLock.children[0].classList[1];
    let ticketTaskArea = ticketCont.querySelector(".task-area");

    ticketLock.addEventListener("click", function() {
        if(ticketLock.children[0].classList.contains(lock)) {
            //reomve the lock class.
            ticketLock.children[0].classList.remove(lock);
            //add the unlock class in it.
            ticketLock.children[0].classList.add(unlock);

            //make content editable 
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else if(ticketLock.children[0].classList.contains(unlock)) {
            //reomve the unlock class.
            ticketLock.children[0].classList.remove(unlock);
            //add the lock class in it.
            ticketLock.children[0].classList.add(lock);

            //make the content/task area uneditable again
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        //get the index of that ticket.
        let index = getTicketIdx(id);
        ticketArr[index].ticketTask = ticketTaskArea.textContent;   // can also use innerText here in place of textContent

        //again stored in localstorage.
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
};