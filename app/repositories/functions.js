setReset();
myApp.onPageBeforeAnimation("repos-list", function() {
	populateRepos();
});
myApp.onPageBeforeAnimation("packages-list", function() {
	populatePackages();
});

function resetStorage() {
	localStorage.removeItem('timerepos');
	localStorage.removeItem('timestoreversion');
		localStorage.clear();
		myApp.addNotification({

			closeIcon: false,
      message: '<span style="margin-top:5px;vertical-align:center;">Resetting...</span>',
    });
		 setTimeout(function() { myApp.closeNotification(".notification-item"); 
			location.reload(true);
		}, 3000);
		 
	
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
						myApp.alert("The Repo you provided is invalid. Please check the URL and try again.", 'TimeStore');
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

function setReset() {

	if (localStorage.getItem("timerepos") === null) {

	
		var userRepos = ['http://timedevs.net/repo/', 'http://teamihackify.mojorepo.cf'];

		localStorage.setItem("timerepos", JSON.stringify(userRepos));
		localStorage.setItem("timestoreversion", "2.0.13");

		myApp.addNotification({
			title: '<span style="color:white">Time Repositories</span>',
			subtitle: 'Welcome to TimeApps!',
			message: 'We have already added the default repo for you!',
			media: '<img style="border-radius: 7px;" src="../../repo/img/TimeStore.jpg" width="44"></img>',
			onClick: function() {
				myApp.closeNotification(".notification-item");
			}
		});
	}
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
	populateRepos();

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

function checkForUpdatesOnLoad() {
  console.log("[Time Repositories] Checking for application updates..");
  if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
    $.getJSON("update.json", function(data) {
      var updateAccepted = false;
      var closeButtonPressed = false;
      myApp.addNotification({
        title: "TimeStore Update",
        message: "New version is now available.",
        media: "<img style='width: 29px; height: 29px; border-radius: 21%' src='img/icon.png' />",
        onClose: function() {
          closeButtonPressed = true;
          if (!updateAccepted) {
            myApp.alert(unescape("Updates will be installed when TimeStore 2 is restarted", "Update System"));
          }
        },
        onClick: function() {
          setTimeout(function() {
            if (!closeButtonPressed) {
              updateAccepted = true;
              myApp.closeNotification("li.notification-item");
              mainView.loadPage("appdate.html");
            }
          }, 10);
        }
      });
    });
  }
}

function update() {
  var html = "<div> \
			<div class='content-block tablet-inset'> \
				<div class='content-block-inner'> \
					<img src='img/icon.png' style='width: 60px; height: 60px; border-radius: 21%; vertical-align: top; float: left;'> \
					<p style='margin: 0; margin-left: 8px;'> \
						<span style='font-weight: 500; font-size: 15px; margin-left: 8px'>TimeStore Update ({{version}})<br></span> \
						<span style='font-size: 13px; margin-left: 8px' data-i18n='main.by'>By: TeamiHackify<br></span> \
						<span style='font-size: 13px; margin-left: 8px'>Downloaded</span> \
					</p> \
					<p>{{description}}<br><br>For more information, visit:<br><a href='http://timedevs.net/timeapps' class='external' target='_blank' style='text-decoration: underline; color: #007aff;'>http://timedevs.net/timeapps/</a>{{instructions}}</p> \
				</div> \
			</div> \
			</div> \
				<div class='list-block tablet-inset'> \
				<ul> \
					<li class='center item-button'> \
						<a href='#' class='update-button'> \
							<div class='item-content'> \
								<div class='item-inner'> \
									<div class='item-title' style='width: 100%; color: #007aff;' data-i18n='navbar.install'>Install Now</div> \
								</div> \
							</div> \
						</a> \
					</li> \
				</ul> \
			</div>";
  $.getJSON("update.json", function(data) {
    $('p#update-status').closest(".page-content").html(html.replace(/{{version}}/g, data.en.updates[0].version).replace(/{{description}}/g, data.en.updates[0].description).replace(/{{instructions}}/g, ""));
    $('span#content').html(data.en.updates[0].content);
    $('.update-button').on("click", function() {
      myApp.modal({
        title: "Software Update",
        text: unescape("New TimeStore version will begin installing. The app will restart when installation is finished."),
        buttons: [
          {
            text: "Later",
            onClick: function() {
              myApp.closeModal();
            }
							},
          {
            text: "Install",
            bold: true,
            onClick: function() {

							myApp.addNotification({
									title: '',
									subtitle: '',
									closeIcon: false,
									message: '<span style="margin-top:5px;vertical-align:center;">Installing update...</span>',
									media: '<img src="img/data.svg" width="20"></img>'
								});
              // 									$('body').append("<div class=\"update-view\"><img src=\"https://pbs.twimg.com/profile_images/671096122530656256/asiTmBmi_400x400.png\" style=\"border-radius:20%;\" /></div>");
              setTimeout(function() {
                myApp.closeNotification(".notification-item");
                localStorage.setItem('timestoreversion', data.en.updates[0].version);
                location.reload(true);
              }, 2500);
            }
							}
						]
      });
    });
  });
}

myApp.onPageAfterAnimation("update", function() {
  if (navigator.onLine) {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      setTimeout(function() {
        update();
      }, 1000);
    } else {
      setTimeout(function() {
        window.applicationCache.removeEventListener("updateready", checkForUpdatesOnLoad, false);
        window.applicationCache.addEventListener("updateready", function() {
          if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            update();
          }
        }, false);
        window.applicationCache.update();
      }, 2000);
      setTimeout(function() {
        if (window.applicationCache.status === window.applicationCache.IDLE) {
          $('p#update-status').html(unescape("TimeStore <br>Your software is up to date."));
        }
      }, 3000);
    }
  } else  {
    myApp.alert("Software Update is not available at this time. Try again later", "Software Update Unavailable");
    $('p#update-status').html("Software Update Unavaliable.");
  }
});