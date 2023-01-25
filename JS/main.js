
//This fucntion will format a given input to a curency with $ sign.
function formatCurrency(number) {
    const formatter = new Intl.NumberFormat("en-US",{
        style:"currency",
        currency:"USD",
    }).format(numer);
    return formatter;
}
//This function will fetch 100 crypto assets and their informations.

async function fetchCoinData() {
    const url = "https://api.coinstats.app/public/v1/coins?skip=0&limit=100&currency=USD";
    const res = await fetch(url);
    const data = await res.json();
    return data;

}

//This function will display the current price of the top rated crypto asset which is BTC

function displayTopRated(coin) {
    const topRated = document.querySelector("#top-rated");
    const price = document.querySelector("#price");
    const percent = document.querySelector("#percent");
    const img = document.querySelector("#img");
    const name = document.querySelector("#name");

    percent.innerHTML = `${coin.priceChange1h}%`;
    const bClass = `${coin.priceChange1h < 0.0 ? "bearish" : "bullish"}`;
    percent.classList.add = bClass;
    price.innerHTML = `${formatCurrency(parseFloat(coin.price).toFixed(2))}`;
    img.src = coin.icon;
    name.innerHTML = coin.name;
    topRated.style.opacity = "1";
}

//This function will list 2 coins based on the rank property from the each object returned from the API. 

function listRankedCoin(coins) {
    const cardDiv = document.querySelector("#card");
    let list = coins   
       .map(
        (coin,index) => `
        <div id="${index}" class="card-item ${coin.rank === 1 ? "top" : "next"}">
        <p>${coin.priceChange1h}%</p>
        <p class="price">${formatCurrency(parseFloat(coin.price).toFixed(2)
         )}</p>
        <p>${coin.symbol}</p>
        </div>
        `
       )
       .join("");
       cardDiv.innerHTML = list;

       //This function will list all coins 

       function listAllCoins(coins) {
        const listDiv = document.querySelector("#list");
        let list = coins
          .map(
            (coin,index) => `
            <div id="${index}" class="list-item-holder">
             <div class="list-items">
               <div class="list-img-name">
            <img src ="${coin.icon}  alt="${coin.name}">
            <p>${coin.symbol}</p>
            </div>

            <p class="price">${formatCurrency(
                parseFloat(coin.price).toFixed(2)
             )}</p>
            <p class="mc">1d chg <span class="${
                coin.priceChange1d <0.0 ? "bearish"  :  "bullish"
            }">${coin.priceChange1d}%</span></p>
            </div>
            </div>
            <div class="more">
            <p class= "name">
              <img src="${coin.icon}" alt="${coin.name}">
              <span>${coin.name}</span>
            </p>
            <p class="txt"><span>Max Supply</span><span>${parseInt(coin.totalSupply).toFixed(0)}</span></p>
            <p class="txt"><span>Av. Supply</span><span>${parseInt(coin.availableSupply).toFixed(0)}</span></p>
            <p class="txt"><span>Mk. Cap.</span><span>${coin.marketCap}</span></p>
            <p class="txt"><span>1d Price</span><span class="${coin.priceChange1d}%</span></p>
            <a class="exp" href=${coin.exp[0]}"Explore</a>
            </div>
            </div>

            `
        )
         .join("");
         listDiv.innerHTML = list;
       }
}

//call all functions once our page is loading 

window.onload = async function () {
    try {
        coinData = await fetchCoinData();

        //find the toprated coin with the first rank
        const topRated = coinData.coins.find((coin) => coin.rank == 1);
        displayTopRated(topRated);

        //pick two coins based on their rank and display them below
        const highRank = coinData.coins.filter((coin) => coin.rank <= 2);
        listRankedCoin(highRank);

        //list all this coins
        listAllCoins(coinData.coins);
     } catch(error) {
       console.log(error);
    }
    };
