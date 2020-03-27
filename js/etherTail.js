const ele = {
	//views
  main: document.getElementById('mainView'),
  edit: document.getElementById('editView'),
	//buttons
  add: document.getElementById('add'),
  set: document.getElementById('set'),
  cancel: document.getElementById('cancel'),
  change: document.getElementById('change'),
  refresh: document.getElementById('refresh'),
	//attributes
  hidden: document.getElementById('hidden'),
	//error messages
  error: document.getElementById('error'),
	//text divs
  address: document.getElementById('address'),
  value: document.getElementById('value'),
	//inputs
  ethAddress: document.querySelector('[name="ethAddress"]'),
}

let ethAddress, balance;
var storage = browser.storage.local;

//views
const changePage = view => {
  switch (view) {
    case 'main':
		ele.edit.classList.add('hidden');
		ele.main.classList.remove('hidden');
      break;
    case 'default':
    storage.get().then((item)=>{
        address.innerHTML = item.eth;
        value.innerHTML = "USD "+item.value;
    });
    ele.edit.classList.add('hidden');
		ele.main.classList.remove('hidden');
    ele.add.classList.add('hidden');
		ele.address.classList.remove('hidden');
		ele.value.classList.remove('hidden');
		ele.change.classList.remove('hidden');
    ele.refresh.classList.remove('hidden');
      break;
    case 'edit':
		ele.main.classList.add('hidden');
		ele.edit.classList.remove('hidden');
      break;
  }
}


//Send data to bg.js

function sendData(){
	browser.runtime.sendMessage({eth: ethAddress});
}

//save button and input validation

ele.set.addEventListener('click', ()=> {
	ethAddress = ele.ethAddress.value;
	//ethAddress = "0x3AF9fE35D280ADA5a5edB1BEf3ED872a3231d73C";
	if(WAValidator.validate(ethAddress, 'eth')){
		changePage("default");
		sendData();
  }
		else
			ele.error.innerHTML = "invalid address";
});

//refresh button

ele.refresh.addEventListener('click', ()=> {
	browser.runtime.sendMessage({refresh: true});
});

//add button

ele.add.addEventListener('click', ()=> {
	changePage("edit");
});

//cancel button

ele.cancel.addEventListener('click', ()=> {
	changePage("main");
});

//change button

ele.change.addEventListener('click', ()=> {
	changePage("edit");
});

storage.get('eth').then((item)=>{
  if(item.eth)
    changePage("default");
  else
    changePage("main");
});
