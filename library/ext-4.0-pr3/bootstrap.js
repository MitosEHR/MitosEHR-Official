(function(){

var path,
    i, ln,
    scriptSrc,
    match,
    scripts = document.getElementsByTagName('script');

for (i = 0, ln = scripts.length; i < ln; i++) {
    scriptSrc = scripts[i].src;

    match = scriptSrc.match(/bootstrap\.js$/);

    if (match) {
        path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
        break;
    }
}

document.write('<script type="text/javascript" src="' + path + 'ext-core-debug.js"></script>');
document.write('<script type="text/javascript" src="' + path + 'ext-all-debug.js"></script>');

})();
