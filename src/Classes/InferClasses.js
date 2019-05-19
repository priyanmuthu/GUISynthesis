// Require statments

class CommandInfer {
    constructor(command, params = []) {
        this.Command = command;
        this.Parameters = params;
    }
}

class ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        this.ParentCommand = parentCommand;
        this.ParameterName = paramName;
        this.Type = type;
        this.DefaultValue = defaultValue;
    }
}

class StringParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        super(parentCommand, paramName, type, defaultValue);
    }
}

class DropdownParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue, values) {
        super(parentCommand, paramName, type, defaultValue);
        this.Values = values;
    }
}

class FileParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue, extensions) {
        super(parentCommand, paramName, type, defaultValue);
        this.Extensions = extensions;
    }
}

class FolderParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        super(parentCommand, paramName, type, defaultValue);
    }
}

class ArrayParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue, values) {
        super(parentCommand, paramName, type, defaultValue);
        this.Values = values;
    }
}

class ArrayFilesParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue, values, extensions) {
        super(parentCommand, paramName, type, defaultValue);
        this.Values = values;
        this.Extensions = extensions;
    }
}

class BooleanParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        super(parentCommand, paramName, type, defaultValue);
    }
}

class NumberParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        super(parentCommand, paramName, type, defaultValue);
    }

    setMaxValue(maxValue) {
        this.MaxValue = maxValue;
    }

    setMinValue(minValue) {
        this.MinValue = minValue;
    }

    setStepSize(stepSize) {
        this.StepSize = stepSize;
    }
}

class TimeParamInfer extends ParamInfer {
    constructor(parentCommand, paramName, type, defaultValue) {
        super(parentCommand, paramName, type, defaultValue);
    }
}