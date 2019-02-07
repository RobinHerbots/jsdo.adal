/*
 * progress.auth.adal.js
 * http://github.com/RobinHerbots/jsdo.adal
 * Copyright (c) 2018 -	Robin Herbots
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */

import progress from "./progress.loader";
import "imports-loader?{default:progress}=../../src/progress.loader!../JSDO/src/progress.util";
import "imports-loader?{default:progress}=../../src/progress.loader!../JSDO/src/progress.session";
import "imports-loader?{default:progress}=../../src/progress.loader!../JSDO/src/progress";
import "imports-loader?{default:progress}=../../../src/progress.loader!../JSDO/src/auth/progress.auth";
import AuthenticationContext from 'adal-angular';

window.AuthenticationContext = AuthenticationContext; //AuthenticationContext  should be available on the window. See AuthenticationContext.prototype.getRequestInfo

progress.data.AuthenticationProviderAdal = function (uri, adalConfig) {
    var authContext = new AuthenticationContext(adalConfig);
    authContext.callback = adalConfig.callback;

    // Check For & Handle Redirect From AAD After Login
    if (authContext.isCallback(window.location.hash)) {
        authContext.handleWindowCallback();
    }
    // process constructor arguments, etc.
    this._initialize(uri, progress.data.Session.AUTH_TYPE_ADAL,
        {"_loginURI": progress.data.AuthenticationProvider._homeLoginURIBase});

    function setAuthorizationHeader(xhr, uri) {
        var resource = authContext.getResourceForEndpoint(uri);
        let dfd = $.Deferred();
        if (resource !== null) {
            authContext.acquireToken(resource, function (error, token) {
                if (error || !token) {
                    authContext.error(error);
                    dfd.reject(error);
                    return;
                }

                xhr.setRequestHeader('Authorization', "Bearer " + token);
                dfd.resolve();
            });
        } else dfd.reject("Unknown resource");
        return dfd.promise();
    }

    this._reset = function () {
        // if (authContext) authContext.logOut();
        progress.data.AuthenticationProviderAdal.prototype._reset.apply(this);
    };

    this.hasClientCredentials = function () {
        return (authContext && authContext.getCachedUser() && authContext.getCachedToken(adalConfig.clientId));
    };

    //we need to override because we need to control the promises from adal.js
    this._loginProto = function (sendParam) {
        var deferred = $.Deferred(),
            xhr,
            uriForRequest,
            header,
            that = this;

        if (authContext && !(authContext.getCachedUser() && authContext.getCachedToken(adalConfig.clientId))) {
            authContext.login();
            return;
        }

        if (this._loggedIn) {
            // "The login method was not executed because the AuthenticationProvider is
            // already logged in."
            throw new Error(progress.data._getMsgText("jsdoMSG051", "AuthenticationProvider"));
        }

        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // process the response from the Web application
                that._processLoginResult(xhr, deferred);
            }
        };

        if (progress.data.Session._useTimeStamp) {
            uriForRequest = progress.data.Session._addTimeStampToURL(this._loginURI);
        } else {
            uriForRequest = this._loginURI;
        }

        this._openLoginRequest(xhr, uriForRequest);
        xhr.setRequestHeader("Accept", "application/json");
        setAuthorizationHeader(xhr, uri).then(function () {
            xhr.send(sendParam);
        }, function () {
            deferred.reject(that.arguments)
        });

        return deferred.promise();
    };

    // this method is needed for internal jsdo calls see comment in progress.auth.js
    this._openRequestAndAuthorize = function (xhr, verb, uri, async, callback) {
        if (this.hasClientCredentials()) {
            xhr.open(verb, uri, async);
            progress.data.Session._setNoCacheHeaders(xhr);

            setAuthorizationHeader(xhr, uri).then(function () {
                callback();
            }, function () {
                callback(new Error(progress.data._getMsgText("jsdoMSG125", "AuthenticationProvider")));
            });
        } else {
            callback(new Error(progress.data._getMsgText("jsdoMSG125", "AuthenticationProvider")));
        }
    };
};

//inherit from base AuthenticationProvider
progress.data.AuthenticationProviderAdal.prototype = progress.data.AuthenticationProvider.prototype;

export default progress;