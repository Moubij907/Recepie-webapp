const apiKey = '3287ec41fec3471e9ce62e85af668768';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipesContainer = document.getElementById('recipes-container');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value;
  const cachedData = JSON.parse(localStorage.getItem(query));
  if (cachedData) {
    displayRecipes(cachedData);
  } else {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&fillIngredients=true&query=${query}&number=10`)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem(query, JSON.stringify(data));
        displayRecipes(data);
      })
      .catch(error => {
        console.error(error);
        alert('An error occurred while fetching recipes');
      });
  }
});

function displayRecipes(data) {
  recipesContainer.innerHTML = '';
  data.results.forEach(result => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    const recipeImage = document.createElement('img');
    recipeImage.src = result.image;
    const recipeDetails = document.createElement('div');
    const recipeName = document.createElement('h2');
    recipeName.innerText = result.title;
    const recipeIngredients = document.createElement('ul');
    result.usedIngredients.map(ingredient => {
      const ingredientItem = document.createElement('li');
      ingredientItem.innerText = ingredient.name;
      ingredientItem.classList.add('used-ingredient');
      recipeIngredients.appendChild(ingredientItem);
    });
    result.unusedIngredients.forEach(ingredient => {
      const ingredientItem = document.createElement('li');
      ingredientItem.innerText = ingredient.name;
      ingredientItem.classList.add('unused-ingredient');
      recipeIngredients.appendChild(ingredientItem);
    });
    recipeDetails.appendChild(recipeName);
    recipeDetails.appendChild(recipeIngredients);
    recipeCard.appendChild(recipeImage);
    recipeCard.appendChild(recipeDetails);
    recipeCard.addEventListener('click', () => {
      displayRecipeDetails(result.id);
    });
    recipesContainer.appendChild(recipeCard);
  });
}

function displayRecipeDetails(recipeId) {
  fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const recipeIngredients = data.extendedIngredients.map(ingredient => ingredient.original);
      alert(`Ingredients for ${data.title}: \n\n${recipeIngredients.join('\n')}`);
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred while fetching recipe details');
    });


}
