var numberOfCards = 52;
var numberOfPlayers = 2;
var cardsPerPlayer = 8;

var cardToMatchInput = document.getElementById('cardToMatchInput');
var cardToMatchValue;

var startGameBtn = document.getElementById('startGame'); 
var cardValueBtn = document.getElementById('cardValue');
var resultsContainer = document.getElementById('results');

var cardsRemaining = document.getElementById('cardsRemaining');

//array Variables
var cardsArray = [];
var shuffledArray = [];
var player1 = [];
var player2 = [];

//other Variables
var whosTurn = 1;
var currentPlayer = document.getElementById('currentPlayer');
var player1Cards = document.getElementById('player1Hand').children[2];
var player2Cards = document.getElementById('player2Hand').children[2];
var player1Points = document.getElementById('player1Points');
var player2Points = document.getElementById('player2Points');
var player1TotalPoints = 0;
var player2TotalPoints = 0;
var duplicates = 0;
var numDuplicates = 0;
//Game Logic

function initCardsArray(){
	for (var j = 0; j < 4; j++) {
		
		for (var i = 1; i < (numberOfCards/4) + 1; i++) {
			switch (j) {
				case 0:
					cardsArray.push(i + '(S)');
					break;
				case 1:
					cardsArray.push(i + '(H)');
					break;
				case 2:
					cardsArray.push(i + '(C)');
					break;
				case 3:
					cardsArray.push(i + '(D)');
					break;
			}			
		}
	}
	return cardsArray;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function removeDuplicates(arr) {
		var currentArrayLength = arr.length;
    var counts = {};
    for(var i=0; i<arr.length; i++) {
        var item = arr[i];
        counts[item] = (counts[item]||0)+1;
    }
    var arr = [];
    for(item in counts) {
        if(counts[item] === 1) {
            arr.push(parseInt(item));
        }
    }
		
    return arr;
}

function shuffleCards() {
	return shuffledArray = shuffleArray(cardsArray).slice();
}

function resetValues() {
	cardsArray = [];
	shuffledArray = [];
	player1 = [];
	player2 = [];
	player1TotalPoints = 0;
	player1Points.innerHTML = '';
	player2TotalPoints = 0;
	player2Points.innerHTML = '';
	numDuplicates = 0;
	currentPlayer.innerHTML = 'Player ' + whosTurn;
}

function dealCards() {
	//deal random cards to each player
	for (var i = 0; i < cardsPerPlayer;i++) {
		player1.push(shuffledArray[i*numberOfPlayers]);
		player2.push(shuffledArray[i*numberOfPlayers + 1]);
	}
	console.log("Initial Hand P1: ", player1);
	console.log("Initial Hand P2: ", player2);
	removeInitialPairs();
	//get remainder of cards top put in draw pile
	shuffledArray.splice(0, shuffledArray.length - (numberOfCards - (cardsPerPlayer * numberOfPlayers)));
	cardsRemaining.innerHTML = shuffledArray;
}

function removeInitialPairs() {
	//remove pairs in players hand
	player1OriginalLength = player1.length;
	player1DupLength = removeDuplicates(player1).length;
	if (player1OriginalLength > player1DupLength) {
		duplicates = (player1OriginalLength - player1DupLength) /2;
		if (duplicates > 0) {
			player1 = removeDuplicates(player1);
			for (var i = 0; i < duplicates; i++) {
				player1TotalPoints += 1;
				player1Points.innerHTML = player1TotalPoints;
			}
		}
	}
	
	player2OriginalLength = player2.length;
	player2DupLength = removeDuplicates(player2).length;
	if (player2OriginalLength > player2DupLength) {
		duplicates = (player2OriginalLength - player2DupLength) /2;
		if (duplicates > 0) {
			player2 = removeDuplicates(player2);
			for (var i = 0; i < duplicates; i++) {
				player2TotalPoints += 1;
				player2Points.innerHTML = player2TotalPoints;	
			}
		}
	}
	player1Cards.innerHTML = player1;
	player2Cards.innerHTML = player2;
	//Set the current player when the game starts
	currentPlayer.innerHTML = "Player " + whosTurn;
}

function checkForMatch() {
	if (whosTurn === 1) {
		if (player2.indexOf(cardToMatchValue) != -1 ){
			console.log("MATCH P1");
			
			var filteredArray1 = player1.filter(function(e){
				return e!==cardToMatchValue;
			});
			var filteredArray2 = player2.filter(function(e){
				return e!==cardToMatchValue;
			});
			
			if (player1.length > filteredArray1.length) {	
				player1TotalPoints += 1;
				player1Points.innerHTML = player1TotalPoints;
			}
			
			player1 = filteredArray1;
			player2 = filteredArray2;
			
		} else {
			console.log("GO FISH!");
			player1.push(shuffledArray[0]);
			initPlayer1 = player1;
			player1 = removeDuplicates(player1);
			if (initPlayer1.length > player1.length) {
				player1TotalPoints += 1;
				player1Points.innerHTML = player1TotalPoints;
			}
			shuffledArray.shift();
		}
		whosTurn = 2;
	} 
	else {
		if (player1.indexOf(cardToMatchValue) != -1 ){
			console.log("MATCH P2");
			
			var filteredArray1 = player1.filter(function(e){
				return e!==cardToMatchValue;
			});
			var filteredArray2 = player2.filter(function(e){
				return e!==cardToMatchValue;
			});
			
			if (player2.length > filteredArray2.length) {
				player2TotalPoints += 1;
				player2Points.innerHTML = player2TotalPoints;
			}
			
			player1 = filteredArray1;
			player2 = filteredArray2;
			
		} else {
			console.log("GO FISH");
			player2.push(shuffledArray[0]);
			initPlayer2 = player2;
			player2 = removeDuplicates(player2);
			if (initPlayer2.length > player2.length) {
				player2TotalPoints += 1;
				player2Points.innerHTML = player2TotalPoints;
			}
			shuffledArray.shift();
		}
		whosTurn = 1;
	}
	
	player1Cards.innerHTML = player1;
	player2Cards.innerHTML = player2;
	cardsRemaining.innerHTML = shuffledArray;
	currentPlayer.innerHTML = "Player " + whosTurn;
}

// Click events
startGameBtn.onclick = function() {
	resetValues();
	initCardsArray();
	shuffleCards();
	console.log(shuffleCards());
	dealCards();
};

cardValueBtn.onclick = function() {
	if (cardToMatchInput.value === '' ) {
		console.log("Value cannot be blank");
		cardToMatchInput.style.border = '1px solid red';
		return;
	} else {
		cardToMatchValue = parseInt(cardToMatchInput.value);
		checkForMatch();
	}
};

//resultsContainer.innerHTML = cardsArray;

//var randomCard = Math.floor(Math.random() * (cardsArray.length - 1));