/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // This is an event handler function, which means the scope is the event.
        // So, we must explicitly called `app.report()` instead of `this.report()`.
        app.report('deviceready');
        $(window).scroll(function () { 
            
            var scrollTop = document.body.scrollTop;

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
        function clip(num) {
            return (num > 100) ? 100 : (num < 0) ? 0 : num;
        }
        
        // return the correct strength classes function.
        var range = 5;
        function calcAsc(val, data) { // for highs.  highest temps highlighted
            var Normal = data; // get from api
            var NormalBottom = Normal - range; // bottom of range around normal temp
            var Percent = Math.round(parseInt((((val - NormalBottom)/(range*2))*100))/5)*5;

            return clip(Percent);
        }
        function calcDsc(val, data) { // for lows.  coldest temps get highlghted
            var Normal = data; // get from api
            var NormalTop = Normal + range; // top of range around normal temp
            var Percent = -(Math.round(parseInt((((NormalTop - val)/(range*2))*100))/5)*5);
            return clip(Percent);
        }
        function calcPercent(val) { // for standard percents
            var Percent = Math.round(parseInt(val)/5)*5;
            return clip(Percent);
        }
    
        /* handling the display of stuff */
        // change colors/focus when clicked in top header
        $(document).on('click', '.menu-focus li', function(){
            var clicked = $(this).text().toLowerCase();
            $('body').removeClass().addClass('display-' + clicked);
            
            calcStrength(clicked);
            
            // the top header changes when clicked?
             
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
            
        });
        
    
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
        //navigator.geolocation.getCurrentPosition(function(pos){
            var pos = pos || null;
            var lat = pos && pos.coords.latitude ? pos.coords.latitude : 40.0150;
            var lon = pos && pos.coords.longitude ? pos.coords.longitude : -105.2700;

            $.ajax({
                url : 'http://mattnull.simplecast.jit.su/weather?lat='+lat+'&lon='+lon,
                dataType : 'jsonp',
                success : function(data){ console.log(data)
                    render(data);
                }
            });
       // });
    },
    report: function(id) {
        // Report the event in the console
        console.log("Report: " + id);

        // Toggle the state from "pending" to "complete" for the reported ID.
        // Accomplished by adding .hide to the pending element and removing
        // .hide from the complete element.
        // document.querySelector('#' + id + ' .pending').className += ' hide';
        // var completeElem = document.querySelector('#' + id + ' .complete');
        // completeElem.className = completeElem.className.split('hide').join('');
    }
};
