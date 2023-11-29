// Initial References
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let userInp = document.getElementById("user-inp");

let apiKey = "3d69e72e5a664307baeaa6c6bafa1df3"; // Your actual Spoonacular API Key
let searchUrl = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=";
let recipeInfoUrl = "https://api.spoonacular.com/recipes/";

let recipes = []; // Store fetched recipes

searchBtn.addEventListener("click", () => {
  let userInput = userInp.value.trim();

  if (userInput.length == 0) {
    result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
  } else {
    fetch(searchUrl + userInput)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          result.innerHTML = `<h3>No recipes found with the given ingredients</h3>`;
        } else {
          // Store fetched recipes
          recipes = data;
          shuffleRecipes(); // Shuffle the recipes
        }
      })
      .catch(() => {
        result.innerHTML = `<h3>Invalid Input or API Error</h3>`;
      });
  }
});

// Function to shuffle recipes and display the next one
function shuffleRecipes() {
  if (recipes.length === 0) {
    result.innerHTML = `<h3>No recipes available</h3>`;
  } else {
    // Shuffle the recipes
    const shuffledRecipes = shuffleArray(recipes);
    let myRecipe = shuffledRecipes[0]; // Take the first recipe from the shuffled results
    let recipeTitle = myRecipe.title;
    let recipeId = myRecipe.id;

    // Render the recipe information with ingredients, image, and the "View Recipe" button
    const renderRecipeInfo = (recipeData) => {
      let ingredients = recipeData.extendedIngredients;
      let recipeImage = recipeData.image;
      let recipeInstructions = recipeData.instructions;
      let readyInMinutes = recipeData.readyInMinutes;
      let cuisine = recipeData.cuisines;

      // Modify the recipeInstructions text to add numbers instead of bullet points
      recipeInstructions = recipeInstructions.replace(/\.\s/g, '.<br/>');

      // Check if ingredients, recipeImage, and recipeInstructions are available
      if (ingredients && recipeImage && recipeInstructions) {
        let ingredientsList = ingredients.map((ingredient) => `<li>${ingredient.original}</li>`).join('');

        // Render the recipe information with ingredients, image, and the "View Recipe" button at the bottom
        result.innerHTML = `
          <div class="recipe-details">
            <img src="${recipeImage}" alt="${recipeTitle}">
            <h1>${recipeTitle}</h1>
            <h5>(Ready in ${readyInMinutes} Minutes)</h5>
            ${cuisine && cuisine.length ? `<p>Cuisine: ${cuisine.join(", ")}</p>` : ""}
          </div>
          <div id="recipe-ingredients">
            <h3>Recipe Ingredients:</h3>
            <ul>${ingredientsList}</ul>
          </div>
          <div id="recipe-instructions" style="display: none;">
            <h3>Recipe Instructions:</h3>
            <p>${recipeInstructions}</p>
          </div>
          <button id="show-recipe">View Recipe</button>
          <button id="hide-recipe" style="display: none;">Hide Recipe</button>
        `;

        let showRecipe = document.getElementById("show-recipe");
        let hideRecipe = document.getElementById("hide-recipe");
        let recipeIngredients = document.getElementById("recipe-ingredients");
        let recipeInstructionsDiv = document.getElementById("recipe-instructions");

        showRecipe.addEventListener("click", () => {
          // Toggle the visibility of instructions and buttons when the "View Recipe" button is clicked
          if (recipeInstructionsDiv.style.display === "none") {
            recipeInstructionsDiv.style.display = "block";
            recipeIngredients.style.display = "none";
            showRecipe.style.display = "none";
            hideRecipe.style.display = "inline-block";
          }
        });

        hideRecipe.addEventListener("click", () => {
          // Toggle the visibility of instructions and buttons when the "Hide Recipe" button is clicked
          if (recipeInstructionsDiv.style.display === "block") {
            recipeInstructionsDiv.style.display = "none";
            recipeIngredients.style.display = "block";
            showRecipe.style.display = "inline-block";
            hideRecipe.style.display = "none";
          }
        });
      } else {
        result.innerHTML = `<h3>No detailed recipe information available for '${recipeTitle}'</h3>`;
      }
    };

    // Fetch recipe information including ingredients using the recipe ID
    fetch(`${recipeInfoUrl}${recipeId}/information?apiKey=${apiKey}&includeNutrition=false`)
      .then((response) => response.json())
      .then(renderRecipeInfo)
      .catch(() => {
        result.innerHTML = `<h3>Error fetching recipe information</h3>`;
      });
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
