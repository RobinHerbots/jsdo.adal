# jsdo.adal
Copyright (c) 2018 Robin Herbots Licensed under the MIT license (http://opensource.org/licenses/mit-license.php)

[![donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LXZNPVLB4P7GU)

Azure AD authentication for JSDO

This package provides a full bundle of JSDO with the Azure AD authentication module.
So you don't need to add extra references to JSDO to use this lib.

### Documentation
For more information see the <a href="https://documentation.progress.com/output/pdo">Progress Data Objects Guide and Reference.</a>

### Usage
#### Classic web with <script\> tag

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script src="node_modules/jquery/dist/jquery.js"></script>
<script src="dist/progress.auth.adal.js"></script>
<script>
      var serviceURI = "<Service URI>";
      var catalogURI = "<Catalog URI>";

      progress.data.getSession({
               serviceURI: serviceURI,
               catalogURI: catalogURI,
               authenticationModel: progress.data.Session.AUTH_TYPE_ADAL,
               authConfig: {
                    instance: "https://login.microsoftonline.com/",
                    tenant: "tenantid",
                    clientId: "clientid",
                    postLogoutRedirectUri: "",
                    redirectUri: window.location.origin + window.location.pathname.replace(/\/$/, ""),
                    cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
                    anonymousEndpoints: [],
                    endpoints: {
                        "enpointurl": "resourceid"
                    },
                    extraQueryParameter: `scope=openid,profile,email`,
                    loadFrameTimeout: 12000
                }
      }).then(function () {
         var jsdo = new progress.data.JSDO({name: 'Customer'});
             jsdo.fill("CustNum <= 11").then(function (jsdo, success, request) {
                  jsdo.ttCustomer.foreach(function (customer) {
                       document.write(customer.data.CustNum + ' ' + customer.data.Name + '<br>');
                  });
             }, function () {
                   console.log("Error while reading records.");
             });
         }, function () {
             console.log("Error while creating session.");
         });
</script>
</body>
</html>
```

#### Webpack

##### Install the package
```
npm install jsdo.adal --save
```

##### In your modules
```
var progress = require('jsdo.adal');

//es6
import progress from "jsdo.adal";
```

##### In your config
```
...
   externals: {
        "window": "window",
        "jquery": "jQuery"
    },
...
```