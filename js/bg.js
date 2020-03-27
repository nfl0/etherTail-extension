var storage = browser.storage.local;
var key ='eth', value;
var balance=0;
var req_counter;

//counter() returns 0 when limit reached, and 1 otherwise.
async function counter(){
	Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
	}

var date = new Date();
var reset_week =date.addDays(7);
//console.log(reset_week);
storage.get('reset_week').then((item)=>{
  if(item.reset_week){
    if(item.reset_week==date.getDate()){
			storage.set({
							["reset_week"]: reset_week
						}, () =>
			console.log(' [Counter reset] Date after a week is : ' + reset_week));
			storage.set({
							["req_counter"]: 3000
						}, () =>
			console.log(' [Counter reset] request counter set to : ' + req_counter));
		}else{
			//decrease counter
			storage.get("req_counter").then((item)=>{
					count = item.req_counter;
					if(count!=0){
						storage.set({
										["req_counter"]: count-1
									}, () =>
						console.log('Counter decreased'));
					}else{
						console.log('Counter is zero');
						return false;
					}

			});
		}
  }else{
		storage.set({
						["reset_week"]: reset_week
					}, () =>
		console.log(' Date after a week is : ' + reset_week));
		storage.set({
						["req_counter"]: 3000
					}, () =>
		console.log(' [Counter reset] request counter set to : ' + req_counter));
}
});
	return true;
}

//initiat value
storage.get().then((item)=>{
		value = item.eth;
		console.log(key+value);
});


//fetch balance
//limit 3000 request per week
async function update() {

	if(await counter()){

		let response = await fetch("https://api.ethplorer.io/getAddressInfo/"+value+"?apiKey=freekey");
		let walletInfo = await response.json()

		var x = 0;
	    var tokens_balance = 0;

	    for (i = 0; x < Object.keys(walletInfo.tokens).length; x++) {
	        if (walletInfo.tokens[x].tokenInfo.price != false)
	            tokens_balance += walletInfo.tokens[x].balance * Math.pow(10, -walletInfo.tokens[x].tokenInfo.decimals) * walletInfo.tokens[x].tokenInfo.price.rate;
	        }
	    var ETH_balance = walletInfo.ETH.balance * walletInfo.ETH.price.rate;
	    balance = ETH_balance + tokens_balance;

			storage.set({
							["value"]: balance
						}, () =>
			console.log(' Balance is : ' + balance));

		}else{
				console.log("Counter elapsed");
			}
}
//query request:{blockchain_name, address}
//stores request Object in storage
async function handleMessage(request, sender, sendResponse) {
//console.log(request);

	if(Object.keys(request)[0]=="refresh"){
		update();
	}else{
		key = Object.keys(request)[0];
		value = request[key];

		storage.set({
						[key]: request[key]
					}, () =>
		console.log(key + ' address: ' + value + " (added)."));
		update();
	}

}

chrome.runtime.onMessage.addListener(handleMessage);
