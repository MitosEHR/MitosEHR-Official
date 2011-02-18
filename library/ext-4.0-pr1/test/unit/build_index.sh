#!/bin/sh
echo "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"
  \"http://www.w3.org/TR/html4/loose.dtd\">
<html>
    <head>
        <title>Jasmine Test Runner - Ext4</title>
        <link rel=\"stylesheet\" type=\"text/css\" href=\"lib/resources/reporter.css\">
        <script type=\"text/javascript\" src=\"lib/src/reporter.js\"></script>
    </head>
    <body>
        <script type=\"text/javascript\">
                Test.SandBox.setup({
                    includes: [{ type: \"js\", src: \"lib/src/jasmine.js\" },"

# Add ext-core include        
cat ../../sdk.jsb3 | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{    
    path = $2 $4;
    print "                               { type: \"js\", src: \"../../" path "\" },";
 
    if (path == "platform/core/src/class/Loader.js") {
        print "                               { type: \"js\", src: \"resources/BlockLoader.js\" },";
    }

}'
rm dump.tmp

# Add ext-all includes
sed  ':a;N;$!ba;s/,\n/, /g' ../../ext-all.jsb3 | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{
    path = $4 $2;
    if (!system("test -f ../../" path))
        print "                               { type: \"js\", src: \"../../" path "\" },";
    else
        print "                               { type: \"js\", src: \"../../platform/" path "\" },";
        
}'
rm dump.tmp

echo "                               { type: \"css\", src: \"../../resources/css/ext.css\" },
                               { type: \"js\", src: \"resources/EventUtils.js\" },"

# Add specs include        
find spec -name "*.js" > dump.tmp
lastRec=`awk 'END{print NR}' dump.tmp`
awk -v aLastRec="$lastRec" '{
    if (NR == aLastRec) {
        print "                               { type: \"js\", src: \"" $0 "\" }]";
    } else {
        print "                               { type: \"js\", src: \"" $0 "\" },";
    }

}' dump.tmp

rm dump.tmp
echo "                });

        </script>
    </body>
</html>"
