qmake -spec macx-g++
make
rm -fr ../pageslice
mv pageslice.app/Contents/MacOS/pageslice ../pageslice
rm -fr Makefile
rm -fr pageslice.app
rm -fr pageslice.o
rm -fr pageslice.moc