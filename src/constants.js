const yamlStrings = {
    'commandName': 'command',
    'subCommand': 'subCommand',
    'parameterArray': 'params',
    'parameterType': 'type',
    'markdown': 'md',
    'parameterName': 'parameter',
    'parameterDesc': 'parameterDesc',
    'evaluate': 'eval',
    'isinclude': 'isinclude',
    'defaultValue':'default',
    'info': 'info',
    'value': 'value',
    'required': 'required',
    'rawCommand': 'raw',
    'minValue': 'min',
    'maxValue': 'max',
    'extensions': 'extensions',
    'rawText': 'rawText',
    'commandObjects': 'commandObjects',
    'renderObject': 'renderObject',
    'cellType': 'cellType',
    'step': 'step',
    'manual': 'manual',
};

const stateStrings = {
    commandObjs: 'commandObjs',
    manualObjs: 'manualObjs',
    cellArray: 'cellArray',
    rawText: 'rawText',
    cellInput: 'cellInput',
    renderObject: 'renderObject',
    cellType: 'cellType',
    commandObjects: 'commandObjects',
    UIVisible: 'UIVisible'
};

const yamlTypes = {
    'string': 'string',
    'markdown': 'md',
    'boolean': 'boolean',
    'time': 'time',
    'dropdown': 'dropdown',
    'file': 'file',
    'folder': 'folder',
    'number': 'number',
    'array': 'array',
    'arrayFiles': 'arrayFiles'
};

const paramTypes = {
    'string': 'string',
    'boolean': 'boolean',
    'time': 'time',
    'dropdown': 'dropdown',
    'file': 'file',
    'folder': 'folder',
    'number': 'number',
    'array': 'array',
    'arrayFiles': 'file array'
};

const cellType = {
    command: 0,
    raw: 1,
    markdown: 2
}

const cellTypeIcon = {
    command: 'glyphicon-console',
    markdown: 'glyphicon-font',
    raw: 'glyphicon-list-alt'
}

const textFiles = {
    'json': 'json',
    'config': 'text',
    'txt': 'text',
    'yaml': 'yaml',
    'md': 'markdown',
    'js': 'javascript',
    'xml': 'xml',
    'html': 'html',
    'fastq': 'text'
};

const videoFiles = {
    'mp4': 'video/mp4'
}

const terminalOutput = [
    '>',
    '>>',
    '&>',
    '&>>',
    '<'
];

const modalMaxHeight = '900px';

const trackingPort = 3000; // Do not forget to change in the track.sh file

const enableDraggable = true;

const trackedFile = null;

const enableInteractiveTerminal = true;

const theme = 'light';

const fontSize = '16px';

const enableTab = false;

const subCommandLength = {
    git: 1,
    docker: 2
}

const dockerParamDesc = {
    "-t": "tag",
    "-a": "all",
    "--all": "all",
    "-d": "detach",
    "-p": "publish",
    "-v": "volume",
    "--name": "container name",
    "--detach": "detach"
}

const gitParamDesc = {
    '-m': "commit message",
    '-b': "new branch name",
    '-a': "add all files",
    "--track": "track branch"
}

const gitclone = {
    '2': 'url',
    '3': 'folder location'
}

const dockerimagebuild = {
    '5': 'folder location'
}

const dockerpush = {
    '2': 'image name'
}

const dockercontainerstop = {
    '3': 'container name'
}

const dockercontainerremove = {
    '3': 'image name'
}

const dockercontainerrun = {
    '10': 'image name'
}

const paramPositDesc = {
    'git clone': gitclone,
    'docker image build': dockerimagebuild,
    'docker push': dockerpush,
    'docker container stop': dockercontainerstop,
    'docker container rm': dockercontainerremove,
    'docker container run': dockercontainerrun
}

const paramDesc = {
    'docker': dockerParamDesc,
    'git': gitParamDesc
};

module.exports = {
    theme: theme,
    yamlStrings: yamlStrings,
    yamlTypes: yamlTypes,
    trackingPort: trackingPort,
    cellType: cellType,
    cellTypeIcon: cellTypeIcon,
    textFiles: textFiles,
    videoFiles: videoFiles,
    paramTypes: paramTypes,
    modalMaxHeight: modalMaxHeight,
    stateStrings: stateStrings,
    terminalOutput: terminalOutput,
    enableDraggable: enableDraggable,
    trackedFile: trackedFile,
    enableInteractiveTerminal: enableInteractiveTerminal,
    enableTab: enableTab,
    subCommandLength: subCommandLength,
    paramDesc: paramDesc,
    paramPositDesc: paramPositDesc
};