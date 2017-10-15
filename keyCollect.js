// ==UserScript==
// @name         Indie Gala key collect
// @namespace    Cae
// @version      0.4
// @description  garbage
// @author       Cae
// @match        https://www.indiegala.com/gift?gift_id=*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at 		 document-load
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

function igfCollectKeys(){
    var url = "http://store.steampowered.com/dynamicstore/userdata/";
    var jsonFile;
    var newGames = [];
    var ownedGames = [];
    var ownedCount = 0;
    var newCount = 0;
	
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: 5000,
        onload: function(response) {
			json = JSON.parse(response.responseText);
			ownedApps = json.rgOwnedApps;
			
			$(".game-key-string").each(function() {
				var key = $(this).find($('input[type=text]'));
				key = key.val();
				var url = $(this).find($('.game-steam-url'));
				var name = url.text();
				url = url.attr('href');
				var matches = url.match("store.steampowered.com/app/(.*)/");
				try{
					if ($.inArray(Number(matches[1]), ownedApps) == -1)
					{
						newGames.push({ name: name, key: key });
						newCount++;
					}
					else{
						ownedGames.push({ name: name, key: key });
						ownedCount++;
					}
				}
				catch (err) {
					newGames.push({ name: name, key: key });
					newCount++;
				}
			}
			);
			
			function createTableRow(name, key, table){
				var tr = document.createElement('tr');
				tr.appendChild( document.createElement('td') );
				tr.appendChild( document.createElement('td') );
				tr.cells[0].appendChild( document.createTextNode(name) );
				tr.cells[1].appendChild( document.createTextNode(key) );
				table.appendChild(tr);
			}
			
			$("#newGameTable").remove();
			$("#ownedGameTable").remove();
			$("#headerTable").remove();
			table0 = document.createElement('table');
			table0.setAttribute("id", "headerTable");
			table1 = document.createElement('table');
			table1.setAttribute("id", "newGameTable");
			
			table2 = document.createElement('table');
			table2.setAttribute("id", "ownedGameTable");
			createTableRow("bundle name", window.location.href, table0);
			
			
			for (var i = 0; i < newGames.length; i++) {
				createTableRow(newGames[i].key, newGames[i].name, table1);
			}
			for (var i = 0; i < ownedGames.length; i++) {
				createTableRow(ownedGames[i].key, ownedGames[i].name, table2);
			}
			
			$("#this_your_gift").prepend(table1);
			$("#this_your_gift").prepend(table2);
			$("#this_your_gift").prepend(table0);
			$("#newGameTable").css('background-color','lightgreen');
			$("#ownedGameTable").css('background-color','white');
		}});
}



$(".title_box_gift").append("<input type='button' class='button export-keys' value='Collect Keys'>");
$(".export-keys").click(igfCollectKeys);






