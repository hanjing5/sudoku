/*
Name    : Online Sudoku
Author  : Binny V A
Version : 2.00.A Beta
Website : http://www.geocities.com/binnyva
This code is Copyright (c) 2005 Binny V Abraham
License is granted to user to reuse this code on other Web site
if, and only if, this entire copyright notice is included. The Web Site
containing this script must be a not-for-profit(non-commercial) web site 
unless I gave permission for the use of the script.
End copyright - This must be retained and posted as is to use this script
along with a link to the original location.
*/

//////////////////////////////////// Global Variables /////////////////////////////////////////
var debug = 0;

var horizondal_line_width = 350;
var vertical_line_height = 370;
var default_number_per_box = 4;
var repeated_at = ""; //The ID of the location where number was repeated.
var compleated = 0;   //This will be one when the User hits the 'I give up' Button

var active_stylesheet="classic-style"; //The used stylesheet
var selected_cell; //The cell that was last clicked on.

//Timer Stuff
var timer_started = 0;
var timer_clock;
var timer_element;
var timer_seconds = 0;
var timer_paused = 0;

//Create a 9x9 2 dimentional Array - Cotains all the values of all the cells
var xy = new Array(9);
for(var i=0;i<9;i++) {
	xy[i] = new Array(9);
}
//Create a 9x9 2 dimentional Array - Contains the references to all the cells
//		- eg. cells[0][0] = $("c11"); etc. :OPTIMIZATION: 
var cells = new Array(9);
for(var i=0;i<9;i++) {
	cells[i] = new Array(9);
}

//Base Games
var puzzles = new Array(
"abc.gdefihdeif.hagcbfgh.cibade.bf.iehdcg.ae.acbf.gid.hghdiace.bficgdabhefh.b.f.cg.eaidde.ahfibcg", //15
"a.bfhiec.g.ddcg.fbai.heiehdg.cabfdegi.hc.fabai.cb.df.eghhf.be.agcidbfi.edhgcac.adgf.iheb.g.hebcaf.di", //19
"bfi.edhgcac.adgf.iheb.g.hebcaf.dia.b.fhiec.g.ddcg.fbai.heiehdg.cabfdegi.hc.fabai.cb.df.eghhf.be.agcid", //20
"ib.ad.c.g.efhe.hc.fbiagd.fg.daehcibbhcgd.faiegf.ei.ab.dchdai.hcebfgfgdcai.he.bbeahd.gc.ifih.c.e.bf.gda", //21
"aeh.dfi.cgbcf.b.e.hgiad.gidc.abfeh.fc.g.b.aeihdb.eifdha.gchda.ig.cebfg.bfhd.aeic.dcegi.f.hbaah.ibce.dfg",
"dah.iegfcbbigfd.cehae.fchab.gi.dbh.fe.gacidcedi.bhgaf.ag.i.d.cfbh.egb.ch.dea.f.ihf.e.aci.d.gbid.a.fbgceh",
"cf.b.ag.eidhhd.eif.cbaga.g.ibdh.fceg.acb.ifhe.d.dehgcafb.i.ifbe.hdg.acdc.iebg.f.haegf.ahd.cibhba.ci.f.deg",
"chfgeai.d.be.gdib.hcf.ab.iacf.dh.gefa.d.hcg.ebigic.bd.eahfeb.hfa.i.gdcd.gh.bica.fe.fei.hagd.cb.a.cbdefihg",
"adbfheig.c.icfba.gdeh.he.gcidfa.bcb.ide.ah.fgag.dh.fbei.cefhigcbd.abi.he.cd.gafg.de.fbach.i.acf.g.hid.b.e",
"ied.a.bfghchcfgeia.b.dagbh.cdi.efb.ied.ca.f.ghcga.ef.hdib.fd.hbig.cae.hdie.fg.cabb.a.e.ihcf.dggfcd.b.aehi",
"h.g.bc.ea.idfa.ci.bf.dgehfe.dih.gcbab.fi.ehg.acdh.dcfabi.geag.edc.ib.fhdah.gbe.ficebf.ci.ad.hggi.ch.df.e.ab",
".e.cadbhfgi.fbhegiad.cg.di.afch.bei.h.fba.g.cd.e.badhceif.g.ec.g.dif.b.hag.ibhe.da.fc.chagifde.bfedcabi.g.h",
"ge.c.h.i.fdabaif.bg.d.echdh.bae.cf.gic.he.fbdig.a.dbageifh.c.ifgca.hb.deb.dh.efg.acicf.e.ia.bhdggia.h.c.d.ebf",
"deb.cg.a.ihff.ah.dbi.egccgi.h.fe.bda.gcdf.bihae.a.fb.hd.ec.i.geihg.acfb.dbi.ca.d.hefgge.dbc.fi.haah.f.ie.gdcb"
);

var chosen = 0;
var this_puzzle = ""; //The currently played game's fingerprint
var orginal_game = ""; //The current puzzle

//////////////////////////////////// Cookie Functions ////////////////////////////////
var sudoku_fingerprint = getCookie("sudoku_fingerprint"); 	  // retrieve all the values
if (sudoku_fingerprint == null || sudoku_fingerprint == "") sudoku_fingerprint=""; //or define default values
function getCookie(name) {
	var start = document.cookie.indexOf( name + "=" );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
		return null;
	}
	if ( start == -1 ) return null;
	var end = document.cookie.indexOf( ";", len );
	if ( end == -1 ) end = document.cookie.length;
	return unescape( document.cookie.substring( len, end ) );
}
function setCookie(name, value) {
	var today = new Date();
	today.setTime( today.getTime() );
	var expires = 28;
	expires = expires * 1000 * 60 * 60 * 24;
	var expires_date = new Date( today.getTime() + (expires) );
	document.cookie = name+"="+escape( value ) +
		( ( expires ) ? ";expires="+expires_date.toGMTString() : "" )
}

////////////////////////////// Non Game Functions ///////////////////////////////////
//Changes the style sheet that is in use.
function selectStyleSheet() {
	$(active_stylesheet).disabled=true;
	active_stylesheet = $("style-selector").value;
	$(active_stylesheet).disabled=false;
}

function $(id) { return document.getElementById(id); }
function addEvent(elm, evType, fn) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, false);
		return true;
	}
	else if (elm.attachEvent) {
		var r = elm.attachEvent('on' + evType, fn);
		return r;
	}
	else {
		elm['on' + evType] = fn;
	}
}
function removeEvent(elm, evType, fn) {
	if (elm.removeEventListener) {
		elm.removeEventListener(evType, fn, false);
		return true;
	}
	else if (elm.detachEvent) {
		var r = elm.detachEvent('on' + evType, fn);
		return r;
	}
	else {
		elm['on' + evType] = '';
	}
}
//Returns the target of the event.
function findTarget(e) {
	var element;
	if (!e) var e = window.event;
	if (e.target) element = e.target;
	else if (e.srcElement) element = e.srcElement;
	if (element.nodeType == 3) element = element.parentNode;// defeat Safari bug
	return element;
}


////////////////////////////// Colour Functions /////////////////////////////////////
//Convert a hex value to its decimal value - the inputed hex must be in the
//	format of a hex triplet - the kind we use for HTML colours. The function
//	will return an array with three values.
function hex2num(hex) {
	if(hex.charAt(0) == "#") {	
		hex = hex.slice(1);
	}
	hex = hex.toUpperCase();
	var hex_alphabets = "0123456789ABCDEF";
	var value = new Array(3);
	var k = 0;
	var int1,int2;
	for(var i=0;i<6;i+=2) {
		int1 = hex_alphabets.indexOf(hex.charAt(i));
		int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
		value[k] = (int1 * 16) + int2;
		k++;
	}
	return(value);
}
//Give a array with three values as the argument and the function will return
//	the corresponding hex triplet.
function num2hex(triplet) {
	var hex_alphabets = "0123456789ABCDEF";
	var hex = "#";
	var int1,int2;
	for(var i=0;i<3;i++) {
		int1 = triplet[i] / 16;
		int2 = triplet[i] % 16;

		hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2); 
	}
	return(hex);
}

function fadeColor(id,start_hex,stop_hex,difference,delay,color_background) {
	//Default values...
	if(!difference) difference = 20;
	if(!delay) delay = 100;
	if(!start_hex) start_hex = "#FFFFFF";
	if(!stop_hex) stop_hex = "#000000";
	if(!color_background) color_background = "c";
	
	var ele = document.getElementById(id);
	if(!ele) return;
	var start= hex2num(start_hex);
	var stop = hex2num(stop_hex);
	
	//Make it numbers rather than strings.
	for(var i=0;i<3;i++) {
		start[i] = Number(start[i]);
		stop[i] = Number(stop[i]);
	}

	//Morph one colour to the other. If the start color is greater than the stop colour, start color will
	//	be decremented till it reaches the stop color. If it is lower, it will incremented.
	for(var i=0;i<3;i++) {
		if (start[i] < stop[i]) {
			start[i] += difference;
			if(start[i] > stop[i]) start[i] = stop[i];//If we have overshot our target, make it equal - or it won't stop.
		}
		else if(start[i] > stop[i]) {
			start[i] -= difference;
			if(start[i] < stop[i]) start[i] = stop[i];
		}
	}

	//Change the color(or the background color).
	var color = "rgb("+start[0]+","+start[1]+","+start[2]+")";
	if(color_background == "b") {
		ele.style.backgroundColor = color;
	} else {
		ele.style.color = color;
	}

	//Stop if we have reached the target.
	if((start[0] == stop[0]) && (start[1] == stop[1]) && (start[2] == stop[2])) return;

	start_hex = num2hex(start);
	//Keep calling this function
	window.setTimeout("fadeColor('"+id+"','"+start_hex+"','"+stop_hex+"',"+difference+","+delay+",'"+color_background+"')",delay);
}

//////////////////////////////////// Co-Ordinates Functions ///////////////////////////////
//Get the index from the given two x and y co-ordinates and return it.
//	  - Takes 2 and 3 and returns 6.
function getIndex(x,y) {
	var index = (y*3) + x - 3;
	return index;
}

//Returns the x and y co-ordinates based on the index given as argument.
//		- Takes 6 and returns 2 and 3 as an array
function getXY(index) {
	var x=1,y=1;
	switch (index) { 
		case 1: y=1; x=1; break;
		case 2: y=1; x=2; break;
		case 3: y=1; x=3; break;
		case 4: y=2; x=1; break;
		case 5: y=2; x=2; break;
		case 6: y=2; x=3; break;
		case 7: y=3; x=1; break;
		case 8: y=3; x=2; break;
		case 9: y=3; x=3; break;
	}
	return Array(x,y);
}

////////////////////////////////////// Random Number Genarators //////////////////////////////////////
//Returns a random number between 1 and 9(inclusive)
function rand() {
	var number = Math.round(Math.random()*10);
	while (number < 1 || number > 9) { //If the number is 0 or 10, get another number.
		number = Math.round(Math.random()*10);
	}
	return number; 
}

//Returns a random number(1-9) that is not in the list given as the argument
function uniqueRand(list) {
	var number = rand();

	for(var a=0;a<list.length;a++) {
		if(list[a] == number) { //If the random number was found in the list,
			number = rand(); //get a new number,
			a=-1; //and start over again.
		}
	}
	return number;
}

/////////////////////////////////////// GUI Functions ////////////////////////////////////
//Display the given data in the said colour 
function show(data,color) {
	document.getElementById("display_area").innerHTML = data + "<br />\n";
	document.getElementById("display_area").style.color = color;
}

//Display the Vertical help line
function helpLineV(line) {
	var item = document.getElementById("lv-"+line).style;
	if(item.position == "absolute") {
		item.position = "relative";
		item.height = "10px";
	} else {   
		item.position = "absolute";
		item.height = vertical_line_height + "px";
	}
}
//Display the Horizondal Help line
function helpLineH(line) {
	var item = document.getElementById("lh-"+line).style;
	if(item.position == "absolute") {
		item.position = "relative";
		item.width = "5px";
	} else {
		item.position = "absolute";
		item.width = horizondal_line_width + "px";
	}
}

//See if the box and the box that should be checked is horizondal to each other.
function isHorizondal(box,check_in) {
	if((box == 1 || box == 2 || box == 3) & (check_in == 1 || check_in == 2 || check_in == 3)) return true;
	if((box == 4 || box == 5 || box == 6) & (check_in == 4 || check_in == 5 || check_in == 6)) return true;
	if((box == 7 || box == 8 || box == 9) & (check_in == 7 || check_in == 8 || check_in == 9)) return true;
	return false;
}

//See if the box and the box that should be checked is verical to each other.
function isVertical(box,check_in) {
	if((box == 1 || box == 4 || box == 7) & (check_in == 1 || check_in == 4 || check_in == 7)) return true;
	if((box == 2 || box == 5 || box == 8) & (check_in == 2 || check_in == 5 || check_in == 8)) return true;
	if((box == 3 || box == 6 || box == 9) & (check_in == 3 || check_in == 6 || check_in == 9)) return true;
	return false;
}

//Returns false if the 'number' given as the argument appears anywhere in the previous row or column.
//		  Full_Check is done if it is called from the hinting system - then the all the cells must be
//		  checked instead of just the ones before the current cell. 
function checkForUnique(box,cell,full_check) {
	box ++;
	cell++;

	var number = cells[box-1][cell-1].value;

	//There is nothing before 1, so we don't have to check it - unless we are doing a full check.
	if(box>1 || full_check) {
	//All the boxes we will have to check for duplicates for this box
	// 	  If it is NOT a full search, we just need to check the boxes directly above or left of this box.
	var boxes_to_check = new Array(); 
	switch (box) {
		case 1 : if(full_check) {
				 	boxes_to_check.push(2,3,4,7);
				 }
			   	 break;
		case 2 : boxes_to_check.push(1);
			   	 if(full_check) {
				 	boxes_to_check.push(3,5,8);
				 }
			   	 break;
		case 3 : boxes_to_check.push(1,2);
			   	 if(full_check) {
				 	boxes_to_check.push(6,9);
				 }
				 break;
		case 4 : boxes_to_check.push(1);
			   	 if(full_check) {
				 	boxes_to_check.push(5,6,7);
				 }
				 break;
		case 5 : boxes_to_check.push(2,4);
			   	 if(full_check) {
				 	boxes_to_check.push(6,8);
				 }
				 break;
		case 6 : boxes_to_check.push(3,4,5);
			   	 if(full_check) {
				 	boxes_to_check.push(9);
				 }
				 break;
		case 7 : boxes_to_check.push(1,4);
			   	 if(full_check) {
				 	boxes_to_check.push(8,9);
				 }
				 break;
		case 8 : boxes_to_check.push(2,5,7);
			   	 if(full_check) {
				 	boxes_to_check.push(9);
				 }
				 break;
		case 9 : boxes_to_check.push(3,6,7,8);break;
	}

	var value="",xy_coods,cell_to_check;
	next_box:
	for(var i=0;i<boxes_to_check.length;i++) {
		xy_coods = getXY(cell);
		var check_box = boxes_to_check[i];
		for(var j=1; j<=3; j++) {
			//Horizondal Checks
			if(isHorizondal(box,check_box)) {
				//Non-full checks will check only the cells before them - will not check all the cells. 
				if(!full_check) {
					if(box==1 || box==4 || box==7) continue next_box;
					else if(box==5 && check_box==6) continue next_box;
					else if(box==8 && check_box==9) continue next_box;
				}
				//Check the data for redundency here.
				cell_to_check = getIndex(j,xy_coods[1]);
				value = cells[(check_box-1)][cell_to_check-1].value;
										
				if(value == number) {
					repeated_at = "c" + check_box + cell_to_check;//Get the id of the cells that matched
					return false; //There is number repeatation - return with error.
				}

			//Verical Checks
			} else {
				if(!full_check) {
					if(box<4) continue;
					else if(box==4 && check_box==7) continue next_box;
					else if(box==5 && check_box==8) continue next_box;
					else if(box==6 && check_box==9) continue next_box;
				}
 				//Check the data for redundency here.
 				cell_to_check = getIndex(xy_coods[0],j);
 				value = cells[check_box-1][cell_to_check-1].value;
 				
 				if(value == number) {
 					repeated_at = "c" + check_box + cell_to_check;//Get the id of the cells that matched
 					return false; //There is number repeatation - return with error.
 				}
			}
		}
	}
	}

	//Check within the box
	for(var k=0;k<9;k++) {
		var val = cells[box-1][k].value;
		if(number == val && (k+1 != cell)) { //If the nubmer is found at some other cell
			repeated_at = "c"+box+(k+1);
			return false;
		}
	}

	return true;
}

//Insert the value given as the 'value' argument into the entry by the id of 'id'
function insert(id,value) {
	var ele = document.getElementById(id);
	ele.style.color="";
	ele.value = value
	if(value)
		ele.disabled = true; //Make it uneditable
	else 
		ele.disabled = false; //Make the fomerly uneditable cells editable
}

//Clear all the fields - and enable all the disabled cells
function clearer() {
	var id = ""
	document.f.reset(); //Clear the fields
	for(var i=0; i<9; i++) {
		for(var j=0; j<9; j++) {
			cells[i][j].disabled = false;
		}
	}

}
//Change the background color of cells to white
function discolorCells(cell1,cell2) {
	document.getElementById(cell1).style.background = "#fff";
	if(cell2) document.getElementById(cell2).style.background = "#fff";
}

//Records the values of all box and cells by coping all values to the 'xy' array.
function recordPosition() {
	var value=0;
	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			value = cells[a][b].value;
			if(!isNaN(value) && value.length==1) {
				xy[a][b] = value;
			} else {
				xy[a][b] = 0;
			}
		}
	}
}

//Convert the current position to a string that we can save and use latter on. This function will create a 
//	finger print for this game and will save that as a Cookie. The finger print will have two types of data...
//		Number(1-9) - The number for that cell. If the number is 3, a 3 digit will be entered there.
//		Aphabet(a-z)- The number of empty cells that must be left before the next number is inserted.
//Argument : Action - 1 = Record the game to a database. 
//					- 0 = Just get the fingerprint of the game and return it 
function pos2str(action) {
	var str = "";
	var zero_count = 0;
	var alpha = " abcdefghijklmnopqrstuvwxyz";

	if(action) {
		recordPosition(); //Get the position in the array
	}

	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			if(xy[a][b]) {
				if(zero_count) {
					str += alpha.charAt(zero_count); //Include the number of continous zeros - a means 1 zero, b means 2 etc.
					zero_count = 0;
				}
				str += xy[a][b];
			} else {
				zero_count++; //Count the empty places
			}
		}
	}

	return str;
}

//Convert the given string to a position that can be displayed on the board 
//Argument : str 	- FINGERPRINT = Use this fingerprint to create the game. 
function str2pos(str) {
	var zero_flag = 0;
	var alpha = "abcdefghijklmnopqrstuvwxyz";
	var pos = 0;
	//The id of the current cell will be calculated form these varabales. 
	var a = 0;
	var b = 0;
	str = str.replace(/\./g,"");

	while(a<9) {
		ch = str.charAt(pos);
		id = "c" + (a+1) + (b+1);

		if(!isNaN(ch) && !zero_flag) {
			insert(id,ch);
		} else if(zero_flag) {
			insert(id,"");
			zero_flag--;
		} else {
			insert(id,"");
			zero_flag = alpha.indexOf(ch);
		}

		//Get next number if the zero flag is not up
		if(!zero_flag) {
			pos++;
		}

		//Update the positions
		b++;
		if(b>=9) {
			b=0;
			a++;
		}
	}
}

//Create a string we will put into the cookie - a little different for the pos2str()
//		- This format will have the values of all cells sperated by a ';' char. The provided 
//			numbers will be prefixed with a dot like - '.5'
function makeCookieString() {
	var str = "";
	var puzzle_cells = new Array(0);

	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			value = cells[a][b].value;
			if(cells[a][b].disabled) {
				value = "."+value;
			}
			puzzle_cells.push(value);
		}
	}
	str = puzzle_cells.join(';');

	return str;
}

//This function is called when the user changes the value of a cell.
//	   :EVENT: called by the onchange Event 
function checkCell(e) {
	var cell = findTarget(e);
	var val = cell.value;
	if(val<1 || val>9 || isNaN(val)) { //Some error in this cell
		tagProblemCell(cell,1);
		if(val.length > 1) { //If mulitple numbers are given, make the font smaller.
			cell.className += " possibilities-entry";
		}
		return 0;
	} else {
		if(cell.className.indexOf("possibilities-entry")) { //Make the font bigger if it was small.
			cell.className = cell.className.replace(/ possibilities\-entry/g,"");
			cell.className = cell.className.replace(/ problem\-cell/g,"");
			cell.style.color = "#000";
		}
		if($("live-hints").checked) {
			var id = cell.id;
			var a =  Number(id.charAt(1)) - 1;
			var b =  Number(id.charAt(2)) - 1;
		
			if(!checkForUnique(a,b,true)) {
				cell.style.background = "red"; //Repated number found here.
				$(repeated_at).style.background = "red"; //and here.
				setTimeout("discolorCells('"+repeated_at+"','"+id+"')",2000);//Change the background back to white after 2 secs
				//setTimeout("makeProblemCell('"+id+"')",2000);
				return 0;
			}
		}
	}
	tagProblemCell(cell,0);
	return 1;
}
function makeProblemCell(id) {
	$(id).className += " problem-cell";
}
//Tags the given cell as having problem or not.
function tagProblemCell(cell,on) {
	var current_classes = cell.className.toString();
	var have_problem = 0;
	if(current_classes.indexOf("problem-cell") >= 0) have_problem = 1;
	if(on) {
		if(!have_problem) cell.className += " problem-cell";
	} else {
		if(have_problem) cell.className = current_classes.replace(" problem-cell","");
	}
}

////////////////////////////////////// Functions Called from GUI ///////////////////////////////// 
//Save the Cookie Format string created with the makeCookieString() function to a cookie
function save() {
	var str = makeCookieString();
	setCookie("sudoku_fingerprint",str);
	alert("Game saved.");
}
//Load the game from the cookie string
function load() {
	//Clear the previous data
	clearer();

	//Get the game fingerprint from the Cookie.
	var str = getCookie("sudoku_fingerprint");
	if(str == "" || str == null) {
		alert("No saved games found!")
		return false;
	}

	compleated = 0;
	var index = 0;
	var puzzle_cells = str.split(";");
	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			number = puzzle_cells[index];
			if(number.charAt(0) == ".") { //If there is a '.' char, it ia a provided number
				number = number.charAt(1);
				cells[a][b].disabled = true;
			}

			cells[a][b].value = number;
			index++;
		}
	}
}

////////////////////////////////// Timer Functions ////////////////////////////
//Show the timer for the game.
function timer() {
	if(!timer_seconds) timer_seconds = 0;
	timer_seconds++;

	var secs = timer_seconds % 60;
	var mins = Math.floor(timer_seconds/60);
	if(secs<10) secs = "0" + secs;
	if(mins<10) mins = "0" + mins;  

	timer_element.innerHTML = mins + ":" + secs;
	timer_clock = window.setTimeout("timer()",1000);
}
//Stop the timer
function stopTimer() {
	if(timer_clock) clearTimeout(timer_clock);
}
//This will pause the timer if it is not paused, and will up-pause it if it was paused.
function toggleTimer() {
	if(!timer_paused) { //Stop Time
		clearTimeout(timer_clock);
		timer_element.style.color = "#f00";
		$("timer_control").value = "Continue";
		timer_paused = 1;
		
		//Make the users unable to edit the puzzle in the pause mode.
		var edit_mask = $("pause-hider");
		edit_mask.style.display="block";
		
		//Find Time...
		if(!timer_seconds) timer_seconds = 0;

		var secs = timer_seconds % 60;
		var mins = Math.floor(timer_seconds/60);
		if(secs<10) secs = "0" + secs;
		if(mins<10) mins = "0" + mins;  
	
		//Make the text in the Edit Mask.
		edit_mask.innerHTML = "<br /><strong>Game Paused at "+mins+":"+secs+"</strong><br /><br />" +
			"<a onclick='toggleTimer()' style='cursor:hand;'>Click to Continue...</a>";
		
	} else { //UnPause the clock
		$("timer_control").value = "Pause";
		timer_element.style.color = "#000";
		timer_paused = 0;
		timer();
		
		//Remove the edit mask
		var edit_mask = $("pause-hider");
		edit_mask.style.display="none";
	}
}

//Check all the Rows/Cols for a repeated number
function checker() {
	var found = 0;
	
	show("Checking game...","#a84efa");
	loop:
	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			var ele = cells[a][b];
			var id = "c" + (a+1) + (b+1);
			var value = ele.value
			if(isNaN(value) || value<1 || value>9) {
				if(value == "") {
					show("Empty cells found.","#d78601");
				} else {
					show("Invalid entries found.","#d78601");
				}
				found = 1;

				ele.style.background = "red"; //Problem Cells found here.
				setTimeout("discolorCells('"+id+"')",2000);

				break loop;
			}
			else if(value) {
				if(!checkForUnique(a,b,false)) {
					ele.style.background = "red"; //Repated number found here.
					document.getElementById(repeated_at).style.background = "red"; //and here.

					show("Repeated numbers were found.","#d78601");
					setTimeout("discolorCells('"+repeated_at+"','"+id+"')",2000);//Change background back to white after 2 secs
					found++;
					break loop;
				}
			} else {
				show("Empty cells were found. Please complete the puzzle.","#d78601");
				ele.style.background = "red"; //Empty
				setTimeout("discolorCells('"+id+"')",2000);
				found = 1;
				break loop;
			}  
		}
	}

	if(!found) {
		if(compleated)
			alert("Sorry - you can't win after giving up. But it is solved.");
		else
			alert("Congratulations - You have completed the puzzle.");

		stopTimer();
		show("Game Over","#000000"); 
	}
}

//Clear all the unwanted cells.
function reloadGame() {
	str2pos(orginal_game); //Use that to rebuild the game
}

//Solve the game
function solve() {
	show("Finding the solution to the game...");
	if(confirm("This will automaticaly solve the puzzle for you.\nAre you sure you want to do this?\n")) {
		str2pos(this_puzzle);
		compleated = 1;
		show("Solved the puzzle.");
		stopTimer();
	}
}

//This is called when the 'How am I doing' Button is clicked. Sees if any repetition is made
//	   and reports back to the user how many more cells must be filled.
function checkStatus() {
	var invalid_cells = 0;
	var empty_cells = 0;
	for(var a=0;a<9;a++) {
		for(var b=0;b<9;b++) {
			var ele = cells[a][b];
			var value = ele.value
			//Find the Invalid cells. 
			if(isNaN(value) || value<1 || value>9) {
				if(value == "") {
					empty_cells ++;
				} else {
					invalid_cells ++;
				}
			}
			//Valid items.
			else if(value) {
				if(!checkForUnique(a,b,true)) {
					ele.style.background = "red"; //Repated number found here.
					var id = "c" + (a+1) + (b+1);
					$(repeated_at).style.background = "red"; //and here.
					setTimeout("discolorCells('"+repeated_at+"','"+id+"')",2000);//Change background back to white after 2 secs
					return;
				}
			} else {
				empty_cells ++;
			}  
		}
	}
	//Show the results on the screen
	show("You are doing fine so far. You have "+(invalid_cells+empty_cells) + " more cells to fill.","#006600");
	fadeColor("display_area","#ffff00","#ffffff",30,100,"b");
}

////////////////////////////// Pen Based Gaming ///////////////////////////
var pen_selected_digit = 1;
//A cell was clicked - just inserted the selected number into it.
//		 :EVENT: Called on the onclick event after the pen is picked
function putSelectedDigit(e) {
	var cell = findTarget(e);
	cell.value = pen_selected_digit;
	checkCell();
	cell.blur();
}
//Watch the keypresses - if it is a 1-9 digit, use that number as the pen picked number
//		:EVENT: called on the onkeypress event.
function monitorKeyboard(e) {
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	var character = String.fromCharCode(code);

	//If the pressed key IS a number
	if(!isNaN(character)) {
		var number = Number(character);
		if(number) pickPenDigit(number);
	}
}
//Pick up the pen. Now when the user clicks on a cell the chosen digit will be inserted there.
function pickPen() {
	for(var i=0;i<9;i++) {
		for(var j=0;j<9;j++) {
			var this_cell = cells[i][j];
			if(this_cell.className.indexOf("pen-picked") == -1) this_cell.className+= " pen-picked";//Change the cursor
			addEvent(this_cell,"click",putSelectedDigit); //Attach a click event to all the cells 
		}
	}
	addEvent(document,"keypress",monitorKeyboard);
	$("pen-picks").style.display="inline";
}
//Drop the pen - restore manual editing capability. 
function downPen() {
	for(var i=0;i<9;i++) {
		for(var j=0;j<9;j++) {
			var this_cell = cells[i][j];
			if(this_cell.className) {
				var classes = this_cell.className.toString();
				this_cell.className = classes.replace(/pen\-picked/g,"");
			}
			removeEvent(this_cell,"click",putSelectedDigit);
		}
	}
	removeEvent(document,"keypress",monitorKeyboard);
	$("pen-picks").style.display="none";
}
//If the user clicks on any rumber in the keypad, make it the pen digit.
function pickPenDigit(number) {
	pen_selected_digit = number;
	$("selected-pen-number").firstChild.nodeValue = number; 
}
////////////////////////////// Cheats ////////////////////////////
//		:EVENT: Happens on the onclick event for all cells at all times.
function cellClicked(e) {
	selected_cell = findTarget(e);
}
//Show the number of the selected cell.
function revealCell() {
	if(!selected_cell) return;
 
	var str = this_puzzle.replace(/\./g,"");//Remove the '.' in the active puzzle.
	var c_xy = selected_cell.id.split(""); //The id will be split - if the id is 'c13' the resulting array will be c,1,3
	var box = c_xy[1]-1;
	var cell= c_xy[2]-1;
	var rest = str.substr(box*9);//Remove the numbers of all the boxes before it.
	var number = rest.charAt(cell); //Now get the cell.
	selected_cell.value = number;

	fadeColor(selected_cell.id,"#ffffff","#000000",10,100,"c");
}

//This will make new puzzles but replacing all numbers in a base game with other numbers - in effect creating
//	a entirely new game. This function is sneaky - Big Time
function makeNewOrder(str) {
	//Inits
	var alpha = " abcdefghijklmnopqrstuvwxyz";
	var new_order = "";

	//Get random numbers for all alphas - and store it in a array.
	numbers = new Array("0");
	for(j=0;j<9;j++) {
		new_numbers = uniqueRand(numbers); //Give random position for the numbers
		numbers.push(new_numbers);
	}

	//Now change all the alphas back to numbers - with new digits
	for(i=0;i<str.length;i++) {
		if(str.charAt(i)=="." || str.charAt(i)=="*" || str.charAt(i)=="x" || 
				str.charAt(i)=="_" || str.charAt(i)=="-" || str.charAt(i)=="+") { //It is a special char
			new_order += "."
		} else {
			new_order += numbers[alpha.indexOf(str.charAt(i))]
		}
	}

	return new_order;
}

//Creates the puzzle
function newGame() {
	chosen = Math.floor((Math.random()*10) / (10/puzzles.length)); //'chosen' puzzle should be random
	this_puzzle = makeNewOrder(puzzles[chosen]);
	show("");//Clear the display area.
	
	//Clear the existing numbers first
	compleated = 0;
	clearer();

	var last_box_ended_at = 0;
	var extra_number_count = 0;
	
	default_number_per_box = $("difficulty").value;
 
	for(var i=0;i<9;i++) {
		//Initialisations
		var b=0,location_of_fixed_number=0;
		var arr_b = new Array();

		//Get the numbers for this box from the 'this_puzzle' varaible
		var limit = 9;
		var this_box = "";
		var dot_count = 0;
		for(var j=last_box_ended_at; j<last_box_ended_at+limit; j++) {
			if(this_puzzle.charAt(j) == ".") {
				limit++;
				dot_count++;
			}
			this_box = this_box + this_puzzle.charAt(j);
		}
		last_box_ended_at = last_box_ended_at + limit;

		//Decide how much numbers must appear in this box
		number_of_numbers = default_number_per_box - extra_number_count;
		extra_number_count = 0;

		// 'extra_number_count' is used for reducing the number of populated cells in the next box if 
		//		the current box has more than 4 numbers.

		//If the number of dots are more than 4, use it
		if (dot_count > number_of_numbers) {
			if(rand() > 5) {
				extra_number_count = dot_count - number_of_numbers;
			} 
			number_of_numbers = dot_count;
		}

		//Empty the array.
		arr_b = new Array();
		//Get the positions in the box and insert the numbers there
		for(b=0;b<number_of_numbers;b++) {
			location_of_fixed_number = this_box.indexOf(".");

			if(location_of_fixed_number + 1) {//If there are dots...
				//Remove this dot
				this_box =  this_box.substring(0,location_of_fixed_number) +
							this_box.substring(location_of_fixed_number+1,this_box.length);
			
			} else { //No more dots - get some random locations
				location_of_fixed_number = uniqueRand(arr_b); //Give random position for the numbers
				location_of_fixed_number--;//uniqueRand gives 1-9. We need it from 0
			}

			arr_b.push(location_of_fixed_number+1);//Put the number into the don't repeat array

			//Get the numbers that should be inserted
			insertion_number = this_box.charAt(location_of_fixed_number);

			location_of_fixed_number++;//We need this to start from 1 - not from 0

			id = "c" + (i+1) + location_of_fixed_number

			insert(id,insertion_number); //Show the numbers
		}
	}
	orginal_game = pos2str(2);//Save the game before beginning - for restarting the puzzle

	//Initialize the timer.
	stopTimer();
	timer_seconds = 0;
	$("timer").innerHTML="00:00";

	//Start the timer
	timer();
	timer_started = 1;
}

function init() {
	//First get the references of all the cells
	var cell_ref; 
	for(var i=1;i<=9;i++) {
		for(var j=1;j<=9;j++) {
			cell_ref = document.getElementById("c"+i+j);
			addEvent(cell_ref,"change",checkCell);//Call the checkCell() function when the user changes the value of a cell.
			addEvent(cell_ref,"click",cellClicked);
			cells[i-1][j-1] = cell_ref;// :OPTIMIZATION:
		}
	}
	//Load last selected stylesheet.
	var new_style_sheet = getCookie("sudoku_options_stylesheet");
	if($(new_style_sheet)) {
		$(active_stylesheet).disabled=true;
		active_stylesheet = new_style_sheet;
		$(active_stylesheet).disabled=false;
		$("style-selector").value = new_style_sheet;
	}

	var hinting = getCookie("sudoku_options_live_hint");
	if(hinting) {
		$("live-hints").checked = hinting; 
	}
	timer_element = $("timer");

	newGame();
}
//Saves the chosen options when the user leaves the page.
function exit() {
	setCookie("sudoku_options_stylesheet",active_stylesheet);
	if($("live-hints").checked) {
		setCookie("sudoku_options_live_hint",true);
	} else {
	  	setCookie("sudoku_options_live_hint",false);
	}
}
window.onload=init;
window.onunload=exit;
