// JS
$(function() {

	$(window).scroll(function () { 
		
		var scrollTop = $(window).scrollTop();
		
		if(scrollTop > 0){
			$('#wrapper').removeClass('expanded-top');
		}else{
			$('#wrapper').addClass('expanded-top');
		}
	
	});
	 var calcStrength = function(clicked){
	 	// The List
		$('.forecast-days > li').each(function(){
			var val = $(this).find('.meta-' + clicked).text();
			var val = val.slice(0, -1);
			var forecast = $('.forecast-days');
			var highData = parseInt(forecast.attr('data-temp-high'));
			var lowData = parseInt(forecast.attr('data-temp-low'));

			if(clicked == 'high') {
				var Str = calcAsc(val, highData);
			} else if(clicked == 'low') {
				var Str = calcDsc(val, lowData);
			} else if(clicked == 'rain') {
				var Str = calcPercent(val);
			}
			$(this).removeClass().addClass('str-' + Str);
			$('#top-wrap').removeClass().addClass('str-' + Str);
		});
	 }
	
	/* MATH STUFF:  the following functions are here to find the strength to apply colors. */
	
		// function to clip ranges between 0 and 100
		function clip(Percent) {
			var num = (num > 100) ? 100 : num;
			var num = (num < 0) ? 0 : num;
			return Percent;
		}
		
		// return the correct strength classes function.
		var range = 5;
		function calcAsc(val, data) { // for highs.  highest temps highlighted
			var Normal = data; // get from api
			var NormalBottom = Normal - range; // bottom of range around normal temp
			var Percent = Math.round(parseInt((((val - NormalBottom)/(range*2))*100))/5)*5;
			clip();
			return Percent;
		}
		function calcDsc(val, data) { // for lows.  coldest temps get highlghted
			var Normal = data; // get from api
			var NormalTop = Normal + range; // top of range around normal temp
			var Percent = Math.round(parseInt((((NormalTop - val)/(range*2))*100))/5)*5;
			clip();
			return Percent;
		}
		function calcPercent(val) { // for standard percents
			var Percent = Math.round(parseInt(val)/5)*5;
			clip();
			return Percent;
		}
	
		/* handling the display of stuff */
		// change colors/focus when clicked in top header
		$(document).on('click', '.menu-focus li', function(){
			var clicked = $(this).text().toLowerCase();
			$('body').removeClass().addClass('display-' + clicked);
			
			calcStrength(clicked);
			
			// the top header changes when clicked?
			/* 
			$('#top-wrap').each(function(){
				var val = $(this).find('.meta-' + clicked).text();
				var val = val.slice(0, -1);
				if(clicked == 'high') {
					var Str = calcAsc(val);
				} else if(clicked == 'low') {
					var Str = calcDsc(val);
				} else if(clicked == 'rain') {
					var Str = calcPercent(val);
				}
				$(this).removeClass().addClass('str-' + Str);
			});
			*/
		});
		
		/* when page loads... */
		// The List
		// $('.forecast-days > li').each(function(){
		// 	var val = $(this).find('.meta-high').text();
		// 	var val = val.slice(0, -1);
		// 	var Str = calcAsc(val);
		// 	$(this).removeClass().addClass('str-' + Str);
		// });
	
	
	// @todo.  andrew, clean up the CSS and icons to match this list.
	var iconMap = {
		'clear' : 'Sun',
		'Sun' : 'Sun',
		'sunny' : 'Sun',
		'rain' : 'Cloud-Rain', 
		'chancetstorms' : 'Cloud-Lightning', 
		'chancestorms' : 'Cloud-Lightning',
		'tstorms' : 'Cloud-Lightning',
		'fog' : 'Cloud-Fog',
		'hazy' : 'Cloud-Fog',
		'mostlycloudy' : 'Cloud',
		'cloudy' : 'Cloud',
		'mostlysunny' : 'Cloud-Sun',
		'partlycloudy' : 'Cloud-Sun',
		'partlysunny' : 'Cloud-Sun',
		'chancerain' : 'Cloud-Drizzle',
		'windy' : 'Wind',
		'chanceflurries' : 'Cloud-Snow',
		'chancesleet' : 'Cloud-Hail',
		'sleet' : 'Cloud-Hail',
		'chancesnow' : 'Snowflake',
		'flurries' : 'Cloud-Snow',
		'snow' : 'Cloud-Snow',
		'unknown' : 'Cloud-Sun'
	};

	//compile templates
	var todayTemplate = Handlebars.compile($("#today-template").html());
	var forecastTemplate = Handlebars.compile($("#forecast-template").html());

	//render
	var render = function(data){
		var forecast = data.forecast;

		//render today
		forecast[0].icon = iconMap[forecast[0].icon]; //set proper icon for today
		$('#today').html(todayTemplate(forecast[0]));
		
		//render forecast
		forecast.splice(0, 1); //remove today
		//set proper icon class
		for(var i = 0; i < forecast.length; i++){ 
			forecast[i].icon = iconMap[forecast[i].icon];
		}
		var data = {forecast : forecast, almanac : data.almanac};
		$('#forecast').html(forecastTemplate(data));

		calcStrength('high');
	};

	//get data
	navigator.geolocation.getCurrentPosition(function(pos){
		var lat = pos.coords.latitude;
		var lon = pos.coords.longitude;

		$.ajax({
			url : '/weather?lat='+lat+'&lon='+lon,
			dataType : 'jsonp',
			success : function(data){ console.log(data)
				render(data);
			}
		});
	});
	
});