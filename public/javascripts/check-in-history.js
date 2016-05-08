// next steps:
// 'return to today' button
// fix bug for displaying full month names


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
		//Disable Next Week on load:
		// $('#next-week').hide();
		updateDateRange(targetDate);
		$('#prev-week').click(function(){
			targetDate.setDate(targetDate.getDate()-7);
			updateDateRange(targetDate);
			//Enable next week:
			// $('#next-week').show();
		})
		$('#next-week').click(function(){
			targetDate.setDate(targetDate.getDate()+7);
			updateDateRange(targetDate);	
			if(targetDate>=today){
				//Disable next week button:
				// $('#next-week').hide();
			}	
		})
	} else {
		console.log('no');
	}
})

$(document).ready(function(){
	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(function(){
		drawLineGraph(fudgeData(7),options);
	});

	function fudgeData(days){
		var outputArray = [];
		var dateArray = [];
		var today = new Date(2016, 4, 6);
		for (var i = 0; i<days; i++){
			var x;
			x = today.setDate(today.getDate()-1);
			dateArray.push(x);
		}
		for (var i = 0; i<days; i++){
			var x = [new Date(dateArray[i]),Math.min(i+6,10),10,Math.max(7-i,0),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1)];
			outputArray.push(x);
		}
		return outputArray;
	}

	var options = {
		hAxis: {
		  format: 'EEE, MMM d'
		},
		vAxis: {
		  gridlines: {count: 6},
		  viewWindowMode: 'pretty',
		},
		// title: 'Daily Check-In Results',
		titleTextStyle: {
			fontName: 'Droid Serif',
			fontSize: 24
		},
		legend: {
			position: 'top',
			alignment: 'center',
		},
		height: 400,
		lineWidth: 3,
		focusTarget: 'datum',
		pointSize: 7,
		// backgroundColor: 'grey',
		animation: {
			startup: true,
			duration: 500,
			easing: 'out'
		},
		chartArea:{
			height:'70%', 
			top: 50,
			left: 50,
			width: '90%'
		},
		fontSize: 18,
		fontName: 'Droid Sans'
	};

	function drawLineGraph(dataArray,options) {
		//set up DataTable. This won't change again.
		var data = new google.visualization.DataTable();
		data.addColumn('date', 'X');
		data.addColumn('number', 'Cravings');
		data.addColumn('number', 'Sleep');
		data.addColumn('number', 'Stress');
		data.addColumn('number', 'Mood');
		data.addColumn('number', 'Energy');
		data.addColumn('number', 'Goals');
		data.addRows(dataArray);

		//the Data View is the object that mutates with form input:
		var filteredData = new google.visualization.DataView(data);
		filteredData.setColumns([0,4,6]);

		// filteredData.hideColumns([1]);
		// filteredData.setColumns(['X','Mood','Goals']);
		// filteredData.hideColumns(['Energy']);

		// According to the documentation, I shouldn't need to use the toDataTable method, but I get an error message without it (as far as I can tell, this is a bug)
		var chart = new google.visualization.LineChart(document.getElementById('line-chart'));
		chart.draw(filteredData.toDataTable(),options);

		$('#toggle-categories').on('change',function(e){
			var visibleCols = [0];
			$(this).children().children().each(function(){
				if($(this).prop('checked')){
					visibleCols.push(parseInt($(this).prop('id').substring(3)));
				};
				// if($(this).prop('checked',true)){
				// 	// console.log(this.id);
				// }
				// console.log($(this).prop('checked'));
			});
			filteredData.setColumns(visibleCols);
			chart.draw(filteredData.toDataTable(),options);
		});
	}



})
