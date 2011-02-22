/*
	ADOdb Extension for PHP
	  
	(c) 2003-2005 John Lim. All rights reserved

	Licensed under BSD-style license.

	Set tabs to 4 for best viewing.


	We implement two high speed helper functions for ADOdb: 
		adodb_movenext() and adodb_getall()

	Usage:

		$rs = $db->Execute($sql);
		while (!$rs->EOF) {
		  print_r($rs->fields);
		  adodb_movenext($rs); # this is 100% C code!
		}
		$rs = $db->Execute($sql);
		$array2d = adodb_getall($rs); # more vitamin C
  

	This code requires ADOdb 3.30 or higher. We replace
	_fetch for mysql, oci8 and postgresql with our own
	C implementations.
  
  
	CHANGELOG

	5.04
	Fixed problem with mysqli

	5.03
	Added support for PHP 4.4 and 5.1. Added thread safety to adodb_compile_params(). 
	Means that this dll was not thread-safe previously for PHP 5 :-(

	5.02 
	Added support for PHP 5.0.3

	5.00 24 July 2004
	Added php5 compat.

	4.00 16 Nov 2003
	Added more constant definitions

	3.32 18 March 2002
	Stack corruption bug in adodb_movenext fixed.

	3.31 
	First release

  NOTES

#define IS_NULL		0
#define IS_LONG		1
#define IS_DOUBLE	2
#define IS_STRING	3
#define IS_ARRAY	4
#define IS_OBJECT	5
#define IS_BOOL		6
#define IS_RESOURCE	7
#define IS_CONSTANT	8
#define IS_CONSTANT_ARRAY	9
*/

#define ADODB_MAXPARAMS 8
	#define COMPILE_DL_ADODB 1

#ifdef WIN32
	#define ZEND_DEBUG 0
	#define ZTS 1
	#define ZEND_WIN32 1
	#define PHP_WIN32 1
#endif


#include "php.h" 
#include "ext/standard/info.h"

/*
	define('ADODB_FETCH_DEFAULT',0);
	define('ADODB_FETCH_NUM',1);
	define('ADODB_FETCH_ASSOC',2);
	define('ADODB_FETCH_BOTH',3);
*/

#define ADODB_EXTENSION 5.04


/* All the functions that will be exported (available) must be declared */ 
ZEND_FUNCTION(adodb_movenext); 
ZEND_FUNCTION(adodb_getall); 
PHP_MINFO_FUNCTION(adodb); 
PHP_MINIT_FUNCTION(adodb);

#if defined(BYREF_FORCE)
/* PHP 4 */
unsigned char adodb_byref[] = {1,BYREF_FORCE};

/* function list so that the Zend engine will know whats here */ 
zend_function_entry 
adodb_functions[] = { 
	ZEND_FE(adodb_movenext, adodb_byref) 
	ZEND_FE(adodb_getall, adodb_byref) 
	{NULL, NULL, NULL} 
}; 
#else
/* PHP 5 */
function_entry adodb_functions[] = {
   	PHP_FE(adodb_movenext,NULL) 
	PHP_FE(adodb_getall,NULL)   
	{NULL, NULL, NULL} 
}; 
#endif

/* module information */ 
zend_module_entry adodb_module_entry = { 
	STANDARD_MODULE_HEADER, "ADOdb", 
		adodb_functions, 
		PHP_MINIT(adodb), 
		NULL,
		NULL, 
		NULL, 
		PHP_MINFO(adodb), 
		NO_VERSION_YET, 
		STANDARD_MODULE_PROPERTIES 
}; 

#if COMPILE_DL_ADODB 
	ZEND_GET_MODULE(adodb) 
#endif 

PHP_MINFO_FUNCTION(adodb) 
{ 
	char vers[32]; 
	sprintf(vers,"%4.2f", (float) ADODB_EXTENSION);
	php_info_print_table_start(); 
	php_info_print_table_row(2, "Info", "Extension requires ADOdb classes"); 
	php_info_print_table_row(2, "Download", "http://php.weblogs.com/adodb"); 
	php_info_print_table_row(2, "API Version", vers); 
	php_info_print_table_end(); 
} 



#define REGISTER_DBL_CONSTANT(__c) REGISTER_DOUBLE_CONSTANT(#__c, __c, CONST_CS | CONST_PERSISTENT)
#define REGISTER_LNG_CONSTANT(__c) REGISTER_LONG_CONSTANT(#__c, __c, CONST_CS | CONST_PERSISTENT)
#define REGISTER_STR_CONSTANT(__c) REGISTER_STRING_CONSTANT(#__c, __c, CONST_CS | CONST_PERSISTENT)


static zval adodb_zvals[5];

#define zval_fetch 0
#define zval_ocifetch 1
#define zval_mysqlfetch 2
#define zval_pgfetch 3

static void adodb_init_zval(zval *v, char *s)
{
	v->type = IS_STRING;
	v->value.str.val = s;
	v->value.str.len = strlen(s);
	v->is_ref = 0;
	v->refcount = 1;
}

/* {{{ PHP_MINIT_FUNCTION
 */
PHP_MINIT_FUNCTION(adodb)
{
long ADODB_PHPVER;
int a,b,c;

a = sizeof(zval);

	sscanf(PHP_VERSION,"%d.%d.%d",&a,&b,&c);
	ADODB_PHPVER = (a << 12) & 0xffff;
	ADODB_PHPVER += (b << 8) & 0xfff;
	ADODB_PHPVER += (c << 4) & 0xff;
	REGISTER_DBL_CONSTANT(ADODB_EXTENSION);

#define ADODB_FETCH_DEFAULT 0
#define ADODB_FETCH_NUM   1
#define ADODB_FETCH_ASSOC 2
#define ADODB_FETCH_BOTH  3
#define TIMESTAMP_FIRST_YEAR 100
#define ADODB_PREFETCH_ROWS 10
	

	REGISTER_LNG_CONSTANT(ADODB_FETCH_DEFAULT);
	REGISTER_LNG_CONSTANT(ADODB_FETCH_NUM);
	REGISTER_LNG_CONSTANT(ADODB_FETCH_ASSOC);
	REGISTER_LNG_CONSTANT(ADODB_FETCH_BOTH);
	REGISTER_LNG_CONSTANT(ADODB_PHPVER);
	REGISTER_LNG_CONSTANT(TIMESTAMP_FIRST_YEAR);
	REGISTER_LNG_CONSTANT(ADODB_PREFETCH_ROWS);
	REGISTER_STRING_CONSTANT("ADODB_TABLE_REGEX", 
			"([]0-9a-z_\\`\\.\\@\\[-]*)", 
			CONST_CS | CONST_PERSISTENT);
	REGISTER_STRING_CONSTANT("ADODB_BAD_RS", 
			"<p>Bad $rs in %s. Connection or SQL invalid. Try using $connection->debug=true;</p>", 
			CONST_CS | CONST_PERSISTENT);


	adodb_init_zval(&adodb_zvals[zval_fetch],"_fetch");
	adodb_init_zval(&adodb_zvals[zval_mysqlfetch],"mysql_fetch_array");
	adodb_init_zval(&adodb_zvals[zval_pgfetch],"pg_fetch_array");
	adodb_init_zval(&adodb_zvals[zval_ocifetch],"ocifetchinto");
	return SUCCESS;
}


/*
	Setup params to maximize speed of adodb_call_fetch.
*/
static int adodb_compile_params(char * dbType, zval **rs, zval ***params TSRMLS_DC)
{

	
	zend_hash_find(Z_OBJPROP_P(*rs), "fields", sizeof("fields"), (void **) &params[0]);
	if (params[0] == NULL) return -1;

	if (strncmp(dbType,"mysql",5) == 0 && strncmp(dbType,"mysqli",6) != 0) {
		zend_hash_find(Z_OBJPROP_P(*rs), "_queryID", sizeof("_queryID"), (void **) &params[1]);
		zend_hash_find(Z_OBJPROP_P(*rs), "fetchMode", sizeof("fetchMode"), (void **) &params[2]);
		if (params[1] == NULL || params[2] == NULL) return -1;
		
		return zval_mysqlfetch;
	}
	if (strncmp(dbType,"oci8",4) == 0) {
		
		if (strlen(dbType) == 4) {
			
			zend_hash_find(Z_OBJPROP_P(*rs), "_queryID", sizeof("_queryID"), (void **) &params[1]);
			params[2] = params[0];
			zend_hash_find(Z_OBJPROP_P(*rs), "fetchMode", sizeof("fetchMode"), (void **) &params[3]);

			if (params[1] == NULL || params[3] == NULL) return -1;
		
			return zval_ocifetch;
		} else {
			return zval_fetch;
		}
	}
	if (strncmp(dbType,"postg",5) == 0) {
		zend_hash_find(Z_OBJPROP_P(*rs), "_queryID", sizeof("_queryID"), (void **) &params[1]);
		zend_hash_find(Z_OBJPROP_P(*rs), "_currentRow", sizeof("_currentRow"), (void **) &params[2]);
		zend_hash_find(Z_OBJPROP_P(*rs), "fetchMode", sizeof("fetchMode"), (void **) &params[3]);
		zend_hash_find(Z_OBJPROP_P(*rs), "_blobArr", sizeof("_blobArr"), (void **) &params[4]);
		zend_hash_find(Z_OBJPROP_P(*rs), "_numOfRows", sizeof("_numOfRows"), (void **) &params[5]);
		
		if (params[1] == NULL || params[2] == NULL || params[3] == NULL || params[4] == NULL|| params[5] == NULL) return -1;
		if (params[4] != NULL && Z_TYPE(**params[4]) != IS_NULL) return zval_fetch; /* we need to do blob fixup, call high-level _fetch */
		return zval_pgfetch; 
	}
	return zval_fetch;

}


/*
	Fetch a single row.
	Return error flag, 0 is ok, 1 is error
*/
static long adodb_call_fetch(zval **rs, int type, zval ***params TSRMLS_DC)
{	
zval		*retval = NULL;
long		error;
unsigned long save_error_reporting;
zval		**fields;
#if !defined(BYREF_FORCE)
	zend_fcall_info fci;
	
	fci.size = sizeof(fci);
	fci.function_table = EG(function_table);
	fci.function_name = &adodb_zvals[zval_ocifetch];
	fci.symbol_table = NULL;
	fci.object_pp = NULL;
	fci.retval_ptr_ptr = &retval;
	fci.param_count = 2;
	fci.params = &params[1];
	fci.no_separation = 0;
#endif

	fields = params[0];
	
	/*
		We special case oci8, postgresql, mysql for further tuning...
	*/
	
	/*--------
		oci8
	*/
	switch(type) {
	case zval_ocifetch:
		error = call_user_function_ex(EG(function_table), 
						NULL, 
						&adodb_zvals[zval_ocifetch], 
						&retval, 3,  &params[1], 0, NULL TSRMLS_CC);

		if (error) {
		/*	convert_to_boolean_ex(fields);*/
			ZVAL_BOOL(*fields,0);
			error = 1;
		} else {
		/*	convert_to_boolean_ex(&retval);*/
			error = !Z_LVAL(*retval);
		}
		break;

	case zval_mysqlfetch:
		
		error = call_user_function_ex(EG(function_table), 
						NULL, 
						&adodb_zvals[zval_mysqlfetch], 
						&retval, 2,  &params[1], 0, NULL TSRMLS_CC);
		
		if (error) {
			convert_to_boolean_ex(fields);
			ZVAL_BOOL(*fields,0);
			error = 1;
		} else {
			zval_add_ref(&retval);
			zval_ptr_dtor(fields);
			*fields = retval;
			if (Z_TYPE(**fields) == IS_BOOL ||Z_TYPE(**fields) == IS_NULL ) error = 1;	
			else error = 0;
		}
		break;

	case zval_pgfetch:
	
		/*
			if ($this->_currentRow >= $this->_numOfRows && $this->_numOfRows >= 0)
        		return false;
		*/
		if (Z_LVAL(**params[2]) >= Z_LVAL(**params[5]) && Z_LVAL(**params[5]) >= 0) {
				error = 1;
				break;
		}
		/* pg_fetch_array gives a warning message if currentRow is out of range	*/	
		save_error_reporting = EG(error_reporting);
		EG(error_reporting) &= ~E_WARNING;
		

		error = call_user_function_ex(EG(function_table), 
						NULL, 
						&adodb_zvals[zval_pgfetch], 
						&retval, 3,  &params[1], 0, NULL TSRMLS_CC);

		EG(error_reporting) = save_error_reporting;

		if (error) {
			convert_to_boolean_ex(fields);
			ZVAL_BOOL(*fields,0);
			error = 1;
		} else {
			zval_add_ref(&retval);
			zval_ptr_dtor(fields);
			*fields = retval;
			if (Z_TYPE(**fields) == IS_BOOL) error = 1;	
			else error = 0;
		}	
		
		break;

	default:
		error = call_user_function_ex(EG(function_table), 
							rs, 
							&adodb_zvals[zval_fetch], 
							&retval, 0,  NULL, 0, NULL TSRMLS_CC);
;
		if (error == FAILURE) {	
			php_error(E_ERROR, "Unable to call _fetch\n");
			error = 1;
		} else {
			error = !Z_LVAL(*retval);
		}
		break;
	}

	/*---------
	// cleanup
	*/
	if (retval) {
		zval_ptr_dtor(&retval);
	}

	return error;
}



/*
	Fetch all records and store in returned 2-D array.

	Usage:

	$rs = $conn->Execute($sql);
	$array = adodb_getall($rs);

	Using this function, adodb benchmark was 0.73 secs vs. 1.38 secs using pure PHP.
	The more rows, the faster this will run compared to PHP code...


	Oci8 MoveNext test
	ADODB_COUNTRECS   ADODB_EXTENSION   Time (s)
	   true                false          1.99
	   true                true           1.63
	   false               false          1.38
	   false               true           1.38

	Oci8 ADOConnection::GetAll test
	   true                false          1.68
	   true                true           1.33
	   false               false          1.68
	   false               true           1.33	
*/
ZEND_FUNCTION(adodb_getall) 
{
	
zval	**rs,**maxp;		/* function parameters */
zval	**eof = NULL;		/* rs properties */
zval	**currentRow = NULL,
		**dbType = NULL, 
		**params[ADODB_MAXPARAMS];
zval	*retval = NULL;	/* return value from method */
long	error,recs = 0, max = -1;
int		argc = ZEND_NUM_ARGS();
int		type;


	if (!(0 < argc && argc <= 2)) {
		WRONG_PARAM_COUNT;
		return;
	}

	if (argc == 1) {
		if (zend_get_parameters_ex(1, &rs) == FAILURE) {
			RETVAL_FALSE;
			return;
		}

	} else if (argc == 2) {
		if (zend_get_parameters_ex(2, &rs, &maxp) == FAILURE) {
			RETVAL_FALSE;
			return;
		}
		convert_to_long_ex(maxp);
		max = Z_LVAL(**maxp);
	}
	 
	
	if (Z_TYPE(**rs) != IS_OBJECT) {
		php_error(E_ERROR, "adodb_getall: parameter 1 is not an object\n");
		RETVAL_FALSE;
		return;
	}

	zend_hash_find(Z_OBJPROP_P(*rs), "databaseType", sizeof("databaseType"), (void **)&dbType);
	if (dbType == NULL) {		
			php_error(E_WARNING,"adodb_getall: The property databaseType is undefined");
			RETVAL_FALSE;
			return;
	}
	if (max < 0 && strncmp(Z_STRVAL(**dbType),"array",5) == 0) {
	zval **array;
	/* Optimize array recordset access, as internally it is already an array */
	/* WARNING: does not support skiprow1 feature                            */
		zend_hash_find(Z_OBJPROP_P(*rs), "_array", sizeof("_array"), (void **)&array);
		if (array) {
			zval_add_ref(array);
			zval_ptr_dtor(&return_value);
			return_value = *array;
			return;
		}
	}

	/* Compile parameters so no further hash lookups required */
	type = adodb_compile_params(Z_STRVAL(**dbType),rs, (zval ***)&params TSRMLS_CC);
	if (type == -1) {
		php_error(E_WARNING,"adodb_getall: (Invalid recordset object");
		RETVAL_FALSE;
		return;
	}

	zend_hash_find(Z_OBJPROP_P(*rs), "_currentRow", sizeof("_currentRow"), (void **)&currentRow);
	zend_hash_find(Z_OBJPROP_P(*rs), "EOF", sizeof("EOF"), (void **)&eof);
	
	if (eof == NULL || currentRow == NULL) {
		php_error(E_WARNING,"adodb_getall: invalid recordset object");
		RETVAL_FALSE;
		return;
	}
	
	/*
		While not EOF, suck in the records
	*/
	array_init(return_value);	

	while (!Z_LVAL(**eof) && recs != max) {
		recs += 1;
		zval_add_ref(params[0]);
		Z_LVAL(**currentRow) += 1;
		
		/* no diffenece in speed using this:
		zend_hash_index_update(Z_ARRVAL_P(return_value), Z_LVAL(**currentRow), params[0], sizeof(zval *), NULL); 
		*/
		add_next_index_zval(return_value,*params[0]);
		
		error = adodb_call_fetch(rs, type, (zval***) &params TSRMLS_CC);
		ZVAL_BOOL(*eof,error ? 1 : 0);

	
	}

}

/*
	Move internal cursor to next record, and populate $rs->fields.

	Returns true if ok, false if error or EOF.

	Usage:

	$rs = $connection->Execute($sql);
	while (!$rs->EOF) {
		print_r($rs->fields);
		adodb_movenext($rs);
	}
	
	Timings:
	
	0.91	PHP MoveNext calls adodb_movenext internally
	--------------------------------------------------------------------
	0.89	PHP MoveNext calls original PHP code - this is the baseline
	--------------------------------------------------------------------
	0.84	adodb_movenext (no mysql_fetch_array()) --  6% speedup from baseline
	0.70	adodb_movenext with mysql_fetch_array   -- 27% speedup from baseline
	0.63	native mysql

 */

ZEND_FUNCTION(adodb_movenext) 
{ 
zval	**rs,**dbType;
zval	**eof = NULL,**currentRow = NULL, **fields = NULL;
long	error = SUCCESS;
int		argc = ZEND_NUM_ARGS();
zval   **params[ADODB_MAXPARAMS];
int		type;

	if (argc != 1) {
		WRONG_PARAM_COUNT;
		return;
	}

	if (zend_get_parameters_ex(1, &rs) == FAILURE) {
		RETVAL_FALSE;
		return;
	}

	if (Z_TYPE(**rs) != IS_OBJECT) {
		php_error(E_ERROR, "adodb_movenext: parameter 1 is not an object\n");
		RETVAL_FALSE;
		return;
	}
	

	/* EOF */
	zend_hash_find(Z_OBJPROP_P(*rs), "EOF", sizeof("EOF"), (void **)&eof);
	
	if (eof == NULL) {
		php_error(E_ERROR, "adodb_movenext: The property EOF is undefined\n");
		RETVAL_FALSE;
		return;
	}
		
	if (Z_LVAL(**eof)) {
		RETVAL_FALSE;
		return;
	}


	/* _currentRow */
	zend_hash_find(Z_OBJPROP_P(*rs), "_currentRow", sizeof("_currentRow"), (void **)&currentRow);

	if (currentRow == NULL) {
		php_error(E_ERROR, "adodb_movenext: The property _currentRow is undefined\n");
		RETVAL_FALSE;
		return;
	}

	Z_LVAL(**currentRow) += 1;

	zend_hash_find(Z_OBJPROP_P(*rs), "databaseType", sizeof("databaseType"), (void **)&dbType);
	if (dbType == NULL) {		
			php_error(E_WARNING,"adodb_movenext: The property databaseType is undefined");
			RETVAL_FALSE;
			return;
	}

	type = adodb_compile_params(Z_STRVAL(**dbType),rs, (zval ***)&params TSRMLS_CC);
	if (type == -1) {
		php_error(E_WARNING,"adodb_movenext: Invalid recordset object");
		RETVAL_FALSE;
	}

	/*
		OK, we fetch the field now...
	*/
	error = adodb_call_fetch(rs, type, (zval***)&params TSRMLS_CC);

	ZVAL_BOOL(*eof,error ? 1 : 0);

	if (Z_LVAL(**eof)) {
		RETVAL_FALSE;	
	} else {
		RETVAL_TRUE;
	}
} 


