myApp.onPageBeforeAnimation("repos-list", function() {
	populateRepos();
});
myApp.onPageBeforeAnimation("packages-list", function() {
	populatePackages();
});

function populateRepos() {
	console.log('[Mojo Repositories] Populating repo list..');
	if (localStorage.getItem("mojorepos") === null) {
		$$(".inner-repos").html("");
		return;
	}
	repoList = '';
	var userRepos = JSON.parse(localStorage.getItem("mojorepos"));
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
			repoList += "<li class='swipeout'><a onclick=\"repoIcon=\'" + userRepo.repository.icon + "\'\" href=\"repositories/packages.html\" class=\"item-link\"><div class='swipeout-content'><div class='item-content'><div class='item-media'><img style='border-radius:21%;width: 29px;' src='" +
				userRepo.repository.icon + "'></div><div class='item-inner' style='padding-top: 5px;padding-bottom: 7px;margin-left: 0px;padding-left: 15px;'><div class='item-title-row' style=\"font-weight:bold;\">" + "<div class=\"item-title\" style=\"color: #000; font-weight: 500; height: 22px;\"><font size=\"4\">" + userRepo.repository.name + "</font></div>" + 
				"</div><div class='item-subtitle' style='color: #666666;height: 19px; padding-bottom: 0px;'><font size=\"2\">" + element + "</font></div></div></div></div></a><div class='swipeout-actions-right'><a href='#' class='bg-red' onclick=\"deleteRepository('" + element + "');\" data-i18n=\"repos.delete\">Delete</a></div></li>";

			$$(".inner-repos").html(repoList);
		}
	}
	repoRequest.open("POST", "repositories/json.php", true);
	repoRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	repoRequest.send("repo=" + element);
}


function populatePackages() {
	console.log('[Mojo Repositories] Populating specific public source..');
	if (localStorage.getItem("mojorepos") === null) {
		$$(".inner-packages").html("");
		return;
	}
	catList = '';
	var userRepos = JSON.parse(localStorage.getItem("mojorepos"));
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
	console.log('[Mojo Repositories] Adding repository..');
	myApp.prompt('', 'Enter M-Repo URL',
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
						myApp.alert("The M-Repo you provided is invalid. Please check the URL and try again.", 'Error');
						return;
					}
					var currentRepos = JSON.parse(localStorage.getItem("mojorepos"));
					try {
						currentRepos.push(value);
					} catch (e) {
						currentRepos = [value];
					}
					var newRepos = JSON.stringify(purgeDuplicates(currentRepos));
					localStorage.setItem("mojorepos", newRepos);
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
	console.log('[Mojo Repositories] Deleting repository..');
	var currentRepos = JSON.parse(localStorage.getItem("mojorepos"));
	var repoIndex = currentRepos.indexOf(url);
	if (repoIndex > -1) {
		currentRepos.splice(repoIndex, 1);
	}
	localStorage.setItem("mojorepos", JSON.stringify(currentRepos));
	myApp.getCurrentView().router.refreshPage();
	populateRepos();
}

function reloadSources() {
	myApp.getCurrentView().router.refreshPage();
	populateRepos();
}

function purgeDuplicates(arr) {
	console.log('[Mojo Repositories] Clearing duplicates..');
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