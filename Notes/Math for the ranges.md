This api:  http://www.wunderground.com/weather/api/d/docs?d=data/almanac
We get this data: temp_high.normal.F
this value will be our daily baseline.  I think weather won't change much outside of this, so we give it a range to work inside of.  I'm thinking 15 degrees in either direction.

If we want a little bit of a shortcut, we can judge each forecast day by the temp_high.normal.F of the first.

## Vars for for temps:
var Normal = temp_high.normal.F  (or low, for the lows)
var Range = 10.  totally arbitraty
var NormalTop = Normal + Range
var NormalBottom = Normal - Range
var Today = Either the high or the low for the current day.

### math for highs
// we get percent within the range.

var Percent = (((Today - NormalBottom)/(Range*2))*100)

### math for lows
// we get percent within the range.

var Percent = (((NormalTop - Today)/(Range*2))*100)

// colds will seem reversed, since I want to show colors on the 
coldest days, not warmest.

### math for rain
no math needed, I think.  we just need a number like '12' for 12%.  and it'll get rounded out to 15% later on.

## Make percents work with our 5% steps for the class names.  Note on this, I *may* take the rounding to 1% from 5% if it needs more subtlety:
// make the percent conform to the 5% steps we set up

Math.round(parseInt(Percent)/5)*5

# other options:
We may want to explore other options to get more variation in numbers.  They could be:
- compare numbers to the max/min of the set, so every set has a full spectrum of colors.  this may prove confusing when you have a set of 99 degree days and one 98 degree day (the 98 degree day would be 'cold')
- compare numbers to a preset and arbitrary min/max set.  so highs are 30-90 and low is 0-60 year round.  this would work well to get solid baselines, but kinda boring in mild, stable climates.