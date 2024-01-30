import { emoticons } from "./emotes.js";

export function print(script, viewer, location) {
    // Reset script viewer
    while (viewer.hasChildNodes()) {
        viewer.removeChild(viewer.firstChild);
    };

    // Get array of characters
    var charactersList = [];
    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            if ((line.type === "dialogue" || line.type === "emoticon") && !charactersList.includes(line.name)) {
                charactersList.push(line.name);
            };
        };
    };

    // Test for emoticon line as dialogue
    function isEmoticon(line) {
        return (line.startsWith("*") && line.endsWith("*") && emoticons.hasOwnProperty(line.substr(1, line.length - 1).toLowerCase().split(" ").slice(0, -1).toString().replace(/ /g, "_")));
    };

    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            switch (line.type) {
                case "heading": {
                    let item = document.createElement("li");
                    item.innerHTML = line.content;
                    item.classList.add("heading");
                    viewer.appendChild(item);
                } break;

                case "transition": {
                    let item = document.createElement("li");
                    item.innerHTML = line.content;
                    item.classList.add("transition");
                    viewer.appendChild(item);
                } break;

                case "dialogue": {
                    for (let m = 0; m < line.content.length; m++) {
                        let item = document.createElement("li");
                        let content = line.content[m];

                        if (m === 0) { // First line
                            item.innerHTML = "<u>" + line.name + ":</u><br>";/* + line.content[0]*/
                        };

                        // If dialogue
                        if (!isEmoticon(content)) { 
                            item.classList.add("dialogue");
                            let div = document.createElement("div");
                            item.appendChild(div);
                            let span = document.createElement("span");
                            span.innerHTML = content;
                            div.appendChild(span);

                            if (m === 0) { // Dialogue on first line
                                div.classList.add("first");
                            };

                            if (m + 1 < line.content.length) { // Continues further
                                let arrowSpan = document.createElement("span");
                                arrowSpan.innerHTML = ("↓ ↓ ↓");
                                arrowSpan.classList.add("down");
                                div.appendChild(arrowSpan);
                                
                                item.addEventListener("mouseover", function() {
                                    arrowSpan.style.opacity = "1";
                                });

                                item.addEventListener("mouseout", function() {
                                    arrowSpan.style.opacity = "0";
                                });
                            };

                            item.addEventListener("click", function() {
                                let temp = document.createElement("textarea");
                                temp.value = line.content[m];
                                temp.id = "temp";
                                document.body.appendChild(temp);
                                temp.select();
                                document.execCommand("copy");
                                temp.remove();
                            });
                        } 

                        // If emoticon
                        else {
                            item.classList.add("emoticon");
                            let div = document.createElement("div");
                            item.appendChild(div);
                            let img = document.createElement("img");
                            var emote = content.substr(1, content.length - 1).toLowerCase().split(" ").slice(0, -1).toString().replace(/ /g, "_")
                            switch (location) {
                                case "home":
                                    img.src = "./emotes/" + emote + ".svg";
                                    break;
                                case "sibling":
                                    img.src = "../emotes/" + emote + ".svg";
                                    break;
                            };
                            div.appendChild(img);
                            let span = document.createElement("span");
                            span.innerHTML = "(" + emoticons[emote] + ")";
                            div.appendChild(span);

                            if (m === 0) { // Emoticon on first line
                                div.classList.add("first");
                            };

                            if (m + 1 < line.content.length) { // Continues further
                                let arrowSpan = document.createElement("span");
                                arrowSpan.innerHTML = ("↓ ↓ ↓");
                                arrowSpan.classList.add("down");
                                div.appendChild(arrowSpan);
                                
                                item.addEventListener("mouseover", function() {
                                    arrowSpan.style.opacity = "1";
                                });

                                item.addEventListener("mouseout", function() {
                                    arrowSpan.style.opacity = "0";
                                });
                            };
                        };

                        item.classList.add("character-" + (charactersList.indexOf(line.name) + 1));
                        viewer.appendChild(item);
                    };
                } break;

                case "title": {
                    let item = document.createElement("li");
                    item.innerHTML = "<b>" + line.content[0].toUpperCase() + "</b>";
                    for (let i = 1; i < line.content.length; i++) {
                        item.innerHTML += "<br>" + line.content[i];
                    };
                    item.classList.add("title");
                    viewer.appendChild(item);
                } break;

                case "action": {
                    let item = document.createElement("li");
                    item.innerHTML = line.content.join("<br>");
                    item.classList.add("action");
                    viewer.appendChild(item);
                } break;
            
                default:
                    break;
            };
        };
    };

    // Print The End
    let item = document.createElement("li");
    item.innerHTML = "THE END!";
    item.id = "end";
    viewer.appendChild(item);
}