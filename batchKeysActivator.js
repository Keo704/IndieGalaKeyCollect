// ==UserScript==
// @name         Batch Keys Activator
// @namespace   http://tampermonkey.net/
// @version      1.0.2
// @description  Activate a bunch of keys at once
// @author       Lite_OnE, Delite
// @match        https://store.steampowered.com/account/registerkey*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

var Keys = [],
    KeysAmount = 0;

function RegisterSuccess(Result){
	 $('#error_display').append('<br>' +  'Successfully activated ' + Result.purchase_receipt_info.line_items[0].line_item_description );

}
function RegisterFailure(ePurchaseResult, receipt){
    var sErrorMessage = 'An unexpected error has occurred.  Your product code has not been redeemed.  Please wait 30 minutes and try redeeming the code again.  If the problem persists, please contact <a href="https://help.steampowered.com/en/wizard/HelpWithCDKey">Steam Support</a> for further assistance.';

	switch ( ePurchaseResult )
	{
		case 14:
			sErrorMessage = 'Invalid Product Key.';
			break;

		case 15:
			sErrorMessage = 'Duplicate Product Key. ( %1$s )'.replace( /\%1\$s/, GetGameNameForFailure( receipt ) );
			break;

		case 53:
			sErrorMessage = 'Too many activation attempts (Rate limited).';
			break;

		case 13:
			sErrorMessage = 'Sorry, but %1$s is not available for purchase in this country. Your product key has not been redeemed.'.replace( /\%1\$s/, GetGameNameForFailure( receipt ) );
			break;

		case 9:
			sErrorMessage = 'Already owned ( %1$s )'.replace( /\%1\$s/, GetGameNameForFailure( receipt ) );
			break;

		case 24:
			sErrorMessage = 'The ownership of another product is required prior to activating this code.';
			break;

		case 36:
			sErrorMessage = 'The product code you have entered requires that you first play %1$s on the PlayStation?3 system before it can be registered.\n\nPlease:\n\n- Start %1$s on your PlayStation?3 system\n\n- Link your Steam account to your PlayStation?3 Network account\n\n- Connect to Steam while playing %1$s on the PlayStation?3 system\n\n- Register this product code through Steam.'.replace( /\%1\$s/g, GetGameNameForFailure( receipt ) );
			break;

		case 50:
			sErrorMessage = 'Steam Wallet code; should be redeemed on the wallet code redemption page.';
			break;

		case 4:
		default:
			sErrorMessage = 'An unexpected error has occurred.  Your product code has not been redeemed.';
			break;
	}
	
		 $('#error_display').append('<br>' + 'Failed to activate: ' + sErrorMessage );
}

function ActivateKey(i){
    $.post('https://store.steampowered.com/account/ajaxregisterkey/',
		{
			product_key : Keys[i],
			sessionid : g_sessionID
		}).done(function(Result){
				if ( Result !== null )
                {
                    if ( Result.success == 1 )
			{
				RegisterSuccess( Result );
			}
			else if ( Result.purchase_result_details !== undefined && Result.purchase_receipt_info !== undefined)
			{
				RegisterFailure( Result.purchase_result_details, Result.purchase_receipt_info );
			}
                    else
                    {
                        RegisterFailure(0, null);
                    }

		    console.log(i);
                    if(i < KeysAmount && i+1 != KeysAmount){
                        ActivateKey(i + 1);
                    }
                    else{
                         $('#error_display').append('<br>' +  'Done.' );
						 $('#error_display').css('background-color', 'rgba(53, 142, 255, 0.3)');
						 
		        return;
                    }
				}
			}).fail(function(){RegisterFailure(0, null);});
}


unsafeWindow.InitKeysRegistration = function(){
    if($('#product_key').val() != ""){
        Keys = $('#product_key').val().split('\n');
        KeysAmount = Keys.length;
        ActivateKey(0);
        $('#error_display').css('display', 'inherit');
        $('#error_display').text('Processing...');
    }else{
$('#error_display').css('display', 'inherit');
$('#error_display').text('You must input at least one key.');
    }
};

 $(document).ready(function(){

     var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}
$('#product_key').replaceWith($('<textarea id="product_key" type="text" class="registerkey_input_box_text" value="">'));
$("#product_key").html($_GET.key);
$('textarea').css('min-width', '500px');
$('textarea').css('min-height', '50px');
$('#register_btn').attr('href','javascript:InitKeysRegistration();');
$('#error_display').css('white-space', 'pre');
$('#error_display').css('transition', '1s ease');
$('#error_display').css('background-color', 'rgba(255, 255, 255, 0.3)');
});