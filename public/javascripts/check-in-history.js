// next steps:
// 'return to today' button


$(document).ready(function(){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var today = new Date();
	var targetDate = new Date();
	function findWeek(date){
		var week = {};
	    var dayNumber = date.getDay();
	    var start = date.setDate(date.getDate()-dayNumber);
	    week.sunday = new Date(start);
	    var sat = date.setDate(date.getDate()+6);
	    week.saturday = new Date(sat);
	    return(week);
	}

	function prettyDate(date){
	    var pretty = months[date.getMonth()]+" "+date.getDate();
	    return pretty;
	}

	function updateDateRange(date){
		var week = findWeek(date);
		var sunday = prettyDate(week.sunday);
		var saturday = prettyDate(week.saturday);
		if (sunday.substring(0,3)===saturday.substring(0,3)){
			saturday = saturday.substring(3);
		}
		var weekString = sunday+" - "+saturday;
		$('#date-range').text(weekString);
	}

	if($('#history').length){
		$('#next-week').hide();
		updateDateRange(targetDate);
		$('#prev-week').click(function(){
			targetDate.setDate(targetDate.getDate()-7);
			updateDateRange(targetDate);
			$('#next-week').show();
		})
		$('#next-week').click(function(){
			targetDate.setDate(targetDate.getDate()+7);
			updateDateRange(targetDate);	
			if(targetDate>=today){
				$('#next-week').hide();
			}	
		})
	} else {
		console.log('no');
	}
})

