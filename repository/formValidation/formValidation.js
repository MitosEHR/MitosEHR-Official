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
  }, empty_3chrText: 'This field must have one word and not empty.',

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
  }, dateValText: 'Incorrect date format (YYYY-MM-DD).'
  
});
