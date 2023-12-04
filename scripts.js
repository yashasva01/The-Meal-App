let isAsideClicked = false;
let isIndividualClicked = false;

// endpoints for the data
let mealByName = "https://www.themealdb.com/api/json/v1/1/search.php?s="
let mealByFirstLetter = "https://www.themealdb.com/api/json/v1/1/search.php?f="
let detailsById = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="


// we store the favourite items local store in an array 
// if there is no array yet create one
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// function to display the favourite section
function openAside() {
    isAsideClicked = !isAsideClicked
    let aside = document.querySelector("aside");
    if(isAsideClicked){
        aside.style.display = "flex";
        aside.style.flex = 1;
    }else {
        aside.style.display = "none";
        aside.style.flex = 0;
    }
    showFavList()
}

// function that calls endpoints and gets the data
async function getDataFromEndpoint(endpoint, input) {
    const response = await fetch(`${endpoint+input}`);
    const meals = await response.json();
    return meals;
}

async function searchFunction() {
    let input = document.getElementById("searcher");
    let mealName = input.value;
    let favItemList = JSON.parse(localStorage.getItem("favouritesList"));
    let html = "";
    let data = await getDataFromEndpoint(mealByName,mealName);

    if (data.meals) {
        data.meals.forEach((element) => {
            let isFav=false;
            for (let index = 0; index < favItemList.length; index++) {
                if(favItemList[index]==element.idMeal){
                    isFav=true;
                }
            }
            if (isFav) {
                html += `
                <div class="card">
                    <img src="${element.strMealThumb}"> 
                    <h3> ${element.strMeal} </h3>
                    <div class="cardFooter">
                        <button onclick="getMealDetails(${element.idMeal})">
                            More
                        </button>

                        <div style="color: red;">
                            <i class="fa-solid fa-heart" id="${element.idMeal}" onclick="updateFavList(${element.idMeal})"></i>
                        </div>
                    </div>
                </div>
            `;
            } else {
                html += `
                <div class="card">
                    <img src="${element.strMealThumb}"> 
                    <h3> ${element.strMeal} </h3>
                    <div class="cardFooter">
                        <button onclick="getMealDetails(${element.idMeal})">
                            More
                        </button>

                        <div style="color: white;">
                            <i class="fa-solid fa-heart" id="${element.idMeal}" onclick="updateFavList(${element.idMeal})"></i>
                        </div>
                    </div>
                </div>
            `;
            }  
        });
    } else {
        html += ``;
    }
    document.querySelector(".card-container").innerHTML = html;
}


async function displayHome() {
    isIndividualClicked = false;
    let html = ""
    if(isIndividualClicked) {

    }else{
        let display = document.querySelector(".individual");
        display.style.display = "none";
    }
}

async function getMealDetails(id) {
    isAsideClicked = false;
    let aside = document.querySelector("aside");
    aside.style.display = "none";
    aside.style.flex = 0;

    let html = "";
    isIndividualClicked = true;
    if(isIndividualClicked){
        let display = document.querySelector(".individual");
        display.style.display = "flex";
    }
    let mealData = await getDataFromEndpoint(detailsById, id);

    console.log(mealData)

    html += `
    <div class="bigMealCard">
        <div class="bigMealInfo">
            <img src="${mealData.meals[0].strMealThumb}">
            <div class="bigMealDetails">
                <h2 id="mealName">
                    ${mealData.meals[0].strMeal}
                </h2>

                <h3 id="mealCategory"> 
                    Category:  ${mealData.meals[0].strCategory}
                </h3>

                <h3 id="mealArea">
                    Area: ${mealData.meals[0].strArea}
                </h3>
            </div>
        </div>

        <div class="instructions">
            <h3>Instructions: </h3>
            <span id="mealPrepinstructions"> ${mealData.meals[0].strInstructions} </span>
        </div>

        <div class="morefunctions">
            <button id="backButton" onclick="displayHome()">
                Back To Home
            </button>
            <a href="${mealData.meals[0].strYoutube}" target="_blank">
                <button id="youtube">
                    Watch Video
                </button>
            </a>
        </div>
    </div>
    `
    document.querySelector(".individual").innerHTML = html;
}

async function showFavList() {
    let favItemList = JSON.parse(localStorage.getItem("favouritesList"));
    let html = "";
    if(favItemList.length === 0){
        
    }else {
        for (let index = 0; index < favItemList.length; index++) {
            let data = await getDataFromEndpoint(detailsById, favItemList[index]);
            html += `
            <div class="favCard">
                    <img src="${data.meals[0].strMealThumb}">
                    <div class="mealInfo">
                        <h2> ${data.meals[0].strMeal} </h2>
                        <div class = "mealFooter">
                            <div id="moreDetails" onclick="getMealDetails(${data.meals[0].idMeal})">
                                <p>More</p>
                            </div>

                            <div id="favButton">
                                <i class="fa-solid fa-heart" style="color: red;" onclick="updateFavList(${data.meals[0].idMeal})"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    }
    document.querySelector(".favContainer").innerHTML=html;
}

async function updateFavList(id) {
    let favItemList = JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < favItemList.length; index++) {
        if (id==favItemList[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = favItemList.indexOf(id);
        favItemList.splice(number, 1);
        // alert("your meal removed from your favourites list");
    } else {
        favItemList.push(id);
        // alert("your meal add your favourites list");
    }
    localStorage.setItem("favouritesList",JSON.stringify(favItemList));

    let counter = document.getElementById("total-counter");
    counter.textContent = favItemList.length;
    searchFunction();
    showFavList();
}
