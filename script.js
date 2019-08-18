
//Http call from USDA
let requestURLNutrients = 'https://api.nal.usda.gov/ndb/nutrients/?format=json&max=1000&api_key=ENhsP8Qk2Tcb5agNwbsYrrcCVM4qw1HRQQMRsKhZ&nutrients=208&nutrients=203&nutrients=205&nutrients=204&nutrients=304&nutrients=306&nutrients=307&nutrients=291&nutrients=320&nutrients=418&nutrients=401&nutrients=328&nutrients=323&nutrients=430&nutrients=269&nutrients=601&subset=1'

let requestNutrients = new XMLHttpRequest();

requestNutrients.open('GET', requestURLNutrients);
requestNutrients.responseType = 'json';
requestNutrients.send();



//Function Declaration - produce an array of names only of all foods in ajax call object requestNutrients
function makeArrays(jsonObj, arr){
	for(i = 0; i < jsonObj['report']['foods'].length; i++){
		arr.push(jsonObj['report']['foods'][i]['name']);
	}
	return arr;
}

//Function Declaration - delete existing dropdown-box elements, if any
let elements = document.getElementsByClassName('dropdown-box');
let	element;

function deleteDropdown(){
	while (element = elements[0]) {
		element.parentNode.removeChild(element);
	} 
};

//Function to convert any NaN to print 0 instead
function toZero(x){
	if(isNaN(x)){
		return 0;
	} else {
		return x
	}
};

//Function declaration to decide which measurement to use in the nutritional information box. 
function measurement(x){
	if(nutrientsArray[x] === '.fiber' || nutrientsArray[x] === '.protein' || nutrientsArray[x] === '.sugar' || nutrientsArray[x] === '.fats' || nutrientsArray[x] === '.carbohydrates'){
		return ' g';
	} else if(nutrientsArray[x] === '.vitamin-e' || nutrientsArray[x] === '.vitamin-c' || nutrientsArray[x] === '.magnesium' || nutrientsArray[x] === '.cholesterol' || nutrientsArray[x] === '.potassium' || nutrientsArray[x] === '.sodium'){
		return ' mg';
	} else if(nutrientsArray[x] === '.vitamin-a' || nutrientsArray[x] === '.vitamin-k' || nutrientsArray[x] === '.vitamin-d' || nutrientsArray[x] === '.vitamin-b12'){
		return ' µg';
	} else {
		return ' kcal';
	}
}


//Function declaration to add current food and nutrients to the correct meal

function createTableRow(y){
	const tableRow = `<tr class="table-${y}-row"><td class="food-name-output-field ${y}"></td><td class="meals-output-field ${y} calories"></td><td class="meals-output-field ${y} protein"></td><td class="meals-output-field ${y} carbohydrates"></td><td class="meals-output-field ${y} fats"></td><td class="meals-output-field ${y} magnesium"></td><td class="meals-output-field ${y} potassium"></td><td class="meals-output-field ${y} sodium"></td><td class="meals-output-field ${y} fiber"></td><td class="meals-output-field ${y} vitamin-a"></td><td class="meals-output-field ${y} vitamin-b12"></td><td class="meals-output-field ${y} vitamin-c"></td><td class="meals-output-field ${y} vitamin-d"></td><td class="meals-output-field ${y} vitamin-e"></td><td class="meals-output-field ${y} vitamin-k"></td><td class="meals-output-field ${y} sugar"></td><td class="meals-output-field ${y} cholesterol"></td><td><button class="delete-food" type="button">X</button></td></tr>`
	return tableRow;
};


//Variable declarations
let arrListNutrients = [];
let nutrientsCompletedArray = [];

const nutrientsArray = ['.fiber', '.vitamin-a', '.vitamin-k', '.vitamin-e', '.protein', '.vitamin-c', '.sugar', '.fats', '.carbohydrates', '.magnesium', '.cholesterol', '.potassium', '.vitamin-d', '.calories', '.sodium', '.vitamin-b12'];

function addToMeals(){
	event.preventDefault();
	//saving from the radio selections which meal to print food under
	const meal = document.querySelector('.meal:checked').value;
	nutrientsCompletedArray = [];
	nutrientsArray.forEach(e => nutrientsCompletedArray.push(document.querySelector(e).textContent));


	switch(meal){
		case 'breakfast':
				printToMeals('breakfast');
				break
		case 'lunch':
				printToMeals('lunch');
				break
		case 'dinner':
				printToMeals('dinner');
				break
		default:
				printToMeals('snacks');
	};
};

//sum all values in array
const sumArray = (ac, cv) => ac + cv;

function printToMeals(x){
	//print new row, param 'x' is which meal
	const mealFoodName = document.getElementById('food-input').value;
	const rowNode = document.createElement('tr');
	const foodNameOutputField = '.food-name-output-field';
	rowNode.setAttribute('class', `table-${x}-row`);
	document.querySelector(`.table-${x}-body`).appendChild(rowNode);
	document.querySelector(`.table-${x}-body`).lastChild.innerHTML = createTableRow(x);

	//var to print nutrient info onto the last (new) row
	const lastRowElementIndex = document.querySelectorAll(`.table-${x}-row`).length-1;
	for(i = 0; i < nutrientsArray.length; i++){
		document.querySelectorAll('.'+ x + foodNameOutputField)[lastRowElementIndex].textContent = mealFoodName;
		//.breakfast.fiber, .breakfast.vitamin-a, etc... selecting multiple class names
		document.querySelectorAll('.'+ x + nutrientsArray[i])[lastRowElementIndex].textContent = nutrientsCompletedArray[i];	
	};

	//remove measurement using regex, convert string to number, and push them into new array for all nutrients
	//n is param for different nutrients
	function sumEachNutrient(n){
		const numbersOnlyRegex = /[^0-9.]/g; 
		const nutrientsCollection = document.querySelectorAll(`.meals-output-field.${x + nutrientsArray[n]}`);
		let nutrientsCollectionArray = [];
		for(i = 0; i < nutrientsCollection.length; i++){
			nutrientsCollectionArray.push(Number(nutrientsCollection[i].innerText.replace(numbersOnlyRegex, '')));
		};
		if(nutrientsCollectionArray.length > 0){
			let totalNutrients = nutrientsCollectionArray.reduce(sumArray);
			document.querySelector(`${nutrientsArray[n]}-${x}-total`).textContent = totalNutrients.toFixed(1) + measurement(n);
		} else {
			let zeroNutrients = 0.0;
			document.querySelector(`${nutrientsArray[n]}-${x}-total`).textContent = zeroNutrients.toFixed(1);
		};
	};

	//function to calculate daily total nutrients
	//x is meal, n is nutrient
	function sumEachNutrientDaily(n){
		const numbersOnlyRegex = /[^0-9.]/g; 
		const nutrientsCollectionDaily = document.querySelectorAll(`.meals-output-field${nutrientsArray[n]}`);
		let nutrientsCollectionDailyArray = [];
		for(i = 0; i < nutrientsCollectionDaily.length; i++){
			nutrientsCollectionDailyArray.push(Number(nutrientsCollectionDaily[i].innerText.replace(numbersOnlyRegex, '')));
		};
		if(nutrientsCollectionDailyArray.length > 0){
			let totalNutrients = nutrientsCollectionDailyArray.reduce(sumArray);
			document.querySelector(`${nutrientsArray[n]}-daily-total`).textContent = totalNutrients.toFixed(1) + measurement(n);
		} else {
			let zeroNutrients = 0.0;
			document.querySelector(`${nutrientsArray[n]}-daily-total`).textContent = zeroNutrients.toFixed(1);
		};
	};

	

	//sum all nutrients per meal
	function sumAllNutrients(){
		for(j = 0; j < nutrientsArray.length; j++){
			sumEachNutrient(j);
		};
	};
	sumAllNutrients();

	//sum all nutrients daily total
	function sumAllNutrientsDaily(){
		for(k = 0; k < nutrientsArray.length; k++){
			sumEachNutrientDaily(k);
		};
	};
	sumAllNutrientsDaily();



	//Function to delete row
	let rowToDelete = document.querySelector(`.table-${x}-body`);
	function deleteTableRow(){
		rowToDelete.addEventListener('click', deleteRow);
	};
	function deleteRow(e){
		if(e.target.classList.contains('delete-food')){
			let trToDelete = e.target.parentElement.parentElement;
			rowToDelete.removeChild(trToDelete);
		};
		sumAllNutrients();
		sumAllNutrientsDaily()

	};

	deleteTableRow();

};


//Function to calculate nutritional value from input

//save requestNutrients to local variable foodObjNutrients 
requestNutrients.onload = function(){
	let foodObjNutrients = requestNutrients.response;
	makeArrays(foodObjNutrients, arrListNutrients);

	//'Add to meals' button
	const button = document.getElementById('addButton');
	button.addEventListener('click', addToMeals);

	//capture input & save as variable & matching fixed regex
	const foodInput = document.getElementById('food-input');
	foodInput.addEventListener('keyup', valueCapture);

	function valueCapture(e){	
		const input = e.target.value; //saving input into variable
		if(input.length > 2){  //meaningless if input is less than 3 letters
			const searchTerm = input;
			const searchRegex = new RegExp(searchTerm, 'i'); //setup regex to filter arrListNutrients
			//create drop down list using regex filtering
			const dropdownList = [];
			for(i = 0; i < arrListNutrients.length; i++){
				if(searchRegex.test(arrListNutrients[i])){
					dropdownList.push(arrListNutrients[i]);
				};
			};

			//print dropdown list 
			deleteDropdown()
			for(i = 0; i < dropdownList.length; i++){		
				document.querySelector('.output-test').innerHTML += `<li class="dropdown-box">${dropdownList[i]}</li>`;
			};

			//select from dropdown list and fill in input field with selection
			document.querySelector('.output-test').onclick = selectFood;

			function selectFood(e){	
				let foodSelection = e.target.textContent;
				document.getElementById('food-input').value = foodSelection;
				//console.log(foodSelection);
				deleteDropdown();

				//print nutrients of selected food onto Nutritional Information box
				for(i = 0; i < arrListNutrients.length; i++){	
					if(foodObjNutrients['report']['foods'][i].name === foodSelection){
						let defaultWeight = foodObjNutrients['report']['foods'][i].weight;
						let foodObjNutrientsVar = foodObjNutrients['report']['foods'][i];

						document.querySelector('.weight').value = defaultWeight;
						
						for(j = 0; j < nutrientsArray.length; j++){							
							document.querySelector(nutrientsArray[j]).textContent = toZero(foodObjNutrientsVar['nutrients'][j].value * 1).toFixed(1) + measurement(j);
						}

						//allow users to change weight and recalculate nutritional content
						const calInput = document.getElementById('input-calculate');
						calInput.addEventListener('click', reCalculateInput);

						function reCalculateInput(){
							event.stopPropagation();
							event.preventDefault();
							let gramsInputField = document.getElementById('grams-input-field').value;

							for(k = 0; k < nutrientsArray.length; k++){							
								document.querySelector(nutrientsArray[k]).textContent = toZero(foodObjNutrientsVar['nutrients'][k].value / defaultWeight * gramsInputField).toFixed(1) + measurement(k);
							};
						};
					};
				};
			};
		};
	};
};
