// next steps:
// better sidebar nav
// organize css (multiple files, by page?)

$(document).ready(function(){
	try {
		google.charts.load('current', {packages: ['corechart', 'line']});
	} catch(e) {
		$('#chart-error-div').addClass('alert alert-warning').show();
		$('#chart-error-text').text('Can\'t load the Google Charts package. Are you connected to the internet?');
		return;
	}

	var months = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var colorList = [null, '#2C3E50' ,'#18BC9C', '#3498DB', '#F39C12', '#E74C3C', 'darkblue'];
	var initialOptions = {
		colors: colorList,
		hAxis: {
		  format: 'EEE, MMM d',
		  gridlines: {count: 8},
		  viewWindow: {}
		},
		vAxis: {
		  gridlines: {count: 6},
		  viewWindowMode: 'pretty',
		  viewWindow: {
		  	min: 0,
		  	max: 10
		  }
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
		fontName: 'Droid Sans',
		// Drag-to-pan isn't working as of May 2016, due to a bug on Google's end. Maybe in the future?
		// explorer: {
		// 	actions: ['dragToPan'],
		// 	axis: 'horizontal',
		// 	keepInBounds: true
		// }
	};

	function fudgeData(days){
		var outputArray = [];
		var dateArray = [];
		var today = new Date(2016, 4, 10);
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

	//Create DataTable. This object won't change once created. (It's DataView will.)
	function createTable(dataArray){
		var data = new google.visualization.DataTable();
			data.addColumn('date', 'X');
			data.addColumn('number', 'Cravings');
			data.addColumn('number', 'Sleep');
			data.addColumn('number', 'Stress');
			data.addColumn('number', 'Mood');
			data.addColumn('number', 'Energy');
			data.addColumn('number', 'Goals');
			data.addRows(dataArray);
			return data;
	}

	// Generic debounce function. Used below to slow chart re-draw on window resize
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	function createLineGraph(dataArray,options) {
		var data = createTable(dataArray);
		var currentOptions = options;
		//the Data View is the object that mutates with form input:
		var filteredData = new google.visualization.DataView(data);
		var chart = new google.visualization.LineChart(document.getElementById('line-chart'));

		var viewWidth = 7;
		var finalDate, earliestDate;

		function resetDates(){
			finalDate = new Date(dataArray[0][0].getTime());
			earliestDate = new Date(finalDate.getTime());
			earliestDate.setDate(earliestDate.getDate()-(viewWidth-1));
		}

		function goPast(){
			earliestDate.setDate(earliestDate.getDate()-viewWidth);
			finalDate.setDate(finalDate.getDate()-viewWidth);
			drawGraph(findActiveColumns(),currentOptions);
		}

		function goFuture(){
			earliestDate.setDate(earliestDate.getDate()+viewWidth);
			finalDate.setDate(finalDate.getDate()+viewWidth);
			drawGraph(findActiveColumns(),currentOptions);
		}

		function updateDateDisplay(){
			var earliestString = months[earliestDate.getMonth()]+" "+earliestDate.getDate();
			var finalString = months[finalDate.getMonth()]+" "+finalDate.getDate();
			var rangeString = earliestString+" - "+finalString;
			$('#date-range').text(rangeString);
		}

		function drawGraph(cols,options){
			filteredData.setColumns(cols);

			$('#go-future').removeClass('disabled');
			if (finalDate>=dataArray[0][0]){
				$('#go-future').addClass('disabled');
				resetDates();
			}
			
			currentOptions.hAxis.viewWindow.max = finalDate;
			currentOptions.hAxis.viewWindow.min = earliestDate;
			
			var tempOptions = options;
			var tempColors = [];
			//start loop at 1 to ignore the null color for x-values (dates)
			for (var i=1; i<cols.length; i++){
				tempColors.push(colorList[cols[i]]);
			}
			tempOptions.colors = tempColors;
			
			// According to the Google documentation, I shouldn't need to use the 
			// toDataTable method, but I get an error message without it (as far as 
			// I can tell, this is a bug in the library)
			updateDateDisplay();
			chart.draw(filteredData.toDataTable(),tempOptions);
		}

		function findActiveColumns(){
			var $selector = $('#toggle-categories');
			var visibleCols = [0];
			$selector.children().children().each(function(){
				if($(this).prop('checked')){
					visibleCols.push(parseInt($(this).prop('id').substring(3)));
				}
			});
			return visibleCols;
		}

		//redraw when window resized:
		$(window).on('resize', debounce(
			function(){
				drawGraph(findActiveColumns(),currentOptions);
			}
			,150,false));

		//listen for control panel input:
		$('#toggle-categories').on('change',function(){
			drawGraph(findActiveColumns(),currentOptions);
		});

		$('#go-past').on('click',function(){
			goPast();
		});

		$('#go-future').on('click',function(){
			goFuture();
		});

		$('#jump-size-picker').on('click',function(e){
			switch(e.target.id) {
			    case "jump-7":
			        viewWidth=7;
			        $('#go-past').removeClass('disabled');
			        break;
			    case "jump-30":
			        viewWidth=30;
			        $('#go-past').removeClass('disabled');
			        break;
		        case "jump-all":
		        	viewWidth=dataArray.length;
		        	finalDate = new Date(dataArray[0][0].getTime());
		     		$('#go-past').addClass('disabled');
		        	break;
			    default:
			    	console.log('The switch goofed.');
			}
			//Need to modify a function-scoped variable, not the relatively global date variable:
			var tempEarliest = new Date(finalDate.getTime());
			tempEarliest.setDate(finalDate.getDate()-(viewWidth-1));
			earliestDate = tempEarliest;
			drawGraph(findActiveColumns(),currentOptions);
		});

		//keyboard controls:
		$(window).on('keydown',function(e){
			switch(e.which) {
			    case 37:
			    	e.preventDefault();
			    	goPast();
			        break;
		        case 39:
		        	e.preventDefault();
		        	goFuture();
			        break;
		    }
		});

		//listen for swipes on mobile:
		$('#line-chart').on('swipeleft',function(e){
			goFuture();
		});

		$('#line-chart').on('swiperight',function(e){
			goPast();
		});

		//initial draw:
		resetDates();
		drawGraph(findActiveColumns(),currentOptions);
	}
	
	google.charts.setOnLoadCallback(function(){
		createLineGraph(fudgeData(80),initialOptions);
	});
});



