#!/bin/sh
echo "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"
  \"http://www.w3.org/TR/html4/loose.dtd\">
<html>
    <head>
        <title>Jasmine Test Runner - Core + Platform + Ext4</title>
        <link rel=\"stylesheet\" type=\"text/css\" href=\"../../../testreporter/deploy/testreporter/resources/reporter.css\">
        <script type=\"text/javascript\" src=\"../../../testreporter/deploy/testreporter/reporter.js\"></script>
    </head>
    <body>
        <script type=\"text/javascript\">
                Test.SandBox.setup({
                    includes: [{ type: \"js\", src: \"../../../testreporter/deploy/testreporter/jasmine.js\" }," > index.html

# Add ext-core include        
cat ../../build/sdk.jsb3 | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{    
    path = $2 $4;
    print "                               { type: \"js\", src: \"../" path "\" },";
 
    if (path == "../../platform/core/src/class/Loader.js") {
        print "                               { type: \"js\", src: \"resources/BlockLoader.js\" },";
    }

}' >> index.html
rm dump.tmp

# Add ext-all includes
cat ../../build/ext-all.jsb3 | sed -e :a -e N -e '$!ba' -e 's/,\n/ /g' | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{
    path = $4 $2;
    print "                               { type: \"js\", src: \"../" path "\" },";
}' >> index.html
rm dump.tmp

echo "                               { type: \"css\", src: \"../../resources/css/ext-all.css\" },
                               { type: \"js\", src: \"resources/EventUtils.js\" }," >> index.html

# Add specs include        
find ../../../platform/core/test/unit/spec -name "*.js" > dump.tmp
find ../../../platform/test/unit/spec -name "*.js" >> dump.tmp
find spec -name "*.js" >> dump.tmp
lastRec=`awk 'END{print NR}' dump.tmp`
awk -v aLastRec="$lastRec" '{
    if ($0 != "../../../platform/core/test/unit/spec/env/Environment.js") {
        if (NR == aLastRec) {
            print "                               { type: \"js\", src: \"" $0 "\" }]";
        } else {
            print "                               { type: \"js\", src: \"" $0 "\" },";
        }
    }

}' dump.tmp  >> index.html

rm dump.tmp
echo "                });

        </script>
    </body>
</html>"  >> index.html

# Ext4 only
echo "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"
  \"http://www.w3.org/TR/html4/loose.dtd\">
<html>
    <head>
        <title>Jasmine Test Runner - Ext4</title>
        <link rel=\"stylesheet\" type=\"text/css\" href=\"../../../testreporter/deploy/testreporter/resources/reporter.css\">
        <script type=\"text/javascript\" src=\"../../../testreporter/deploy/testreporter/reporter.js\"></script>
    </head>
    <body>
    <script type=\"text/javascript\">
                    Test.SandBox.setup({
                            includes: [{ type: \"js\", src: \"../../../testreporter/deploy/testreporter/jasmine.js\" },"  > ext4.html

# Add ext-core include        
cat ../../build/sdk.jsb3 | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{    
    path = $2 $4;
    print "                               { type: \"js\", src: \"../" path "\" },";
 
    if (path == "../../platform/core/src/class/Loader.js") {
        print "                               { type: \"js\", src: \"resources/BlockLoader.js\" },";
    }

}'  >> ext4.html
rm dump.tmp

# Add ext-all includes
cat ../../build/ext-all.jsb3 | sed -e :a -e N -e '$!ba' -e 's/,\n/ /g' | grep "path" | tr -d '"' | tr -d "," | tr -d "}" > dump.tmp 
cat dump.tmp | awk '{
    path = $4 $2;
    print "                               { type: \"js\", src: \"../" path "\" },"; 
}'  >> ext4.html
rm dump.tmp

echo "                               { type: \"css\", src: \"../../resources/css/ext-all.css\" },
                               { type: \"js\", src: \"resources/EventUtils.js\" },"  >> ext4.html

# Add specs include        
find spec -name "*.js" > dump.tmp
lastRec=`awk 'END{print NR}' dump.tmp`
awk -v aLastRec="$lastRec" '{
    if (NR == aLastRec) {
        print "                               { type: \"js\", src: \"" $0 "\" }]";
    } else {
        print "                               { type: \"js\", src: \"" $0 "\" },";
    }

}' dump.tmp  >> ext4.html

rm dump.tmp
echo "                });

        </script>
    </body>
</html>" >> ext4.html