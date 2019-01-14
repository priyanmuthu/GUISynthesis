//Place all the constants here
let stringCount = 0;
let timeCount = 0;

function renderStringParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_div_' + stringCount;
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
    paramEdit.value = param['default'];
    paramEdit.placeholder = param['parameter'];
    pDiv.appendChild(paramEdit);

    // param['eval'] = function(){
    //     console.log("eval");
    //     return paramEdit.value;
    // }

    return pDiv;
}

function renderTimeParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_div_' + timeCount;
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
    
    var paramEdit = createTimerInput('timer_input_'+ stringCount);
    pDiv.appendChild(paramEdit);

    return pDiv;
}

function renderBooleanParam(param){
    //Render the param UI
    var pDiv = document.createElement('div')
    pDiv.id = 'param_div_' + stringCount;
    stringCount = stringCount + 1;
    pDiv.classList.add('form-group');
    pDiv.insertAdjacentHTML( 'beforeend', '<br/>' );
    
    var paramEdit = document.createElement('input');
    paramEdit.classList.add('form-check-input');
    paramEdit.type = 'checkbox';
    paramEdit.id = 'input_param_' + stringCount;
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

function createTimerInput(timer_id){
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

    return timerDiv;
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
    console.log(num);
    size=2;
    var s = num+"";
    if(s.length>=size){
        console.log('big size');
        s = s.slice(-2);
        if(parseInt(s)>maxVal){
            return maxVal+"";
        }
        return s;
    }
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports.renderStringParam = renderStringParam;
module.exports.renderTimeParam = renderTimeParam;
module.exports.renderBooleanParam = renderBooleanParam;
module.exports.inputSlice = inputSlice;