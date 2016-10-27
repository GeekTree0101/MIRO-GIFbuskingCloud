/*global cordova, module*/

module.exports = {
    startFloatingActivity: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "cordovafloatingactivity", "startFloatingActivity", [name]);
    },
    stopFloatingActivity: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "cordovafloatingactivity", "stopFloatingActivity", [name]);
    }
};
