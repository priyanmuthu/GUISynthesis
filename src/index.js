const fs = require('fs');
const path = require('path');
const { dialog, Menu, app, shell } = require('electron').remote;
const defaultMenu = require('electron-default-menu');
// const YAMLPATH = path.join(__dirname, 'example.yaml');
const Awesomplete = require('awesomplete');
// const synthesis = require('./synthesis.js');
const utils = require('./utils.js');
const celljs = require('./CellUI/cell.js');
const commandUI = require('./CellUI/commandUI.js').commandUI;
const constants = require('./constants.js');
var cellArray = [];
var cellDict = {};
var tabDict = {};

$(document).ready(() => {
    // Do this before anything else
    // setTheme();

    // Do everything here

    //House keeping
    $('#topPanel').height('50%');
    $('#bottomPanel').height('45%');
    $.fn.selectpicker.Constructor.DEFAULTS.template.caret = '';

    // Creating the terminal
    var terminal = require('./terminal.js');
    terminal.initializeTerminal();

    initDynamicResize(terminal);
    initCollapseUI();

    $("#addCellButton").click(() => {
        // addTab('git');
        addCell();
    });

    
    // loading history
    loadHistory();
    
    // Have at least one cell by default
    addCell();
    
    //Adding Menu
    addMenu();

    $("#historyButton").click(() => {
        showHistory();
    });

    collapsePane();
    var formDiv = document.getElementById('formDiv');
    if (constants.enableDraggable) {
        formDiv.classList.add('list-group');
        var sortable = Sortable.create(formDiv, {
            filter: 'input,textarea',
            preventOnFilter: false,
        });
    }
    // console.log(synthesis.addCommandEntry('ffmpeg -i input.mp4 -c copy -ss 00:02:20 -t 00:04:00 output.mp4'));
    // synthesis.parseArgs('ffmpeg -i input.mp4 -vn -ab 320 output.mp3');
    // synthesis.parseArgs('git commit -a -m "this is a commit message"');
});

function showHistory() {
    // console.log(commandUI.commandObjs);
    var historyModalDiv = document.getElementById('historyModalDiv');
    var modalRes = commandUI.getHistory();
    historyModalDiv.appendChild(modalRes.modalDiv);
    $('#' + modalRes.modalID).modal('show');

}

function addMenu() {
    const menu = defaultMenu(app, shell);
    menu.splice(1, 0, {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click(item, focusedWindow) {
                    console.log('clicked load: ', item);
                    loadState();
                }
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click(item, focusedWindow) {
                    console.log('clicked save: ', item);
                    saveState();
                }
            },
            {
                label: 'Save As',
                accelerator: 'CmdOrCtrl+Shift+S',
                click(item, focusedWindow) {
                    console.log('clicked save: ', item);
                    saveAsState();
                }
            }
        ]
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

function saveState() {
    if (constants.trackedFile !== null) {
        fs.writeFileSync(constants.trackedFile, getStateYamlText());
        return;
    }
    saveAsState();
}

function saveAsState() {
    var options = {
        defaultPath: process.cwd(),
        filters: [
            { name: 'YAML', extensions: ['yaml'] }
        ]
    };
    dialog.showSaveDialog(null, options, (filePath) => {
        if (filePath === undefined || filePath === null) { return; }
        var yamlText = getStateYamlText();
        try {
            fs.writeFileSync(filePath, yamlText);
            var dirPath = path.dirname(filePath);
            process.chdir(dirPath);
            constants.trackedFile = filePath;
        }
        catch (e) {
            console.error(e);
        }
    });
}

function getStateYamlText() {
    let cellState = [];
    $('.cell-list').each((i, obj) => {
        var cID = obj.id;
        let someCell = cellDict[cID];
        cellState.push(someCell.getState());
    });
    // let cellState = cellArray.map(c => c.getState());
    var totalState = {};
    totalState[constants.stateStrings.cellArray] = cellState;
    totalState[constants.stateStrings.commandObjs] = commandUI.commandObjs;
    totalState[constants.stateStrings.manualObjs] = commandUI.manualObjs;
    var yamlText = utils.getYAMLText(totalState);
    return yamlText;
}

function loadState() {
    var options = {
        defaultPath: process.cwd(),
        filters: [
            { name: 'YAML', extensions: ['yaml'] }
        ],
        properties: ['openFile']
    };
    dialog.showOpenDialog(options, (files) => {
        console.log(files);
        if (files === undefined || files == null) { return; }
        var filePath = files[0];

        //Change working directory
        var dirPath = path.dirname(filePath);
        process.chdir(dirPath);
        var rcs = require('./terminal.js').runCommandString;
        rcs('cd ' + dirPath);
        rcs('clear');


        var yamlText = fs.readFileSync(filePath);
        var yamlObj = utils.getYAMLObject(yamlText);
        var cellArray = yamlObj[constants.stateStrings.cellArray];
        commandUI.commandObjs = yamlObj[constants.stateStrings.commandObjs];
        commandUI.manualObjs = yamlObj[constants.stateStrings.manualObjs];
        clearNotebook();
        for (var i = 0; i < cellArray.length; i++) {
            addCell(cellArray[i]);
        }
        constants.trackedFile = filePath;
    });
}

function addCell(state = null) {
    var formDiv = document.getElementById('formDiv');
    var newCell = new celljs.cell(deleteCell, replaceCell);
    if (state !== undefined && state !== null) { newCell.loadState(state); }
    cellArray.push(newCell);
    let cellUI = newCell.getUI();
    let uid = utils.getUniqueID();
    cellUI.id = uid;
    formDiv.appendChild(cellUI);
    cellDict[uid] = newCell;
    $('.selectpicker').selectpicker();
}

function addCellToTab(commandName, state = null) {
    addTab(commandName);
    var tabDiv = tabDict[commandName]
    console.log(tabDict);
    var newCell = new celljs.cell(deleteCell, replaceCell, commandName);
    if (state !== undefined && state !== null) { newCell.loadState(state); }
    cellArray.push(newCell);
    let cellUI = newCell.getUI();
    let uid = utils.getUniqueID();
    cellUI.id = uid;
    tabDiv.appendChild(cellUI);
    cellDict[uid] = newCell;
    $('.selectpicker').selectpicker();

    openTab(getTabID(commandName), getTabButtonID(commandName));
}

function replaceCell(oldCommandName, cellElement, newCommandName, commandStr) {
    //delete from old tab -> put it to new tab
    deleteCell(cellElement, oldCommandName);
    let newState = createNewState(commandStr);

    addCellToTab(newCommandName, newState);
    openTab(getTabID(newCommandName), getTabButtonID(newCommandName));
}

function createNewState(commandStr) {
    let newState = {}
    newState[constants.stateStrings.cellType] = constants.cellType.command;
    newState[constants.stateStrings.rawText] = commandStr;
    newState[constants.stateStrings.cellInput] = commandStr;
    newState[constants.stateStrings.UIVisible] = true;
    return newState;
}

function loadHistory() {
    let commands = utils.readFileText('./src/history.txt').split('\n');
    // console.log(commands);
    for (i = 0; i < commands.length; i++) {
        let cStr = commands[i];
        let newState = createNewState(cStr);
        let cName = utils.getCommandName(cStr);
        if(constants.enableTab){
            addCellToTab(cName, newState);
        }
        else{
            addCell(newState);
        }
    }
}

function deleteCell(cellElement, commandName) {
    console.log('delete cell');
    let cellDiv = document.getElementById('formDiv');
    if (commandName !== null) {
        cellDiv = tabDict[commandName];
    }
    var idx = cellArray.indexOf(cellElement);
    if (idx !== -1) { cellArray.splice(idx, 1); }
    console.log(cellElement);
    cellDiv.removeChild(cellElement);
}

function clearNotebook() {
    var formDiv = document.getElementById('formDiv');
    formDiv.innerHTML = '';
    cellArray = [];
}




function initDynamicResize(terminal) {
    var window = require('electron').remote.getCurrentWindow();
    window.on('resize', () => {
        resizeUI();
    });

    function resizeUI() {
        terminal.fitTerminal();
    }
}

function initCollapseUI() {
    $('#panelButton').click(() => {
        toggleCollapsePane();
    });
    $('#panelButton').bind('collapse', () => {
        collapsePane();
    });
    $('#panelButton').bind('uncollapse', () => {
        uncollapsePane();
    });
}

function collapsePane() {
    var bottomPanel = '#bottomPanel';
    var topPanel = '#topPanel';
    var panelButtonIcon = '#panelButtonIcon';
    var disp = $('#bottomPanel').css('display');
    if (disp == 'block') {
        $(bottomPanel).hide();
        $(bottomPanel).height('0%');
        $(topPanel).height('95%');
        $(panelButtonIcon).removeClass('glyphicon-menu-down');
        $(panelButtonIcon).addClass('glyphicon-menu-up');
    }
}

function uncollapsePane() {
    var bottomPanel = '#bottomPanel';
    var topPanel = '#topPanel';
    var panelButtonIcon = '#panelButtonIcon';
    var disp = $('#bottomPanel').css('display');
    if (disp == 'none') {
        //Show the panel
        $(topPanel).height('50%');
        $(bottomPanel).height('45%');
        $(bottomPanel).show();
        $(panelButtonIcon).removeClass('glyphicon-menu-up');
        $(panelButtonIcon).addClass('glyphicon-menu-down');
    }
}

function toggleCollapsePane() {
    var disp = $('#bottomPanel').css('display');
    if (disp == 'block') {
        collapsePane();
    }
    else if (disp == 'none') {
        uncollapsePane();
    }
}

function addTab(commandName) {
    let tabID = getTabID(commandName);
    let tabButtonID = getTabButtonID(commandName);
    if (commandName in tabDict) { return; }
    // Add tab div
    let tabParentDiv = document.getElementById('tabParentDiv');
    let newTabDiv = document.createElement('div');
    newTabDiv.id = tabID;
    newTabDiv.classList.add('tabcontent');
    tabParentDiv.appendChild(newTabDiv);

    // Add tab button
    let tabButtonDiv = document.getElementById('tabButtonDiv');
    let newTabButton = document.createElement('button');
    newTabButton.id = tabButtonID;
    newTabButton.classList.add('tablinks');
    newTabButton.addEventListener('click', (ev) => {
        openTab(tabID, tabButtonID);
    });
    newTabButton.innerHTML = `<b>${commandName}</b>`;
    tabButtonDiv.appendChild(newTabButton);

    tabDict[commandName] = newTabDiv;
}

function getTabID(commandName) {
    return `${commandName}Tab`;
}

function getTabButtonID(commandName) {
    return `${commandName}TabButton`;
}

function openTab(tabID, tabButtonID) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    console.log(tabID);
    document.getElementById(tabID).style.display = "block";
    let tabButton = document.getElementById(tabButtonID);
    tabButton.classList.add('active');
    // evt.currentTarget.className += " active";
}