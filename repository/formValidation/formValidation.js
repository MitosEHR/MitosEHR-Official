// *************************************************************************************
// Validation Object 
// Description:
// Code to validate diferent kind of fields
// ************************************************************************************* 
Ext.apply(Ext.form.VTypes, {

  // --------------------------------------- 
  // Validate Empty fields, empty field not allowed
  // Less than 3 characters will be no good
  // --------------------------------------- 
  empty_3chr : function(val, field) {
    if(val.length <= 2){ return false; } else { return true; }
  }, empty_3chrText: 'This field must have more than 3 characters and must be not empty.',

  // --------------------------------------- 
  // Validate Empty fields, empty field not allowed
  // Less than 7 characters will be no good
  // --------------------------------------- 
  empty_7chr : function(val, field) {
    if(val.length <= 6){ return false; } else { return true; }
  }, empty_7chrText: 'This field must have more than 7 characters and must be not empty.',

  // --------------------------------------- 
  // Validate Empty fields, empty field not allowed
  // --------------------------------------- 
  empty : function(val, field) {
    if(val.length <= 0){ return false; } else { return true; }
  }, emptyText: 'This field must not be empty.',
    
  // --------------------------------------- 
  // Validate Social Security Numbers fields, empty field not allowed
  // Less than 3 characters will be no good
  // --------------------------------------- 
  SSN : function(val, field) {
	var matchArr = val.match(/^(\d{3})-?\d{2}-?\d{4}$/);
	var numDashes = val.split('-').length - 1;
	if (matchArr == null || numDashes == 1) {
		return false;
	} else if (parseInt(matchArr[1],10)==0) {
		return false;
	} else {
		return true;
	}
  }, SSNText: 'Social Security Numbers, must no be empty or in the wrong format. (555-55-5555).',

  // --------------------------------------- 
  // Validate Day of Birth, empty field not allowed
  // YYYY-MM-DD
  // ---------------------------------------
  dateVal : function(val, field) {
	// String format yyyy-mm-dd
	var rgx = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
	if(!val.match(rgx)){ return false; } else { return true; }
  }, dateValText: 'Incorrect date format (YYYY-MM-DD).',

  // --------------------------------------- 
  // Validate email, empty field not allowed
  // abc@abc.com
  // ---------------------------------------  
  checkEmail : function(val, field){
	var rgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ 
 	if(!val.match(rgx)){ return false; } else { return true; }
  }, checkEmailText: 'This field should be an email address in the format user@domain.com',
  
  // ---------------------------------------
  // Validate for an IP Address format
  // ---------------------------------------
  ipaddress: function( val, field){
	var rgx = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i;
	if(!val.match(rgx)){ return false; } else { return true; }
  }, ipaddressText: 'This field should be an IP address in the format 192.168.0.1'
  
});
