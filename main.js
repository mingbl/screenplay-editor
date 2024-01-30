import { interpret } from "./modules/interpreter.js";
import { print } from "./modules/printer.js";

const textEditor = document.getElementById("text-editor"),
scriptViewer = document.getElementById("viewer-lines"),
scriptViewerBox = document.getElementById("viewer-box"),
findInput = document.getElementById("find-input"), replaceInput = document.getElementById("replace-input"),
replaceButton = document.getElementById("replace-button"),
undoButton = document.getElementById("undo-button"),
replaceCaseToggle = document.getElementById("replace-case-toggle");

document.getElementById("uppercase-button").addEventListener("click", function() {tocase("upper")});
document.getElementById("lowercase-button").addEventListener("click", function() {tocase("lower")});
document.getElementById("share-button").addEventListener("click", share);

var backupScripts = [];
undoButton.addEventListener("click", undo);
function undo() {
    textEditor.value = backupScripts.pop();
    preview(); save(); lockUndo();
};
function lockUndo() {
    if (backupScripts.length > 0) {
        undoButton.disabled = false;
    } else {
        undoButton.disabled = true;
    };
}; lockUndo();

function tocase(newcase) {
    let startPos = textEditor.selectionStart, endPos = textEditor.selectionEnd;
    if (startPos == endPos) {alert("Select text first"); return; };

    let script = textEditor.value; backupScripts.push(script);
    let selection = script.slice(startPos, endPos);

    switch (newcase) {
        case "upper":
            var newSelection = selection.toUpperCase();
            break;
    
        case "lower":
            var newSelection = selection.toLowerCase();
            break;
    };

    let preSelection = script.slice(0, startPos), postSelection = script.slice(endPos, script.length);
    textEditor.value = preSelection + newSelection + postSelection;
    preview(); save(); lockUndo();
};

replaceButton.addEventListener("click", replace);
var caseSensitive = false;
function replace() {
    let findText = findInput.value, replaceText = replaceInput.value,
    modifier = caseSensitive ? "g" : "gi";
    if (findText === null || findText === "") {return}; // Stop process if empty findText value
    backupScripts.push(textEditor.value);
    let regex = new RegExp(findText, modifier);
    textEditor.value = textEditor.value.replace(regex, replaceText);
    preview(); save(); lockUndo();
};
findInput.addEventListener("keyup", lockReplace);
function lockReplace() {
    if (findInput.value.length > 0) {
        replaceButton.disabled = false;
    } else {
        replaceButton.disabled = true;
    };
}; lockReplace();

replaceCaseToggle.checked = false;
replaceCaseCheck();
replaceCaseToggle.addEventListener("click", replaceCaseCheck);
function replaceCaseCheck() {
    if (replaceCaseToggle.checked) {
        caseSensitive = true;
    } else {
        caseSensitive = false;
    };
};

textEditor.addEventListener("keyup", autopreview);
function autopreview() {
    preview();
    // Scroll to bottom
    var scrollBottom = textEditor.clientHeight + textEditor.scrollTop;
    if (scrollBottom === textEditor.scrollHeight) {
        scriptViewerBox.scrollTop = scriptViewerBox.scrollHeight;
    };
};

preview();
function preview() {
    if (textEditor.value != "") {
        var script = interpret(textEditor.value);
        print(script, scriptViewer, "home");
    } else {
        // Clear script viewer
        while (scriptViewer.hasChildNodes()) {
            scriptViewer.removeChild(scriptViewer.firstChild);
        };
    };
};

function share() {
    var script = encodeURIComponent(JSON.stringify(interpret(textEditor.value)));
    
    var curLoc = window.location.href.split("?")[0];
    curLoc = curLoc.replace("index.html", "");
    var url = curLoc.endsWith("/") ? curLoc + "viewer/?" + script : curLoc + "/viewer/?" + script;

    // window.open("https://tinyurl.com/create.php?url=" + url);
    window.open(url);
};

textEditor.addEventListener("keyup", save);
function save() {
    localStorage.setItem("backup", textEditor.value);
};
// Import backup if available
if (localStorage["backup"] && localStorage.getItem("backup") != "") {
    textEditor.value = localStorage.getItem("backup");
    //console.log("Imported backup");
    preview();
};

// Interpret script data from url
{
    // Retrieve script data from url if any
    let tempData = window.location.href.toString();
    if (tempData.includes("?")) {
        let importScript = confirm("Data for a script was found. Click OK to import into your editor.");

        if (importScript) {
            var scriptData = decodeURIComponent(tempData.slice(tempData.indexOf("?") + 1, tempData.length));
            let script = JSON.parse(scriptData);

            let rawScript = "";

            // Interpret script data
            for (const set in script) {
                if (script.hasOwnProperty(set)) {
                    const line = script[set];
                    switch (line.type) {
                        case "heading":
                            rawScript += line.content;
                            break;
                            
                        case "transition":
                            rawScript += line.content;
                            break;

                        case "dialogue":
                            rawScript += line.name + "\n" + line.content[0];
                            for (let i = 1; i < line.content.length; i++) {
                                rawScript += "\n" + line.content[i];
                            };
                            break;

                        case "title":
                            rawScript += line.content[0];
                            for (let i = 1; i < line.content.length; i++) {
                                rawScript += "\n" + line.content[i];
                            };
                            break;

                        case "action":
                            rawScript += line.content[0];
                            for (let i = 1; i < line.content.length; i++) {
                                rawScript += "\n" + line.content[i];
                            };
                            break;
                        
                        default:
                            break;
                    };
                    rawScript += "\n\n";
                };
            };

            // Remove excess \n
            while (rawScript.endsWith("\n")) {
                rawScript = rawScript.slice(0, rawScript.length - 2);
            };

            // Insert into textarea
            textEditor.value = rawScript;
            preview();
        };
    };
    
};
