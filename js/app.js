_.templateSettings.interpolate = /{([\s\S]+?)}/g;

//setting up the constructor function here
function RepoMan(githubUsername){
	this.username = githubUsername;

	this.init();
}

//Our first promise, we are first getting the promise from GitHub, then we are getting the data
RepoMan.prototype.getUserInfo = function() {
	return $.get('https://api.github.com/users' + this.username).then(function(data){
		return data;
	});
};

//Our second promise, we are first getting the promise from GitHub, then we are getting the data
RepoMan.prototype.getRepoInfo = function(){
	return $.get('https://api.github.com/users' + this.username + '/repos').then(function(data){
		return data;
	});
};

//Our third promise, we are first getting the promise from our template folder, then we are getting the data. This is why we need to have gulp watch
//As you can see, you cannot pull a promise from your local HDD, so hence gulp watch creates express server so we can pull this promise
RepoMan.prototype.loadTemplateFile = function(templateName) {
	return $.get('./templates/' + templateName + '.html').then(function(htmlstring){
		return htmlstring;
	});
};

RepoMan.prototype.putProfileDataOnPage = function(profileHtml, profile) {
	var d = new Date(profile.created_at)

	profile.joined = ["Joined on ", d.toDateString()].join(" "); //what is profile.joined ?? Also what is this line doing?

	document.querySelector('.left-column').innerHTML = _.template(profileHtml, profile);
};

RepoMan.prototype.putRepoDataOnPage = function(repoHtml, repos){

	document.querySelector('.right-column').innerHTML = repos.sort(function(a, b){
		var firstDate = new Date(a.updated_at),  //what is new Date(a.updated_at)
			secondDate = new Date(b.updated_at); //same as above
		return firstDate > secondDate ? -1 : 1;
	})

	.map(function(obj){
		var d = new Date(obj.updated_at); 
		obj.updated = ["Updated on ", d.toDateString()].join(" ");
		return _.template(repoHtml, obj);

	}).join(" ")

};

RepoMan.prototype.init = function(){
	var self = this;  //why are we creating a variable called self?

	$.when(
		this.getUserInfo,
		this.getRepoInfo,
		this.loadTemplateFile('profile'),
		this.loadTemplateFile('repo')
		).then(function(profile, repos, profileHtml, repoHtml){
			self.putProfileDataOnPage(profileHtml, profile)
			self.putRepoDataOnPage(repoHtml, repos)
		})
};




//executing our function to run the entire script
window.onload = app;

function app(){
//creates new Object called MyRepo
	var MyRepo = new RepoMan('abergen84');
}

