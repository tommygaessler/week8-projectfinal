// Created by Tommy Gaessler!
// tommy.gaessler@me.com
// https://www.instagram.com/tman_5/
// https://www.linkedin.com/in/tommygaessler
// https://github.com/tommygaessler

$(document).ready(function()
{
	$(document).keypress(function(e) //runs instagram function when enter is pressed
	{
	    if(e.which == 13) 
	    {
	    	$("input").blur(); //hides keybaord when enter pressed on touch device
	    	$("button").css("background", "#2F4858"); //acts liked hover/active when enter is pressed
	        instagram();
	    	setTimeout(function(){ $("button").css('background', ''); },500) //deletes inline style
	    }
	});

	$("button").on('click', function() //runs instagram function when button is pressed
	{
		if ('createTouch' in document) //fixies sitcky hover for touchdevices
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
		$("button").css("background", "#2F4858");//acts liked hover/active when button is pressed on touch device
		instagram();
		setTimeout(function(){ $("button").css('background', ''); },500) //deletes inline style
  	});

  	function instagram() //find most liked instagram photo function
	{
		var access_token = "access_token_here"

	    $("li").remove();
		var user = $('input').val().toLowerCase();
		var compare = [];
		// console.log(user);

	    if (user == "") //sees if text was entered
	    {
	    	confirm("Enter a username!");
	    }

	    else //text was entered
	    {
		    $.ajax(
		    //queries users
		    {
		    	type: "GET",
		      	dataType: "jsonp",
		      	cache: false,
		      	url: "https://api.instagram.com/v1/users/search?q=" + user + "&access_token=" + access_token,

		      	success: function(data)
		  		{
		      		// console.log(data.data.length);
			        if (data.data.length == 0) //non existant username and no search results come up
			        {
			        	// console.log("This user name does not exist, 0 came up");
				        confirm("This username does not exist, check spelling!")
				    }
				        
			        else //existant or non existant username, with search results
			        {
			        	for(i=0; i<data.data.length; i++) //loops through all username results
			          	{
			          		if (user == data.data[i].username) //if entered username is found
			          		{
			            		// console.log("if" + data.data[i].username);
			            		var id = data.data[i].id; //get user id
			            		// console.log(id);
			            		break; //break out of loop
			          		}

			          		else //if entered username was not found

			          		//You only get 1 result that is wrong, or 50 results that are wrong, when a non existant username is entered, but data comes back
				            {
				            	if (data.data.length == 50)
				            	{
				            		// console.log("Does not exist, 50 came up");
					            	confirm("This username does not exist, check spelling!")
					            	break; //break out of loop
					            }

					            else if (data.data.length == 1)
					       		{
					           		// console.log("Does not exist, 1 came up");
					            	confirm("This username does not exist, check spelling!");
					            	break; //break out of loop
					            } 	
					        }
				        }

				        $.ajax(
				        //gets users 33 recent media
			            {
			            	type: "GET",
			              	dataType: "jsonp",
			              	cache: false,
			              	url: "https://api.instagram.com/v1/users/" + id + "/media/recent/?access_token=" + access_token + "&count=33",

			              	success: function(data)
			              	{
				                if (data.meta.code == 400) //user is private
				                {
				                	confirm("This user is private!");
				                }
					                
				                else if (data.data.length == 0)
				                //user has no posts
				                {
				                  	confirm("This user has no posts!");
				                }
					                
				                else
				                {
				                //loops through users data
				                	for (var a = 0; a < data.data.length; a++) 
				                	{
				                  		var likes = data.data[a].likes.count;//finds likes
				                  		// console.log(likes);
				                  		compare.push(likes); //pushes likes to compare array
				                	}

					                // console.log(compare);

					                for (i = 0; i < compare.length; i++) //loops through array with likes
					                {
					                	if (compare[i] > likes) //finds largest like
					                	{
					                    	likes = compare[i];
					                    	a = compare.indexOf(likes); //declares "a" which is array position of largest like
					                  	}
					                }

					                // console.log(likes);
					                // console.log(a);

					                if (a === 33) //fixes invisible number array bug
					                {
					                	a -= 1;
					                  	// console.log(a);
					                }

					                $(".popular").append("<li><a target='_blank' href='" + data.data[a].link + "'><img src='" + data.data[a].images.standard_resolution.url + "'></img></a></li>"); //uses "a" to append largest liked picture to li

					                $(".likes").append("<li><h2>Number of likes: " + likes + "</h2></li>"); //appends the number of likes the most liked picture has to an li

					                $('html, body').animate({
        							scrollTop: $("#picture").offset().top }, 1500); //scrolls down to id called "picture" so user can see the most liked picture, and amount of likes without scrolling
				              	}
			              	}
			            });
			        }
		      	}
		    });
		}
	}
});