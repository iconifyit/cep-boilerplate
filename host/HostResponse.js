var HostResponse = function(value, error) {

    this.value = value;
    this.error = error;
}

HostResponse.prototype.getValue = function() {
    return this.value;
}

HostResponse.prototype.getError = function() {
    return this.error;
}

HostResponse.prototype.isError = function() {
    return typeof this.error === 'string' && this.error.length > 0;
}

HostResponse.prototype.valueOf = function() {
    return {
        "value": this.getValue(),
        "error": this.getError()
    }
}

HostResponse.prototype.stringify = function() {
    return JSON.stringify(this.valueOf())
}

HostResponse.prototype.parse = function(stringValue) {

    var obj = {
        value : null,
        error : "Parse error. " + stringValue + " is not a valid JSON string"
    };

    if (this.validate(stringValue)) {
        obj = JSON.parse(stringValue);
        error = '';
        value = obj.value;
    }

    this.error = obj.error;
    this.value = obj.value;

    // return this.valueOf();

    return this;
}

HostResponse.prototype.validate = function(jsonString) {
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return true;
        }
    }
    catch(e){}

    return false;
}
