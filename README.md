# proxy-observe
A Proxy Based Implementation Of Object.observe, Array.observe plus Object.deepObserve.

Object.observe is Proxy based polyfill based on a subset of the EcmaScript 7 spec.

Array.observe is Proxy based polyfill based on a subset of the EcmaScript 7 spec.

Object.deepObserve goes beyond the EcmaScript spec and implements the ability to observe an object and all its sub-objects with a single call.

[![Codacy Badge](https://api.codacy.com/project/badge/grade/708886d433ad4de589c516fa8fed73e9)](https://www.codacy.com/app/syblackwell/proxy-observe)
[![Code Climate](https://codeclimate.com/github/anywhichway/proxy-observe/badges/gpa.svg)](https://codeclimate.com/github/anywhichway/proxy-observe)
[![Issue Count](https://codeclimate.com/github/anywhichway/proxy-observe/badges/issue_count.svg)](https://codeclimate.com/github/anywhichway/proxy-observe)

[![NPM](https://nodei.co/npm/proxy-observe.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/<proxy-observe>/)


# Installation

npm install proxy-observe

The index.js and package.json files are compatible with https://github.com/anywhichway/node-require so that stringformatter can be served directly to the browser from the node-modules/stringformatter directory when using node Express. You can also use the files in the browser subdirectory directly.

At this time, except for Chrome, which has native support for Object.observe and for which this package provides very little additional functionality you will need to get a shim for Proxy if your browser does not support it.

At some point in 2016 it is likely Object.observe with disappear from Chrome and Proxy will appear. At that point this library can be used to replace what will then be missing functionality in Chrome.

# Philosophy

There is a slightly more complete EcmaScript implementation available at https://github.com/MaxArt2501/object-observe. This is probably the most popular Object.observe polyfill available at the moment. However, it has well documented and acknowledged shortcomings. It is based on polling which means some events get delivered out of order or even missed. It's author provides a reasonable rationale for not using Proxies to implement Object.observe.

The above being said, we had an application that could not afford to miss events or have them out of order and we also wanted something lighter and potentially faster. Hence, we built a Proxy based polyfill. Although it is not yet as broadly used and others have not yet had the time to provide feedback; as far as we know the sole shortcomings of our implementation are:

1) There are some less used functions not yet implemented, e.g. deliverChangeRecords.

2) We have not yet developed a set of comprehensive unit tests.

3) The variables pointing to objects that are being observed must be re-assigned to point to a proxy returned by the call to Object.observe, e.g.

var object = { foo: null };
object = Object.observe(object,function(changeset) { console.log(changeset));
object.foo = "bar";

will result in {foo: "bar"} being printed to the console

Item one above can be re-mediated over time.

We believe item three is a small price to pay. Our implementation is also less than 175 lines of code and 3K including Array.observe and Object.deepObserve vs. over 500 lines of code and 28K for MaxArt2501 covering just Object.observe.

There is an additional implementation at https://github.com/joelgriffith/object-observe-es5. This implementation is synchronous and modifies all object properties to have custom getters and setters. This could really bind up your application if there are a lot of changes to objects. It also only monitors enumerable properties and like the MaxArt2501 implementation is several hundred lines of code.

Anyway, now you have a choice MaxArt2501, Joel Griffith or AnyWhichWay, and choice is good! They all have their pros and cons.

# What's Implemented and Not and Other Issues

Array.observe does not behave well in Chrome. It is the native implementation that does not behave well. We are looking to patch this in the future. Unit tests pass in Firefox, which uses our observe implementation.

You can observe for ["add", "update", "delete", "reconfigure", "setPrototype","preventExtensions"] using Object.observe.

You can observe for ["add", "update", "delete", "splice"] using Array.observe.

Array.unobserve is not yet implemented.

Object.getNotifier and Object.deliverChangeRecords are not implemented.

Currently Object.deepObserve does not support event type selectivity. All events are monitored. There is also no Object.deepUnobserve.

# Release History

v0.0.10 2016-01-26 Added browserified versions. Re-wrote unit tests to use blanket.js since unit tests will always pass on Chrome since it has native support for Object.observe and unit testing must be done in the browser until node.js support MS Chakra. However, the test coverage reporting is not working.

v0.0.9 2015-12-13 Added some unit tests and updated documentation. Consider this a BETA.

v0.0.8 2015-12-13 Codacy driven enhancements. Consider this a BETA.

v0.0.6 2015-11-07 Fixed another issue with testing for existence of Proxy object. Consider this a BETA.

v0.0.5 2015-11-07 Fixed issue with testing for existence of Proxy object. Consider this a BETA.

v0.0.4 2015-10-03 Fixed issue with deepObserve discovered during code walkthrough. Issue would have impacted non-Chrome browsers. Consider this a BETA.

v0.0.3 2015-10-01 Updated README. No unit tests yet. Consider this a BETA.

v0.0.2 2015-10-01 Added Object.deepObserve and Array.observe. No unit tests yet. Consider this a BETA.

v0.0.1 2015-10-01 Initial release. No unit tests yet. Consider this a BETA.


# License

MIT License - see LICENSE file
