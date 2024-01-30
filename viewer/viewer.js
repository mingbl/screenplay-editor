import { print } from "../modules/printer.js";

const scriptViewer = document.getElementById("viewer-lines");

{
    let tempData = window.location.href.toString();
    var scriptData = decodeURIComponent(tempData.slice(tempData.indexOf("?") + 1, tempData.length));
};

if (scriptData != "") {
    let script = JSON.parse(scriptData);
    print(script, scriptViewer, "sibling");

    // Set tab title
    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            if (line.type === "title") {
                document.title = line.content[0] + " | " + document.title;
                break;
            };
        };
    };

    // Add highlight
    window.addEventListener("keydown", function() {command(event)});
    var initNum = 0;
    function command(event) {
        var num = event.key;
        // Reset highlighted lines
        if (initNum != 0 || (num == 0 && initNum != 0)) {
            var highlighted = document.getElementsByClassName("character-" + initNum);
            for (let i = 0; i < highlighted.length; i++) {
                const item = highlighted[i];
                item.classList.remove("highlighted");
            };
        };

        // Highlight lines
        if (!isNaN(num) && num >= 1 && num <= 9 && document.getElementsByClassName("character-" + num).length > 0) {
            var highlighted = document.getElementsByClassName("character-" + num);
            for (let i = 0; i < highlighted.length; i++) {
                const item = highlighted[i];
                item.classList.add("highlighted");
            };
            initNum = num;
        };

        // Commands
        if (isNaN(num)) {
            switch (num) {
                case "e":
                    edit();
                    break;
            
                default:
                    break;
            }
        }
    };
} else {
    alert("No script data found.")
};

function edit() {
    var script = encodeURIComponent(scriptData);
    var curLoc = window.location.href.split("?")[0];
    var locPar = curLoc.slice(0, curLoc.length - 7);

    var url = locPar.endsWith("/") ? locPar + "?" + script : locPar + "/?" + script;
    
    let openEditor = confirm("Open this script in the editor?");

    if (openEditor) {
        window.open(url);
    };
};