
// Need this global object for calculations etc
const selectedOptions = {

}
const optionGroups = document.querySelectorAll(".option-group");
if (optionGroups.length) {
    const totalSelectionsDiv = document.querySelector("#total-selections");
    totalSelectionsDiv.innerText = optionGroups.length;
    let totalScore = 0;
    optionGroups.forEach((optionGroup, groupIndex) => {
        optionGroup.name = `option-group-${groupIndex}`;
        const options = optionGroup.querySelectorAll(".option input[type='radio']");
        const optionSelectedValue = optionGroup.querySelector(".option-selected-value");
        if (options.length) {
            options.forEach((option, optionIndex) => {
                if (optionIndex === 0) {
                    totalScore += parseFloat(option.value);
                }
                option.id = `group-${groupIndex}-option-${optionIndex}`;
                const optionLabel = option.nextElementSibling;
                if (optionLabel) {
                    optionLabel.setAttribute("for", `group-${groupIndex}-option-${optionIndex}`);
                }
                option.onclick = e => {
                    // option.checked = true;
                    const { value } = e.target.dataset;
                    const parent = e.target.parentElement.parentElement.parentElement.parentElement;
                    if (parent && value) {
                        parent.className = `option-group ${value}`;
                    }
                    selectedOptions[optionGroup.name] = parseFloat(option.value);
                    optionSelectedValue.innerText = option.value;
                    updateSidePanels();
                }
            })
        }
    });
    const totalScoreDiv = document.querySelector("#total-score");
    totalScoreDiv.innerText = totalScore;
}
function updateSidePanels() {
    let selectionsMade = 0;
    let currentScore = 0;
    for (let i in selectedOptions) {
        selectionsMade += 1;
        currentScore += selectedOptions[i];
    }
    const selectionsMadeDiv = document.querySelector("#selections-made");
    selectionsMadeDiv.innerText = selectionsMade;
    const currentScoreDiv = document.querySelector("#current-score");
    currentScoreDiv.innerText = currentScore;
}









window.onscroll = function () { stickySidebar() };


const sidebars = document.querySelectorAll(".sidebar-wrap");
const header = document.querySelector(".header");

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickySidebar() {
    if (sidebars.length) {
        sidebars.forEach(sidebar => {
            const sticky = sidebar.offsetTop - header.scrollHeight;
            if (window.pageYOffset > sticky) {
                sidebar.classList.add("sticky");
                sidebar.style.width = sidebar.parentElement.scrollWidth - 30 + "px";
            } else {
                sidebar.classList.remove("sticky");
                sidebar.style.width = null;
            }
        })
    }
}


// function headerMenuHandler() {
//     const headerMenu = document.querySelector(".header-menu");
//     const hamburgetBtn = document.querySelector("#menu-active");
//     const menuCloseBtn = document.querySelector("#menu-close");
//     hamburgetBtn.onclick = e => {
//         e.preventDefault();
//         headerMenu.classList.add("active")
//     }
//     menuCloseBtn.onclick = e => {
//         e.preventDefault();
//         headerMenu.classList.remove("active")
//     }
// }
// headerMenuHandler();


// function scoreSubmitHandler() {
//     const submitBtn = document.querySelector("#submit-score");
//     if (submitBtn) {
//         submitBtn.onclick = e => {
//             e.preventDefault();
//             let currentScore = 0;
//             for (let i in selectedOptions) {
//                 currentScore += selectedOptions[i];
//             }
//             let x = infoFormInputs

//             const link = `${window.location.origin}/result?score=${currentScore}&supervisor=${x.supervisor}&studentName=${x.studentName}&studentId=${x.studentId}&projectTitle=${x.projectTitle}&programme=${x.programme}`;
//             window.location.href = link;
//             // console.log(currentScore)
//             // console.log(infoFormInputs)

//         }
//     }
// } scoreSubmitHandler();

const infoFormInputs = {

}

function infoInputHandler() {
    const inputs = document.querySelectorAll(".info-input");
    if (inputs) {
        inputs.forEach(input => {
            input.oninput = e => {
                infoFormInputs[e.target.name] = e.target.value
            }
        })
    }
} infoInputHandler();

function infoInputSubmitHandler() {
    const submitBtn = document.querySelector("#info-submit");
    if (submitBtn) {
        submitBtn.onclick = e => {
            e.preventDefault();
            let error = false;
            const inputs = document.querySelectorAll(".info-input");
            inputs.forEach(input => {
                if (input.value === "") {
                    error = true;
                }
            });
            if (error) {
                alert("Required fields are missing")
            }
            else {
                const step1 = document.querySelector("#step-1");
                const step2 = document.querySelector("#step-2");
                step1.remove();
                step2.style.display = "flex";
            }
        }
    }
} infoInputSubmitHandler();

// function scoreSubmitHandler() {
//     const submitBtn = document.querySelector("#submit-score");
//     if (submitBtn) {
//         submitBtn.onclick = e => {
//             e.preventDefault();
//             let currentScore = 0;
//             for (let i in selectedOptions) {
//                 currentScore += selectedOptions[i];
//             }

//             const optionGroups = document.querySelectorAll(".option-group");
//             if (optionGroups.length) {
//                 const selectedValuesArr = [];
//                 optionGroups.forEach(group => {
//                     const selectedInput = group.querySelector("input[type='radio']:checked");
//                     if (selectedInput) {
//                         selectedValuesArr.push(selectedInput.value);
//                     }
//                     else {
//                         selectedValuesArr.push("0");
//                     }
//                 })
//                 console.log(selectedValuesArr);
//                 fetch('/test/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(selectedValuesArr),
//                 })
//                     .then(response => response.blob()) // Convert response to a Blob
//                     .then(blob => {
//                         // Create a URL for the Blob data
//                         const url = window.URL.createObjectURL(blob);

//                         // Create an anchor element to trigger the download
//                         const a = document.createElement('a');
//                         a.href = url;
//                         a.download = 'example.pdf';

//                         // Trigger a click event on the anchor element to start the download
//                         a.click();

//                         // Release the Blob URL
//                         window.URL.revokeObjectURL(url);
//                     })
//                     .catch(error => {
//                         console.error('Error:', error);
//                     });
//             }

//             // const link = `${window.location.origin}/result?score=${currentScore}`;
//             // window.location.href = link;
//             console.log(currentScore)
//         }
//     }
// } scoreSubmitHandler();

function scoreSubmitHandler() {
    const submitBtn = document.querySelector("#submit-score");
    if (submitBtn) {
        submitBtn.onclick = e => {
            e.preventDefault();
            let currentScore = 0;
            for (let i in selectedOptions) {
                currentScore += selectedOptions[i];
            }

            const optionGroups = document.querySelectorAll(".option-group");
            if (optionGroups.length) {
                const selectedValuesArr = [];
                optionGroups.forEach(group => {
                    const selectedInput = group.querySelector("input[type='radio']:checked");
                    if (selectedInput) {
                        selectedValuesArr.push(selectedInput.value);
                    }
                    else {
                        selectedValuesArr.push("0");
                    }
                })
                const payload = {
                    userInfo: infoFormInputs,
                    selections: selectedValuesArr,
                }
                // console.log(payload);
                fetch('/getPDF/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
                    .then(response => response.blob()) // Convert response to a Blob
                    .then(blob => {
                        // Create a URL for the Blob data
                        const url = window.URL.createObjectURL(blob);

                        // Create an anchor element to trigger the download
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'result.pdf';

                        // Trigger a click event on the anchor element to start the download
                        a.click();

                        // Release the Blob URL
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

            }

            // const link = `${window.location.origin}/result?score=${currentScore}`;
            // window.location.href = link;
            // console.log(currentScore)
        }
    }
} scoreSubmitHandler();