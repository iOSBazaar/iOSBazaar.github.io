
onReset();
populateRepos();
populatePackages();


myApp.onPageBeforeAnimation("repos-list", function() {
	populateRepos();
});
myApp.onPageBeforeAnimation("packages-list", function() {
	populatePackages();
});

function resetstorage() {
    var buttons1 = [
						{ text: 'This will reset your TimeStore installation to factory defaults.', label: true },
						{	text: 'Erase All Content and Settings', color: 'red', onClick: function () { youPushedItDidntYou(); } }
		];
    var buttons2 = [{ text: 'Cancel', bold: true }];
    var groups = [buttons1, buttons2];
    myApp.actions(groups);
}
function reseting() {
	localStorage.removeItem('timerepos');
	myApp.showPreloader('Resetting...');
	setTimeout(function() {
		myApp.hidePreloader();
		location.reload(true);
	}, 2200);
}


function isAccepted(url) {
	for(var i = 0; i < 10; ++i) {
	url = url.replace('http://', '');
	url = url.replace('/', '');
	url = url.replace('.', '');
	switch (url.toLowerCase()) {
		case "timedevsnetrepo":
			return true;
		case "teamihackifymojorepocf":
			return true;
		case "teamihackifycomRepo":
			return true;	
		default:
			return false;
	}
}

function populateRepos() {
  console.log('[Time Repositories] Populating repo list..');
  if (localStorage.getItem("timerepos") === null) {
    $$(".inner-repos").html("");
    return;
  }

  repoList = '';
  var userRepos = JSON.parse(localStorage.getItem("timerepos"));
  userRepos.forEach(displayRepo);

}

function displayRepo(element, index, array) {
  var repoRequest = new XMLHttpRequest();
  repoRequest.onreadystatechange = function() {
    if (repoRequest.readyState == 4 && repoRequest.status == 200) {
      var userRepo = '';
      try {
        userRepo = JSON.parse(repoRequest.responseText);
      } catch (e) {
        console.log(e);
        console.log(repoRequest.responseText);
        return;
      }
      var acception = '';
      if (isAccepted(element)) {
        acception = ' <img src="img/verified.png" alt="verified icon" style="width:16px;height:16px;" >';
      }
      repoList += "<li class='swipeout'><a onclick=\"repoIcon=\'" + userRepo.repository.icon + "\'\" href=\"repositories/packages.html\" class=\"item-link\"><div class='swipeout-content'><div class='item-content'><div class='item-media'><img style='border-radius:21%;width: 29px;' src='" +
        userRepo.repository.icon + "'></div><div class='item-inner' style='padding-top: 5px;padding-bottom: 7px;margin-left: 0px;padding-left: 15px;'><div class='item-title-row' style=\"font-weight:bold;\">" + "<div class=\"item-title\" style=\"color: #000; font-weight: 500; height: 22px;\"><font size=\"4\">" + userRepo.repository.name + "</font></div>" +
        veriCon + "</div><div class='item-subtitle' style='color: #666666;height: 19px; padding-bottom: 0px;'><font size=\"2\">" + element + "</font></div></div></div></div></a><div class='swipeout-actions-right'><a href='#' class='bg-red' onclick=\"deleteRepository('" + element + "');\" data-i18n=\"repos.delete\">Delete</a></div></li>";

      $$(".inner-repos").html(repoList);
    }
  }
  repoRequest.open("POST", "repositories/json.php", true);
  repoRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  repoRequest.send("repo=" + element);
}

function populatePackages() {
	console.log('[Time Repositories] Populating specific public source..');
	if (localStorage.getItem("timerepos") === null) {
		$$(".inner-packages").html("");
		return;
	}
	catList = '';
	var userRepos = JSON.parse(localStorage.getItem("timerepos"));
	userRepos.forEach(displayPackage);
}

function displayPackage(element, index, array) {
	var repoRequest = new XMLHttpRequest();
	repoRequest.onreadystatechange = function() {
		if (repoRequest.readyState == 4 && repoRequest.status == 200) {
			var userRepo = '';

			try {
				userRepo = JSON.parse(repoRequest.responseText);
			} catch (e) {
				console.log(e);
				console.log(repoRequest.responseText);
				return;
			}
		for (index = 0; index < userRepo.repository.packages.length; ++index) {
				if (userRepo.repository.icon == repoIcon) {
					var newDesc = userRepo.repository.packages[index].description.toString().replace(/<br>/g, "");
					userRepo.repository.packages[index].description = newDesc;
					catList += "<li height='110'><a class='external' href='" + userRepo.repository.packages[index].link + "'><div class='item-content'><div class='item-media'><img style='width:42px;height:42px;border-radius:11px;' src='" + userRepo.repository.packages[index].icon + "'></div>" +
						'<div class="item-inner" style="padding-top: 5px;padding-bottom: 7px;margin-left: 0px;padding-left: 15px;"><div class="item-title" style="color:black;"><span style="font-weight:500;">' + userRepo.repository.packages[index].name +
						'</span><br />' +
						'<div class="item-desc" style="float:left;display:block;font-size:12px;color:#666;">' + newDesc +
						'</div></div></div></div></a></li>';
					$$("#repo-name").html(userRepo.repository.name);
				}
			}

			$$(".inner-packages").html(catList);
		}
	}
	repoRequest.open("POST", "repositories/json.php", true);
	repoRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	repoRequest.send("repo=" + element);
}

function addRepository() {
	console.log('[Time Repositories] Adding repository..');
	myApp.prompt('', 'Enter Time/Repo URL',
		function(value) {
			var protomatch = /^(https?|ftp):\/\//;
			if (!protomatch.test(value)) {
				value = "http://" + value;
			}
			
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					try {
						var repo = JSON.parse(request.responseText);
					} catch (e) {
						console.log(e);
						console.log(request.responseText);
						myApp.alert("The URL you provided is invalid. Please check the URL and try again.", 'TimeStore 2');
						return;
					}
					var currentRepos = JSON.parse(localStorage.getItem("timerepos"));
					try {
						currentRepos.push(value);
					} catch (e) {
						currentRepos = [value];
					}
					var newRepos = JSON.stringify(purgeDuplicates(currentRepos));
					localStorage.setItem("timerepos", newRepos);
					populateRepos();
				}
				

			}
			request.open("POST", "repositories/json.php", true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send("repo=" + value);
		},
		function(value) {}
	);

}

function deleteRepository(url) {
	console.log('[Time Repositories] Deleting repository..');
	var currentRepos = JSON.parse(localStorage.getItem("timerepos"));
	var repoIndex = currentRepos.indexOf(url);
	if (repoIndex > -1) {
		currentRepos.splice(repoIndex, 1);
	}
	localStorage.setItem("timerepos", JSON.stringify(currentRepos));
	myApp.getCurrentView().router.refreshPage();
	populateRepos();
}

function onReset() {

	if (localStorage.getItem("timerepos") === null) {

	
		var userRepos = ['http://timedevs.net/repo/'];
		
		localStorage.setItem("timerepos", JSON.stringify(userRepos));
		
		myApp.addNotification({
			title: '<span style="color:white">Time Repositories</span>',
			subtitle: 'Welcome to TimeApps!',
			message: 'We have already added the default repo for you!',
			media: '<img style="border-radius: 7px;" src="http://timedevs.net/repo/img/TimeStore.jpg" width="44"></img>',
			onClick: function() {
				myApp.closeNotification(".notification-item");
			}
		});
	}
}

function FirstRun() {
 if(localStorage.getItem("timerepos") == null) {
  localStorage.addItem("timerepos", JSON.stringify("http://timedevs.net/repo/");
  localStorage.addItem("timerepos", JSON.stringify("http://teamihackify.mojorepo.cf");
  localStorage.addItem("timerepos", JSON.stringify("http://official.mojorepo.cf");
  localStorage.addItem("timerepos", JSON.stringify("http://teamihackify.com/Repo/");
myApp.showPreloader('Adding Default Repositories...');
setTimeout(function() {
	myApp.hidePreloader();
	myApp.alert('Test');
}, 3500);
 }
}

function commAddSource(url) {
	var currentRepos = JSON.parse(localStorage.getItem("timerepos"));
	currentRepos.push(url);
	var newRepos = JSON.stringify(purgeDuplicates(currentRepos));
	localStorage.setItem("timerepos", newRepos);
	myApp.showTab('#tab2');
	reloadSources();
}

function reloadSources() {
	myApp.getCurrentView().router.refreshPage(); 
	myApp.showPreloader('Reloading Data...');
	populateRepos();
	setTimeout(function() { myApp.hidePreloader(".preloader-item"); }, 2500);
}

function purgeDuplicates(arr) {
	console.log('[Time Repositories] Clearing duplicates..');
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i]] = true;
	}
	arr = [];
	for (var key in obj) {
		arr.push(key);
	}
	return arr;
}