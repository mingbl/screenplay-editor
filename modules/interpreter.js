import { emoticons } from "./emotes.js";

export function interpret(source) {
    var blocks = source.split("\n\n");
    var statements = new Object();
    var l = 0;

    function isUpperCase(str) {
        return (/^[^a-z]*$/).test(str);
    };

    const sceneHeaders = /EXT|INT/;
    const transitions = /FADE|CUT/;

    Array.prototype.clone = function () {
        return this.slice(0);
    };

    for (let i = 0; i < blocks.length; i++) {
        statements[l] = new Object();
        let content = blocks[i].split("\n");
        // If Scene Heading
        if (content.length === 1 && isUpperCase(content[0]) && (sceneHeaders.test(content[0].toUpperCase()) || content[0].startsWith("."))) {
            statements[l].type = "heading";
            if (content[0].startsWith(".")) { // Forced Scene Heading
                statements[l].content = content[0].toUpperCase().substr(1, content[0].length);
            } else {
                statements[l].content = content[0].toUpperCase();
            };
        } else
        // If Transition
        if (content.length === 1 && isUpperCase(content[0]) && transitions.test(content[0].toUpperCase())) {
            statements[l].type = "transition";
            statements[l].content = content[0].toUpperCase();
        } else
        // If Title & Credit
        if (content.length >= 2 && isUpperCase(content[0]) && content[1].toLowerCase().startsWith("by ")) {
            statements[l].type = "title";
            statements[l].content = content.clone();
        } else
        // If Dialogue Piece
        if (content.length > 1 && isUpperCase(content[0])) {
            statements[l].type = "dialogue";
            statements[l].name = content[0];
            content.shift(); // Remove name from array
            statements[l].content = content.clone();
        } else
        // If Action Piece
        {
            statements[l].type = "action";
            statements[l].content = content.clone();
        };
        l++;
    };

    return statements;
};