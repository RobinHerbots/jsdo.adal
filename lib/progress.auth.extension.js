/*
 * progress.auth.extension.js
 * http://github.com/RobinHerbots/jsdo.adal
 * Copyright (c) 2018 -	Robin Herbots
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Version: 0.0.0-dev
 */
import {progress} from 'jsdo';

//define azure session
if ((typeof Object.defineProperty) == 'function')
    Object.defineProperty(progress.data.Session, 'AUTH_TYPE_ADAL', {
        value: "adal", enumerable: true
    });
else progress.data.Session.AUTH_TYPE_ADAL = "adal";

//extend the AuthenticationProvider
var authProviderBase = progress.data.AuthenticationProvider;
progress.data.AuthenticationProvider = function (initObject) {
    var authProv, authModel = (initObject && initObject.authenticationModel.toLowerCase()),
        adalConfig = (initObject && initObject.adalConfig);
    switch (authModel) {
        case progress.data.Session.AUTH_TYPE_ADAL:
            authProv = new progress.data.AuthenticationProviderAdal(adalConfig);
            break;
        default:
            authProv = authProviderBase.call(this, initObject);
    }

    return authProv;
};

progress.data.Session.prototype = sessionBase.prototype;

export default progress;