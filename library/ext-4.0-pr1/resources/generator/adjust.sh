#!/bin/ksh
HUE=$(echo "hue(#$2) - hue(#$1)" | ruby -e "require 'rubygems'; require 'sass'; puts Sass::Script::Parser.parse(\$stdin.read, 0, 0).perform(Sass::Environment.new)")
SATURATION=$(echo "saturation(#$2) - saturation(#$1)" | ruby -e "require 'rubygems'; require 'sass'; puts Sass::Script::Parser.parse(\$stdin.read, 0, 0).perform(Sass::Environment.new)")
LIGHTNESS=$(echo "lightness(#$2) - lightness(#$1)" | ruby -e "require 'rubygems'; require 'sass'; puts Sass::Script::Parser.parse(\$stdin.read, 0, 0).perform(Sass::Environment.new)")

print "adjust-color(#$1, \$hue: ${HUE}, \$saturation: ${SATURATION}, \$lightness: ${LIGHTNESS});"