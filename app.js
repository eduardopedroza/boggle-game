// $(document).ready(function() {
//     let score = 0;  // initialize score
//     let timeLeft = 60;  // countdown starts from 60 seconds

//     function displayScore() {
//         $("#score-display").text(`Score: ${score}`);  // display current score
//     }

//     displayScore();  

//     function displayTime() {
//         $("#timer-display").text(`Time left: ${timeLeft} seconds`);
//     }

//     displayTime();  


//     let timer = setInterval(function() {
//         timeLeft--;
//         displayTime();

//         if (timeLeft <= 0) {
//             endGame();
//         }
//     }, 1000); 

//     function endGame() {
//         clearInterval(timer);  
    
//         $("#guess-form").off("submit"); 
//         $("#word").prop("disabled", true); 
//         $("#submit-guess").prop("disabled", true);  
//         $("#result-message").text("Time's up! Game over.");
        
//         axios.post('/update-score', { score: score })
//             .then(function(response) {
//                 if (response.data.status === 'success') {
//                     console.log('Score updated successfully!');
                    
//                     $("#high-score-display").text(`High Score: ${response.data.high_score}`);
//                     $("#games-played-display").text(`Games Played: ${response.data.games_played}`);
                    
//                 } else {
//                     console.error('Failed to update score.');
//                 }
//             })
//             .catch(function(error) {
//                 console.error('Error occurred while sending the score:', error);
//             });

//         $("#restart-button").show();
//     }


//     $("#guess-form").on("submit", function(e) {
//         e.preventDefault();

//         let guess = $("#word").val();
//         console.log(guess)
        
//         axios.get('/check-word', { params: { word: guess } })
//         .then(function (response) {
//             let result = response.data.result;
//             if (result === "ok") {
//                 $("#result-message").text("Great! That's a valid word on the board.");
//                 score += guess.length; // Add the length of the word to the score
//                 displayScore();  // Update the score on the page
//             } else if (result === "not-on-board") {
//                 $("#result-message").text("The word is valid, but it's not on the board.");
//             } else {
//                 $("#result-message").text("That's not a valid word.");
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//             $("#result-message").text("Error occurred while checking the word.");
//         });
//     });
// });

// $("#restart-button").click(function() {
//     $(this).hide();

//     score = 0; 
//     $("#score-display").text("Score: " + score);
    
//     $("#result-message").text("");
    
//     $("#guess-form").on("submit", handleGuess); 
//     $("#word").prop("disabled", false); 
//     $("#submit-guess").prop("disabled", false); 

//     startTimer();

// });

$(document).ready(function() {
    let score = 0;  // initialize score
    let timeLeft = 60;  // countdown starts from 60 seconds
    let timer;

    function displayScore() {
        $("#score-display").text(`Score: ${score}`);  // display current score
    }

    displayScore();


    function displayTime() {
        $("#timer-display").text(`Time left: ${timeLeft} seconds`);
    }

    displayTime();

    function startTimer() {
        console.log("hi")
        timeLeft = 60; // Reset timer to 60 seconds
        displayTime(); // Display the initial time
        timer = setInterval(function() { // Start the countdown
            timeLeft--;
            displayTime();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000); 
    }

    startTimer();

    function endGame() {
        clearInterval(timer);  
    
        $("#guess-form").off("submit"); 
        $("#word").prop("disabled", true); 
        $("#submit-guess").prop("disabled", true);  
        $("#result-message").text("Time's up! Game over.");
        
        axios.post('/update-score', { score: score })
            .then(function(response) {
                if (response.data.status === 'success') {
                    console.log('Score updated successfully!');
                    
                    $("#high-score-display").text(`High Score: ${response.data.high_score}`);
                    $("#games-played-display").text(`Games Played: ${response.data.games_played}`);
                    
                } else {
                    console.error('Failed to update score.');
                }
            })
            .catch(function(error) {
                console.error('Error occurred while sending the score:', error);
            });

        $("#restart-button").show();
    }
    
    function updateBoard(board) {
        const table = $("table");
        table.empty();  // Clear the current board
    
        board.forEach(row => {
            let rowHTML = "<tr>";
            row.forEach(cell => {
                rowHTML += `<td>${cell}</td>`;
            });
            rowHTML += "</tr>";
            table.append(rowHTML);  // Add the new row to the board
        });
    }

    function handleGuessSubmission(e) {
        e.preventDefault();
    
        let guess = $("#word").val().trim(); // Get the word input by the user
    
        if (!guess) {
            $("#result-message").text("Please enter a word.");
            return;
        }
    
        axios.get('/check-word', { params: { word: guess } })
        .then(function (response) {
            let result = response.data.result;
            switch (result) {
                case "ok":
                    $("#result-message").text("Great! That's a valid word on the board.");
                    score += guess.length; 
                    displayScore();  
                    break;
                case "not-on-board":
                    $("#result-message").text("The word is valid, but it's not on the board.");
                    break;
                default:
                    $("#result-message").text("That's not a valid word.");
                    break;
            }
            $("#word").val("");
        })
        .catch(function (error) {
            console.error(error);
            $("#result-message").text("Error occurred while checking the word.");
        });
    }

    $("#restart-button").click(function() {
        $(this).hide();
    
        score = 0; 
        $("#score-display").text("Score: " + score);
        
        $("#result-message").text("");
        
        $("#guess-form").on("submit", handleGuessSubmission);
            
        $("#word").prop("disabled", false); 
        $("#submit-guess").prop("disabled", false); 
    
        startTimer(); // Restart the timer
    
        // Request a new board
        axios.get('/get-new-board')
            .then(function(response) {
                const newBoard = response.data.board;
                updateBoard(newBoard);
            })
            .catch(function(error) {
                console.error("Error getting a new board:", error);
            });
    });

    $("#guess-form").on("submit", handleGuessSubmission);
});


