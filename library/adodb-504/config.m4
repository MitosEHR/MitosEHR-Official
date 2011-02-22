dnl $Id$
dnl config.m4 for extension adodb

dnl Comments in this file start with the string 'dnl'.
dnl Remove where necessary. This file will not work
dnl without editing.

dnl If your extension references something external, use with:

dnl PHP_ARG_WITH(adodb, for adodb support,
dnl Make sure that the comment is aligned:
dnl [  --with-adodb             Include adodb support])

dnl Otherwise use enable:

PHP_ARG_ENABLE(adodb, whether to enable adodb support,
[  --enable-adodb           Enable adodb support])

if test "$PHP_ADODB" != "no"; then
  dnl Write more examples of tests here...

  dnl # --with-adodb -> check with-path
  dnl SEARCH_PATH="/usr/local /usr"     # you might want to change this
  dnl SEARCH_FOR="/include/adodb.h"  # you most likely want to change this
  dnl if test -r $PHP_ADODB/; then # path given as parameter
  dnl   ADODB_DIR=$PHP_ADODB
  dnl else # search default path list
  dnl   AC_MSG_CHECKING([for adodb files in default path])
  dnl   for i in $SEARCH_PATH ; do
  dnl     if test -r $i/$SEARCH_FOR; then
  dnl       ADODB_DIR=$i
  dnl       AC_MSG_RESULT(found in $i)
  dnl     fi
  dnl   done
  dnl fi
  dnl
  dnl if test -z "$ADODB_DIR"; then
  dnl   AC_MSG_RESULT([not found])
  dnl   AC_MSG_ERROR([Please reinstall the adodb distribution])
  dnl fi

  dnl # --with-adodb -> add include path
  dnl PHP_ADD_INCLUDE($ADODB_DIR/include)

  dnl # --with-adodb -> chech for lib and symbol presence
  dnl LIBNAME=adodb # you may want to change this
  dnl LIBSYMBOL=adodb # you most likely want to change this 

  dnl PHP_CHECK_LIBRARY($LIBNAME,$LIBSYMBOL,
  dnl [
  dnl   PHP_ADD_LIBRARY_WITH_PATH($LIBNAME, $ADODB_DIR/lib, ADODB_SHARED_LIBADD)
  dnl   AC_DEFINE(HAVE_ADODBLIB,1,[ ])
  dnl ],[
  dnl   AC_MSG_ERROR([wrong adodb lib version or lib not found])
  dnl ],[
  dnl   -L$ADODB_DIR/lib -lm -ldl
  dnl ])
  dnl
  dnl PHP_SUBST(ADODB_SHARED_LIBADD)

  PHP_NEW_EXTENSION(adodb, adodb.c, $ext_shared)
fi
