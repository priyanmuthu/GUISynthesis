// let editor;
function InitializeEditor(editorDiv, filePath, language, contentChange) {
    const path = require('path');
    const fs = require('fs');
    const amdLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
    const amdRequire = amdLoader.require;
    const amdDefine = amdLoader.require.define;
    const utils = require('./utils.js')
    var renderer = require('./renderer.js');
    // const YAMLPATH = path.join(__dirname, 'example.yaml');
    const fullPath = path.resolve(filePath);
    // var editor;
    function uriFromPath(_path) {
        var pathName = path.resolve(_path).replace(/\\/g, '/');
        if (pathName.length > 0 && pathName.charAt(0) !== '/') {
            pathName = '/' + pathName;
        }
        return encodeURI('file://' + pathName);
    }

    amdRequire.config({
        baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
    });
    // workaround monaco-css not understanding the environment
    var editor;
    var getText;
    self.module = undefined;
    amdRequire(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(editorDiv, {
            value: utils.readFileText(fullPath),
            language: 'text',
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            theme: "vs-dark",
            automaticLayout: true
        });
        
        editor.layout();

        // var yaml_text = utils.readFileText(YAMLPATH);
        // if(null != yaml_text){
        //     window.editor.setModel(monaco.editor.createModel(yaml_text, 'yaml'));
        //     renderer.renderUI();
        // }

        // function setEditorText(yamltext){
        //     window.editor.setModel(monaco.editor.createModel(yamltext, 'yaml'));
        //     renderer.renderUI();
        //     console.log('editor text set');
        // }

        // module.exports.setEditorText = setEditorText;

        /**
         * Addds content changed listener to `editor` and invokes `callback` 100ms after the last content changed event.
         */
        // function onDidChangeModelContentDebounced(editor, callback) {
        //     var timer = -1;
        //     var runner = function() {
        //     timer = -1;
        //     callback();
        //     }
        //     return editor.onDidChangeModelContent(function(e) {
        //     if (timer !== -1) {
        //         clearTimeout(timer);
        //     }
        //     timer = setTimeout(runner, 1000);
        //     });
        // }

        editor.onDidChangeModelContent((e) => {
            contentChange();
        });

        // module.exports.editorObj = window.editor;

        // Content Change event
        // editor.onDidChangeModelContent(function (e) {
        //     console.log('content changed');
        //     renderer.renderUI();
        // });
        
    });
    getText = function(){
        return editor.getValue();
    }
    return {getText: getText};
}

module.exports.InitializeEditor = InitializeEditor;