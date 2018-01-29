var azure = require('azure-storage');
var axios = require('axios');
var account1 = "lrscsegcrdemo";
var key1 =  "";

var account2 = "grscsegcrdemo";
var key2 =  "";

function upload(account, key, containerName, blobName, data, callback) {
	var blobSvc = azure.createBlobService(account, key);
	blobSvc.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response){
			if(error){
				console.log(error)
				return;
			}
			blobSvc.createBlockBlobFromText(containerName, blobName, data, function(error, result, response){
				if(error){
					console.log(error)
					return;
				}
				callback()
			});
	});
}

function download(url, retry) {
	axios({
		method: 'get',
		url: url,
	}).then(function (res) {
		console.log(url+"\n"+res.data +"\n");
		clearInterval(retry);
	}).catch(function (error) {
		console.log(url+"\n"+error.response.statusText );
		return false
	});
}
var blobName = 'blob'+Date.now();
upload(account1, key1, 'mycontainer', blobName, account1+':'+String(new Date()), function(){
	download(`https://${account1}.blob.core.windows.net/mycontainer/${blobName}`)
});

upload(account2, key2, 'mycontainer', blobName, account2+':'+String(new Date()), function(){
	download(`https://${account2}.blob.core.windows.net/mycontainer/${blobName}`)
	const retry = setInterval(function(){
		download(`https://${account2}-secondary.blob.core.windows.net/mycontainer/${blobName}`, retry)
	}, 5000);
});


// var blobSvc = azure.createBlobService("mayelrs20180127", "pZmbIYA1pb4wXqsFYPBcnxFmMmiTtrQ1ijfgV5kSWf14fMe2X58Ox2S8n/5VZ5reCiRaERo/C8TrB/hYkkNsJA==");
// blobSvc.createContainerIfNotExists('mycontainer', {publicAccessLevel : 'blob'}, function(error, result, response){
//     if(error){
//     	console.log(error)
//     	return;
//     }
//     blobSvc.createBlockBlobFromText('mycontainer', 'myblob', 'test', function(error, result, response){
// 	  if(error){
// 	    console.log(error)
//     	return;
// 	  }
// 	  console.log(result)
// 		console.log(response)

		
// 	});

// });