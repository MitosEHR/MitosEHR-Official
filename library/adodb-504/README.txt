
Now compatible with PHP5 and PHP4.

Links
=====
D'load: http://adodb.sourceforge.net/
Forum:  http://phplens.com/lens/lensforum/topics.php?id=4



The ADODB Extension
===================

This extension requires the ADOdb classes to be used for data 
access. When ADOdb detects the constant ADODB_EXTENSION is set, 
it will use the extension to perform the following speedups:

1. Emulation of recordcount is substantially faster. Up to 75%
   faster for oracle oci8 for example. This does not help
   mysql or postgresql as both databases support native record-
   count.

   Recordcount emulation occurs for every SELECT statement when
   $ADODB_COUNTRECS = true, so Oracle, Sybase, Informix,
   MSSQL, Access, and many ODBC/ADO database drivers will get
   a big boost in speed.

2. The $rs->Move($offset) function is faster for databases that
   do not provide a native seek function on the recordset.

3. $rs->GetArray() will use the highly optimized adodb_getall()
   function.


You can directly call adodb extension functions:


1. function adodb_getall($rs)

Returns a 2D array containing all records in recordset from
current record position.


2. function adodb_movenext($rs)

Equivalent to $rs->MoveNext().


The constant ADODB_EXTENSION will contain the version number
of the extension, which should be 3.32 or later.

3.32 Initial Release
4.00 Recompiled without debugging (oops!).



LICENSE
=======
BSD-style. (c) 2003-2005 John Lim. All rights reserved.


TESTS
=====

I have stress tested this with

ab -n1000 -c20 http://server/php/test-adodb.php 

with satisfactory results. The test php file is included in
this release.


WINDOWS
=======
This release should come with a pre-compiled version of adodb.
See the appropriate php-win-$version directory for php_adodb.dll.
You will need to copy it to your extension directory and modify
php.ini.

For PHP4, add to php.ini:

 extension=php_adodb.dll  

For PHP5, add to php.ini:

 extension=adodb.dll

If you have Visual C++ 6.0, you can open the project file
adodb.dsp and compile adodb yourself on windows. Use the 
Release_TS version.


UNIX
====
To compile under *NIX as an .so extension

1. Go to adodb directory


2. Run phpize from the command-line (the $ is the prompt). If
phpize is missing, then you probably do not have the development
version of php installed. Download and install php from php.net.
Then the following should work:

 $ phpize

   This will create the appropriate configuration files.


3. You might get some warning messages to run aclocal.
   I'm not sure about this, so run aclocal anyway.  


4. Now run configure with 

 $ ./configure


5. Then compile files to create ./modules/adodb.so

 $ make


6. Then install in extensions directory with

 $ make install


7. You can either dynamicly load with 

   dl('adodb.so');

  or add it to your php.ini with

   extension=adodb.so


8. Have a look at the test scripts to see what you can do
   with the adodb extension.
