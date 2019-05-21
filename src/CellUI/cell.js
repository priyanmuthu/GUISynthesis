const constants = require('../constants.js');
const commandUI = require('./commandUI.js').commandUI;
const rawScriptUI = require('./rawScriptUI.js').rawScriptUI;
const markdownUI = require('./markdownUI.js').markdownUI;

class cell {
    constructor(deleteCell, replaceCell = null, commandName = null) {
        this.deleteCell = deleteCell;
        this.commandName = commandName;
        this.replaceCell = replaceCell;
        this.cDiv = document.createElement('div');
        this.cDiv.style.marginTop = '5px';
        this.cDiv.style.marginBottom = '5px';
        if (constants.enableDraggable) {
            this.cDiv.classList.add('list-group-item');
            this.cDiv.classList.add('cell-list');
        }
        // this.cDiv.addEventListener('focusin', () => {
        //     console.log('focused');
        // });
        this.cellUI = this.createNewUI();
        this.cDiv.appendChild(this.cellUI.getUI());
        $('.selectpicker').selectpicker();
    }

    getUI() {
        return this.cDiv;
    }

    selectionChange(cellType, rawText = '') {
        // Dump the current cell object and create a new cell object
        cellType = Number(cellType);
        this.cellUI = this.createNewUI(cellType);
        this.cDiv.innerHTML = '';
        this.cDiv.appendChild(this.cellUI.getUI(rawText));
        $('.selectpicker').selectpicker();
    }

    createNewUI(cellType = constants.cellType.command) {
        switch (cellType) {
            case constants.cellType.markdown:
                return new markdownUI(this);
            case constants.cellType.raw:
                return new rawScriptUI(this);
            case constants.cellType.command:
            default:
                return new commandUI(this);
        }
    }

    delete() {
        this.deleteCell(this.cDiv, this.commandName);
    }

    replace(commandName, commandStr) {
        if (this.replaceCell === null) { return; }
        this.replaceCell(this.commandName, this.cDiv, commandName, commandStr);
    }

    getState() {
        return this.cellUI.getState();
    }

    loadState(state) {
        this.selectionChange(state[constants.yamlStrings.cellType]);
        this.cellUI.loadState(state);
    }
}


module.exports.cell = cell;