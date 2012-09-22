// JS
$(function() {
	
	$(window).scroll(function () { 
		
		var scrollTop = $(window).scrollTop();
		if(scrollTop > 0){
			$('#wrapper').removeClass('expanded-top');
		}else{
			//$('#wrapper').addClass('expanded-top');
		}
	
	});
	
	$('.menu-focus li').click(function(){
		var clicked = $(this).text().toLowerCase();;
		$('body').removeClass().addClass('display-' + clicked);
	});
	

	var iconMap = {
		'clear' : 'Sun',
		'Sun' : 'Sun',
		'rain' : 'Cloud-Rain', 
		'chancetstorms' : 'Cloud-Rain', 
		'fog' : 'Cloud-Fog',
		'mostlycloudy' : 'Cloud-Fog',
		'partlycloudy' : 'Cloud-Fog',
		'chancerain' : 'Cloud-Drizzle',
		'windy' : 'Wind'
	};

	//compile templates
	var todayTemplate = Handlebars.compile($("#today-template").html());
	var forecastTemplate = Handlebars.compile($("#forecast-template").html());

	//render
	var render = function(data){
		var forecast = data.forecast;

		//render today
		forecast[0].icon = iconMap[forecast[0].icon]; //set proper icon for today
		$('.forecast-today').html(todayTemplate(forecast[0]));
		

		//render forecast
		forecast.splice(0, 1); //remove today
		//set proper icon class
		for(var i = 0; i < forecast.length; i++){ console.log(forecast[i].icon)
			forecast[i].icon = iconMap[forecast[i].icon];
		}
		var data = {forecast : forecast};
		$('.forecast-days').html(forecastTemplate(data));

	};

	//get data
	navigator.geolocation.getCurrentPosition(function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;

		$.ajax({
			url : 'http://mattnull.simplecast.jit.su/weather?lat='+lat+'&lon='+lon,
			dataType : 'jsonp',
			success : function(data){ console.log(data)
				render(data);
			}
		});
	});
});