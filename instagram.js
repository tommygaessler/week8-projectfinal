// Created by Tommy Gaessler!
// tommy.gaessler@me.com
// https://www.instagram.com/tman_5/
// https://www.linkedin.com/in/tommygaessler
// https://github.com/tommygaessler

$(document).ready(function()
{
	$(document).keypress(function(e) //runs instagram function when user hits enter key
	{
	    if(e.which == 13) 
	    {
	    	$("input").blur(); //hides keyboard on touch device when enter is hit
	    	$("button").css("background", "#2F4858"); //changes color of the button when enter is hit, similar to an active/hover
	        instagram(); //runs instagram function
	    	setTimeout(function(){ $("button").css('background', ''); },500)
	    }
	});

	$("button").on('click', function() //runs instagram function when user hits button
	{
		if ('createTouch' in document) //fixes sitcky hover on touch devices
		{
		    try
		    {
		        var ignore = /:hover/;
		        for (var i=0; i<document.styleSheets.length; i++)
		        {
		            var sheet = document.styleSheets[i];
		            for (var j=sheet.cssRules.length-1; j>=0; j--)
		            {
		                var rule = sheet.cssRules[j];
		                if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText))
		                {
		                    sheet.deleteRule(j);
		                }
		            }
		        }
		    }
		    catch(e){}
		}
		$("button").css("background", "#2F4858");
		instagram(); //runs instagram function
		setTimeout(function(){ $("button").css('background', ''); },500)
  	});

  	function instagram() //finds most liked instagram picture function
	{
	    $("li").remove(); //clears previous picture
		var user = $('input').val().toLowerCase(); //makes input case insensitive
		var compare = [];
		var counter = 0;
		// console.log(user);

	    if (user == "") //if nothing is entered in input box
	    {
	    	confirm("Enter a username!");
	    }

	    else //if something is entered in input box
	    {
		    $.ajax( //uses user input to query instagram usernames
		    {
		    	type: "GET",
		      	dataType: "jsonp",
		      	cache: false,
		      	url: "https://api.instagram.com/v1/users/search?q=" + user + "&access_token=" + token,

		      	success: function(data)
		  		{
		      		// console.log(data.data.length);
			        if (data.data.length == 0) //no usernames appear
			        {
			        	// console.log("This user name does not exist, 0 came up");
				        confirm("This username does not exist, check spelling!")
				    }
				        
			        else //usernames appear
			        {
			        	for(i=0; i<data.data.length; i++) //loops through list of usernames
			          	{
			          		if (user == data.data[i].username) //a username match is the same as what the user entered in the input box, match!
			          		{
			            		// console.log("if" + data.data[i].username);
			            		var id = data.data[i].id; //finds the user id we need in order to get recent media

			            		$.ajax( //finds the users recent media
					            {
					            	type: "GET",
					              	dataType: "jsonp",
					              	cache: false,
					              	url: "https://api.instagram.com/v1/users/" + id + "/media/recent/?access_token=" + token + "&count=33",

					              	success: function(data)
					              	{
						                if (data.meta.code == 400) //username is private
						                {
						                	confirm("This user is private!");
						                }
							                
						                else if (data.data.length == 0) //username has no posts
						                {
						                  	confirm("This user has no posts!");
						                }
							                
						                else
						                {
						                	for (var a = 0; a < data.data.length; a++) //loops through usernames recent media
						                	{
						                  		var likes = data.data[a].likes.count; //finds users likes
						                  		// console.log(likes);
						                  		compare.push(likes); //pushes likes to an array called compare
						                	}

							                // console.log(compare);

							                for (i = 0; i < compare.length; i++) //loops through array of likes
							                {
							                	if (compare[i] > likes) //finds largest number of likes by comparing each like to eachother
							                	{
							                    	likes = compare[i];
							                    	a = compare.indexOf(likes); //grabs the array position of the largest like in the array compare, so we can use that same position to get the picture corresponding to the largest like
							                  	}
							                }

							                // console.log(likes);
							                // console.log(a);

							                if (a === 33) //invisible extra array number bug fix
							                {
							                	a -= 1;
							                  	// console.log(a);
							                }

							                $(".popular").append("<li><a target='_blank' href='" + data.data[a].link + "'><img src='" + data.data[a].images.standard_resolution.url + "'></img></a></li>"); //appends the picture to the ul in an li

							                $(".likes").append("<li><h2>Number of likes: " + likes + "</h2></li>"); //appends the amount of likes for that picture to a ul in an li

							                $('html, body').animate({
		        							scrollTop: $("#picture").offset().top }, 1500); //scrolls to the picture
						              	}
					              	}
					            });
			            		break; //breaks out of the loop
			          		}

			          		else if (user != data.data[i].username) //if the username is not found
			          		{
			          			counter++; //counts everytime a username is not found in the list of the usernames

			          			if (counter == data.data.length) //sees if the counter is the same as the number of usernames in the list, if it is, the username does not exist
			          			{
			          				confirm("This username does not exist, check spelling!");
			          			}
			          		}		        
				        }
				        // console.log(counter);
			        }
		      	}
		    });
		}
	}
	var token = "token_here"; //api token here
});