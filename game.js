var buttonPads = $(".btn")
var buttonColours = [];

for (var buttonOrd=0;buttonOrd<buttonPads.length;buttonOrd++) {
  buttonColours.push(buttonPads[buttonOrd].id);
}

var gamePattern = [];
var userChosenColour;
var userClickedPattern = [];
var blnGameActive = false;
var level = 0;

// used to impose a delay in the loop
const timer = ms => new Promise(res => setTimeout(res, ms))
// need to declare as async function to use Promise() function
async function nextSequence() {
  // Plays the next colour in the sequence
  // Increment level
  await timer(200);
  level++
  showLevel();
  userClickedPattern=[];
  gamePattern=[];
  for (var i=0;i<level;i++) {
    var randomNumber = Math.round(Math.random()*(buttonPads.length-1),0);
    var randomChosenColour = buttonColours[randomNumber];
    // console.log(randomChosenColour);
    playSound(randomChosenColour);
    animatePress(randomChosenColour);
    gamePattern.push(randomChosenColour);
    await timer(1000); /* used to impose a delay in the loop so that the buttons are pressed incrementally */
  }
}

function playSound(colour) {
  var soundColour = new Audio("sounds/"+colour+".mp3");
  soundColour.play();
}

function animatePress(colour) {
  $(".btn."+colour).fadeOut(250).fadeIn(250);
  $(".btn."+colour).addClass("pressed");
  setTimeout(function(){ $(".btn."+colour).removeClass("pressed");; }, 250);
}

function showGameOverLevel() {
  $("h1").html("Game Over. You reached level: "+level+"<br><br>Press A Key to Start a New Game.");
  $("body").addClass("game-over");
  blnGameActive=false;
  level=0;
  userClickedPattern=[];
  gamePattern=[];
}

function showLevel() {
  $("h1").text("Level "+level);
}

function checkAnswer(colour) {
  var i = userClickedPattern.length-1;
  if (i>gamePattern.length-1) {
    return false;
  }
  else if (userClickedPattern[i] === gamePattern[i]) {
    return true;
  }
  else {
    return false;
  }
}

$(document).keypress(function(event) {
  showLevel();
  if (!blnGameActive) {
    if ($("body").hasClass("game-over")) {
      $("body").removeClass("game-over");
    }
    blnGameActive = true;
    nextSequence();
  }
});

buttonPads.click(function() {
  if (blnGameActive) {
    userChosenColour = this.id;
    playSound(userChosenColour);
    animatePress(userChosenColour);
    userClickedPattern.push(userChosenColour);
    if (checkAnswer(userChosenColour)) {
      // Check if round completed
      if (userClickedPattern.length === gamePattern.length) {
        setTimeout(function(){ nextSequence(); }, 1000);
      }
    }
    else {
      playSound("wrong");
      // Invalid choice - end game
      showGameOverLevel();
    }
  }
});
