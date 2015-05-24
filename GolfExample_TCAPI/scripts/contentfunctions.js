function AddLicenseInfo(contentAttributionSiteName, contentAttributionLink){

    if (contentAttributionSiteName.length > 0){
        document.write('<div id="attribution">Content from ' + contentAttributionSiteName + ' (<a href="' + contentAttributionLink + '">' + contentAttributionLink + '</a>)<br />');
    }
    document.write('<a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/"><br />');
    document.write('<img alt="Creative Commons License" style="border-width:0" src="../img/cclicense.png" style="float:left;margin-right:10px;" /></a>');
    document.write('<span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dc:type"> Source code</span>');
    document.write('by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.scorm.com" property="cc:attributionName" rel="cc:attributionURL">Rustici Software, LLC</a>');
    document.write('is licensed under a <br />');
    document.write('<a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/">Creative Commons Attribution 3.0 United States License</a>.');
    document.write('<br /><br />');
    document.write('</div>');
}

function AddTagLine(){
    document.write('<div class="salespitch"><a target="_blank" href="http://tincanapi.com/"><img src="../img/tincan-300x176.png"/></a></div>');
}
