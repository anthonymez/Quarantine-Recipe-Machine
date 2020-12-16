var ingredients = "";
var spoonLength;

// ------------------------------------------
/*
     Button onClick action.

     PURPOSE: After a user inputs their ingredients and hits the 
              search button, this function clears out the variable
              values of any previous searches, then validates the inputs to 
              make sure they're not empty.
*/
// -----------------------------------------------

$("#recipeFind").on("click", function (event) {
  event.preventDefault();
  housekeeping();
  // Variable names created to be used with indexes. ***
  let ingredient_0 = $("#ingredient_1").val().trim();
  let ingredient_1 = $("#ingredient_2").val().trim();
  // Stop function if both fields are empty. ***
  if (ingredient_0 === "" && ingredient_1 === "") {
    console.log("Both search fields are empty");
    return;
  }
  // createParameters for spoontacular. ***
  createIngredientParameters(ingredient_0, ingredient_1, ",", "spoontacular");
});

// ------------------------------------------
/*      
     createIngredientParameters()

     PURPOSE: Because each API needs to query all ingredients
              the user searched for, this function inserts a set
              of ingredient search parameters into global variable
              ingredients.
       
      PARAMETERS: ingredient_#, separator (eg ",", "|"), foodSite(string representing which API to call.)
    */
// -----------------------------------------------

// Creates a string of ingredients separated by commas.***
function createIngredientParameters(
  ingredient_0,
  ingredient_1,
  separator,
  foodSite
) {
  for (i = 0; i < 2; i++) {
    // *** <-- Just change iCount in "i<2" for igredient addition.
    // Find the value of each search item..
    let nameGenerate = eval("ingredient_".concat(i));

    if (
      nameGenerate != "" &&
      nameGenerate != undefined &&
      nameGenerate != null
    ) {
      if (ingredients === "") {
        // If ingredients is empty, include with no comma
        ingredients = nameGenerate;
      } else {
        ingredients += separator + nameGenerate; // If not, tack on current ingredient to existing values WITH comma.
      }

      console.log("Ingredient list after iteration " + i + ": " + ingredients);
    } // If statement ends.

    console.log("Final Ingredient List: " + ingredients);
  } // End for loop.

  // Which API call to make.
  if ((foodSite = "spoontacular")) {
    spoonApiCall();
  }
}

// --------------------------------------
/*
     spoonApiCall()

     PURPOSE: This function sends an API call to spoontacular once the user input
               has been validated and a query-parameter has been generated.
     */
// ---------------------------------------

function spoonApiCall() {
   let api_Key = "1800b42b74cd42b688e40f416d0c69d9";
  // let api_Key = "6d04fc1a81834943aa3e91c05f2755b8";
  let endpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${api_Key}&includeIngredients=${ingredients}`;

  $.ajax({
    url: endpoint,
    method: "GET",
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(
        "Sorry, but this search generated an error.  Please try again! " +
          "\n Details: Status =" +
          XMLHttpRequest.status +
          ", Status Text: " +
          XMLHttpRequest.statusText
      );
      housekeeping();
      return;
    },
  }).then(function (response) {
    JSON.stringify.response;
    console.log("JSON Spoontacular Payload: " + response);
    spoonLength = response.results.length;
    displayResults(response, spoonLength);
  });
  console.log("Length of JSON-returned list " + spoonLength);
}

// --------------------------------------
/*
     housekeeping()

     PURPOSE: Every time the user clicks the search button,
              this function empties out all global variables
              to make nothing is affected by past search results.
     */
// ---------------------------------------

function housekeeping() {
  ingredients = "";
  spoonlength = "";
}

// --------------------------------------
/*
     displayResults()

     PURPOSE: Displays listed items in JSON-returned
              result in a list view.
     */
// ---------------------------------------

function displayResults(myJSON, jsonLength) {
  let current_value = "";
  let foodID = "";
  let foodTitle = "";
  let foodImage;
  /*$(‘#foodModal’).modal(‘show’);*/
  $(".foodListItem").remove();
  for (i = 0; i < jsonLength; i++) {
    foodID = myJSON.results[i].id;
    foodTitle = myJSON.results[i].title;
    foodFat = myJSON.results[i].fat;
    foodCarbs = myJSON.results[i].carbs;
    foodProtein = myJSON.results[i].protein;
    foodImage = myJSON.results[i].image;
    var tempDiv = document.createElement("li");
    $(tempDiv).attr("id", foodID);
    $(tempDiv).addClass("foodListItem");
    var secondaryDiv = document.createElement("div");
    var foodDescription = document.createElement("p");
    $(foodDescription).text(`Title: ${foodTitle}`);
    $(tempDiv).append(foodDescription);
    $(secondaryDiv).addClass("img-container");
    var tempIMG = document.createElement("img");
    $(tempIMG).attr("src", foodImage);
    $(secondaryDiv).append(tempIMG);
    $(tempDiv).append(secondaryDiv);
    $("#recipeList").append(tempDiv);
    /* $(tempIMG).css({ height: "10%", width: "auto" }); */
  }
}
// Grab spoontacular individual recipe
$("#recipeList").on("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  var targetItem = event.target;
  var listItem = $(targetItem).closest("li");

  /*
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);

  var singleModalElem = document.querySelector("#modal1");
  var instance = M.Modal.getInstance(singleModalElem);
  */
 var current_ID = $(listItem).attr("id");
  $('#modal1').modal().modal('open');

  if($('.modal-content') != undefined && $('.modal-content') != null && $('.modal-content') != ""){
  $('.modal-content').empty();
 
}

  
  
  console.log(current_ID);
  let api_Key = "1800b42b74cd42b688e40f416d0c69d9";
  // let api_Key = "6d04fc1a81834943aa3e91c05f2755b8"
  let urlCall = `https://api.spoonacular.com/recipes/${current_ID}/information?apiKey=${api_Key}`;
  $.ajax({
    url: urlCall,
    method: "GET",
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(
        "Sorry, but this search generated an error.  Please try again! " +
          "\n Details: Status =" +
          XMLHttpRequest.status +
          ", Status Text: " +
          XMLHttpRequest.statusText
      );
      housekeeping();
      return;
    },
  }).then(function (response) {
    console.log("JSON Spoontacular Payload/before Stringify: " + response);
    JSON.stringify.response;
    console.log("JSON Spoontacular Payload/post Stringify: " + response);
    getRecipe_Steps(response);
  });
});

// --------- CODE FOR INDIVIDUAL RECIPES BELOW HERE ---------------//


/*
//--------------------------
getRecipe_Steps()
PURPOSE:

//-------------------------
*/
function getRecipe_Steps(passedArray){
var myArray = passedArray.analyzedInstructions[0].steps;

if( passedArray.winePairing.length === undefined || passedArray.winePairing.length === null || passedArray.winePairing.length === 0 ){
 var wineInfo = "";
}
else{
  
  var wineInfo = passedArray.winePairing.productMatches[0].title;
}


console.log(`Listed Steps: ${myArray}`);

var stepsContainer = document.createElement("ul");
$(stepsContainer).addClass("steps-container");

// BEGIN EACH LOOP
$.each( myArray, function( index) {
  // --- Create paragraph element and span.
  var current_paragraph = document.createElement("li");
  $(current_paragraph).addClass("steps-line");
  var number_span = document.createElement("span")
  $(number_span).addClass("step-number");
  
  // ---- Grab current number and step.
  // #
  var pre_step = index + 1;
  var step_number = pre_step + ") ";
  // txt
  var step_text = myArray[index].step + "  ";
  // --- Attach step number to paragraph
  $(number_span).append(step_number);
  $(current_paragraph).append(number_span);

  $(current_paragraph).append(`${step_text}<br>`);
  
   $(stepsContainer).append(current_paragraph);
 }); 
 
// END EACH LOOP
//console.log(`Final paragraph ${stepsContainer}`);
  
 let ingredientsContainer = "";
 ingredientsContainer = getRecipe_Ingredients(passedArray);

 //console.log(`Ingredients: ${ingredientsContainer}`);

 //alert( $(ingredientsContainer).text() + "      " +  $(stepsContainer).text());
 var listedIngredients = "";
 listedIngredients = $(ingredientsContainer).text();
 var listedSteps = "";
 listedSteps = $(stepsContainer).text();
 $(".modal-content").append(`<h4 id="recipeIngredients">Ingredients</h4>${listedIngredients}`);
 $(".modal-content").append(`<h4 id="recipeSteps">Steps</h4>${listedSteps}`);

 if(wineInfo != undefined && wineInfo != null && wineInfo != ""){
  $(".modal-content").append(`<h4 id="wineHeader">Wine</h4><div class="wineClass">${wineInfo}</div>`);
 }


} 

/*
//---------------------
getRecipe_Ingredients()

PURPOSE:
//---------------------
*/
function getRecipe_Ingredients(passedArray){
var myArray = passedArray.extendedIngredients;

var ingredientContainer = document.createElement("ul");
$(ingredientContainer).addClass("ingredients-container");

  $.each(myArray, function( index) {
    var current_paragraph = document.createElement("li");
    $(current_paragraph).addClass("ingredients-line");
    var number_span = document.createElement("span")
    $(number_span).addClass("ingredient-number");

    // ##

     // ---- Grab current number and step.
  // #
  var pre_step = index + 1;
  var step_number = pre_step + ") ";
  // txt
  var step_text = myArray[index].originalString + "  ";
  // --- Attach step number to paragraph
  $(number_span).append(step_number);
  $(current_paragraph).append(number_span);

  $(current_paragraph).append(`${step_text}<br>`);
  $(ingredientContainer).append(current_paragraph);

  })
    
return ingredientContainer;
 } 

