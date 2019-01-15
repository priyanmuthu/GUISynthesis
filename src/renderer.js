//Place all the constants here
let stringCount = 0;
let timeCount = 0;
let booleanCount = 0;
let markdownCount = 0;

const utils = require('./utils.js');
const constants = require('./constants.js');
// Using Showdown.js to parse markdown to HTML: https://github.com/showdownjs/showdown
const showdown = require('showdown');
let mdConverter = new showdown.Converter();

function renderUI(){
    var editorText = window.editor.getValue();
    try{
        var formDiv = document.getElementById('formDiv');
        var yamlObj = utils.getYAMLObject(editorText);
        var newUI = createUI(yamlObj);
        formDiv.innerHTML = "";
        formDiv.appendChild(newUI);
        $('[data-toggle="tooltip"]').tooltip();
        module.exports.yamlObj = yamlObj;

        // var command = yamlObj['command'];
        // var params = command['params'];
        // var val = params[2]['eval']();
        // console.log('val: '+val);
    }
    catch(e){
        //Show an error UI
        console.log(e);
    }
}

function createUI(yamlObj){
    var mainDiv = document.createElement("div");
    mainDiv.id = 'mainDiv'

    //Do this for the command
    var commandCount = yamlObj.length;
    for(var i = 0; i < commandCount; i++){
        command = yamlObj[i];
        var commandDiv = renderCommandUI(command, i);
        mainDiv.appendChild(commandDiv);
    }
    return mainDiv;
}

function renderCommandUI(command, div_ID){
    //Create a text for command
    var commandDiv = document.createElement("div");
    commandDiv.id = 'commandDiv_'+div_ID;

    commandHeading = document.createElement('h1');
    commandHeading.innerHTML = commandHeading.innerHTML + "<b>Command:</b> " + command[constants.yamlStrings.commandName];
    var runButton = document.createElement('button');
    runButton.classList.add('btn');
    runButton.classList.add('btn-primary');
    runButton.classList.add('pull-right');
    runButton.innerText = "Run";
    runButton.style.minWidth = "40px";
    runButton.insertAdjacentHTML('beforeend', '<span class="glyphicon glyphicon-play" style="margin-left:5px;" />');
    runButton.addEventListener("click",() => {
        runCommand(command);
    });
    commandHeading.appendChild(runButton);
    commandDiv.appendChild(commandHeading);

    var mainParamDiv = document.createElement('div');
    mainParamDiv.id = 'mainParamDiv';
    mainParamDiv.classList.add('grid-form')

    renderParamUI(mainParamDiv, command[constants.yamlStrings.parameterArray]);
    commandDiv.appendChild(mainParamDiv);
    return commandDiv;
}

function renderParamUI(mainParamDiv, params){
    var paramCount = params.length;
    for(var i = 0; i < paramCount; i++){
        param = params[i];

        var pDiv;

        switch(param[constants.yamlStrings.parameterType]){
            case constants.yamlTypes.time:
                pDiv = renderTimeParam(param);
                break;
            case constants.yamlTypes.boolean:
                pDiv = renderBooleanParam(param);
                break;
            case constants.yamlTypes.markdown:
                pDiv = renderMarkdownParam(param);
                break;
            default:
                pDiv = renderStringParam(param);
                break;
        }

        mainParamDiv.appendChild(pDiv);
    }
}

function renderStringParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_string_' + stringCount;
    stringCount = stringCount + 1;
    pDiv.classList.add('form-group');
    
    var paramName = document.createElement('label');
    paramName.innerHTML = param['parameter']
    if("info" in param){
        var infoIcon = createInfo(param['info']);
        paramName.appendChild(infoIcon);
    }
    pDiv.appendChild(paramName);

    var paramEdit = document.createElement('input');
    paramEdit.classList.add('form-control');
    paramEdit.type = 'text';
    paramEdit.id = 'input_param_' + stringCount;
    if('default' in param){
        paramEdit.value = param['default'];
    }
    paramEdit.placeholder = param['parameter'];
    pDiv.appendChild(paramEdit);

    param['eval'] = function(){
        return paramEdit.value;
    }

    return pDiv;
}

function renderMarkdownParam(param){
    var pDiv = document.createElement('div')
    pDiv.id = 'param_md_' + markdownCount;
    pDiv.style['grid-column'] = "1/-1";
    markdownCount = markdownCount + 1;

    // pDiv.insertAdjacentHTML('beforeend', '<br />');
    pDiv.insertAdjacentHTML('beforeend', mdConverter.makeHtml(param[constants.yamlStrings.markdownValue]));

    return pDiv;
}

function renderTimeParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_time_' + timeCount;
    timeCount = timeCount + 1;
    pDiv.classList.add('form-group');
    
    var paramName = document.createElement('label');
    paramName.innerHTML = param['parameter']
    if("info" in param){
        var infoIcon = createInfo(param['info']);
        paramName.appendChild(infoIcon);
    }
    pDiv.appendChild(paramName);
    pDiv.insertAdjacentHTML( 'beforeend', '<br/>' );
    
    var defaultVal = null;
    if('default' in param){
        defaultVal = param['default'];
    }
    var result = createTimerInput('timer_input_'+ stringCount, defaultVal);
    var paramEdit = result['div'];
    pDiv.appendChild(paramEdit);

    param['eval'] = result['eval'];

    return pDiv;
}

function renderBooleanParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_bool_' + booleanCount;
    booleanCount = booleanCount + 1;
    pDiv.classList.add('form-group');
    pDiv.insertAdjacentHTML( 'beforeend', '<br/>' );
    
    var paramEdit = document.createElement('input');
    paramEdit.classList.add('form-check-input');
    paramEdit.type = 'checkbox';
    paramEdit.id = 'input_param_' + stringCount;
    if('default' in param){
        paramEdit.checked = param['default'];
    }
    pDiv.appendChild(paramEdit);

    var paramName = document.createElement('label');
    paramName.innerHTML = param['parameter']
    paramName.style.marginLeft = "10px";
    paramName.style.fontSize = "16px";
    if("info" in param){
        var infoIcon = createInfo(param['info']);
        paramName.appendChild(infoIcon);
    }
    pDiv.appendChild(paramName);

    param['eval'] = function(){
        return paramEdit.checked;
    }
    
    return pDiv;
}

function createInfo(infoText){
    var infoIcon = document.createElement('span');
    infoIcon.classList.add('glyphicon');
    infoIcon.classList.add('glyphicon-info-sign');
    infoIcon.setAttribute('data-toggle', 'tooltip');
    infoIcon.setAttribute('title', infoText);
    infoIcon.style.marginLeft = "10px";
    return infoIcon;
}

function createTimerInput(timer_id, defaultVal){
    var timerDiv = document.createElement('div');
    timerDiv.classList.add('timer-div');
    timerDiv.style.verticalAlign = "middle";

    //Creating input
    var hourInput = createTimeInput("hour", 999);
    timerDiv.appendChild(hourInput);
    var hourSep = createTimerSep();
    timerDiv.appendChild(hourSep);
    // timerDiv.insertAdjacentHTML( 'beforeend', '<span>:</span>' );

    var minInput = createTimeInput("mins", 59);
    timerDiv.appendChild(minInput);
    var minSep = createTimerSep();
    timerDiv.appendChild(minSep);

    var secInput = createTimeInput("secs", 59);
    timerDiv.appendChild(secInput);

    //default value
    if(defaultVal != null){
        try{
            var strArr = defaultVal.split(':');
            var hour = strArr[0];
            var min = strArr[1];
            var sec = strArr[2];
            hourInput.value = hour;
            minInput.value = min;
            secInput.value = sec;
        }
        catch(e){
            console.log(e);
        }
    }

    var res = {'div': timerDiv, 'eval': function(){
        return hourInput.value + ":" + minInput.value + ":" + secInput.value;
    }};
    return res;
}

function createTimeInput(timerType, maxVal){
    var timerInput = document.createElement('input');
    timerInput.classList.add('form-control');
    timerInput.classList.add('timer-input');
    timerInput.type = "number";
    timerInput.min = 0;
    timerInput.max = maxVal;
    timerInput.addEventListener('input', inputSlice);
    timerInput['data-type'] = timerType;
    
    return timerInput;
}

function createTimerSep(){
    var sep = document.createElement('span');
    sep.style.display = "-webkit-box";
    sep.style["-webkit-box-pack"] = "center";
    sep.style["-webkit-box-align"] = "center";
    sep.innerText = ":";
    return sep;
}

function inputSlice(e){
    // console.log(e);
    e.target.value = pad(e.target.value, e.target.max);
}

function pad(num, maxVal) {
    size=2;
    var s = num+"";
    if(s.length>=size){
        s = s.slice(-2);
        if(parseInt(s)>maxVal){
            return maxVal+"";
        }   
        return s;
    }
    while (s.length < size) s = "0" + s;
    return s;
}

function runCommand(command){
    //parse the parameters and run the command
    var commandString = "";

    //command name:
    commandString += command[constants.yamlStrings.commandName];
    commandString += " ";

    //add params
    var params = command[constants.yamlStrings.parameterArray];
    var paramCount = params.length;
    var paramList = [];
    for(var i = 0; i<paramCount; i++){
        var param = params[i];
        if(param[constants.yamlStrings.parameterType] == constants.yamlTypes.markdown){
            continue;
        }
        switch(param[constants.yamlStrings.parameterType]){
            case constants.yamlTypes.boolean:
                if(param[constants.yamlStrings.evaluate]()){
                    paramList.push(param[constants.yamlStrings.parameterName]);
                }
                break;
            default:
                var paramElements = [param[constants.yamlStrings.parameterName], param[constants.yamlStrings.evaluate]()];
                paramList.push(paramElements.join(' '));
                break;
        }pad
    }
    commandString += paramList.join(' ');
    console.log(commandString);

    // var terminal = require('./terminal.js');
    // terminal.runCommand(commandString);
}

module.exports.renderStringParam = renderStringParam;
module.exports.renderTimeParam = renderTimeParam;
module.exports.renderBooleanParam = renderBooleanParam;
module.exports.inputSlice = inputSlice;
module.exports.renderUI = renderUI;