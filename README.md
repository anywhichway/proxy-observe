# proxy-observe

Object.deepObserve goes beyond the EcmaScript spec and implements the ability to observe an object and all its sub-objects with a single call.

[![Build Status](https://travis-ci.org/anywhichway/jovial.svg)](https://travis-ci.org/anywhichway/proxy-observe)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/708886d433ad4de589c516fa8fed73e9)](https://www.codacy.com/app/syblackwell/proxy-observe)
[![Code Climate](https://codeclimate.com/github/anywhichway/proxy-observe/badges/gpa.svg)](https://codeclimate.com/github/anywhichway/proxy-observe)
[![Test Coverage](https://codeclimate.com/github/anywhichway/jovial/badges/coverage.svg)](https://codeclimate.com/github/anywhichway/proxy-observe/coverage)
[![Issue Count](https://codeclimate.com/github/anywhichway/proxy-observe/badges/issue_count.svg)](https://codeclimate.com/github/anywhichway/proxy-observe)

[![NPM](https://nodei.co/npm/proxy-observe.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/proxy-observe/)

A Proxy Based Implementation Of Object.observe, Array.observe plus Object.deepObserve. Object.observe and Array.observe have now been deprecated from Chrome and standards tracks, but some developers may still find them useful or require them for backward compatibility in Chrome applications.

Documentation on usage can be found here:

[Object.observe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe)

[Array.observe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe)

Also see the Enhancements section below.

# Installation

npm install proxy-observe

The index.js and package.json files are compatible with https://github.com/anywhichway/node-require so that proxy-observe can be served directly to the browser from the node-modules/proxy-observe directory when using node Express. You can also use the files in the browser subdirectory directly.

In late April 2016 Object.observe disappeared from Chrome and Proxy appeared. As a result, the focus on supporting this library will go up so that can be used to replace what is now missing functionality in Chrome as well as support observers in other browsers.

# Philosophy

This library exists because despite some people's reasonable philosophical concerns regarding the use of observers and the fact they have been deprecated from Chrome and were never fully supported in other JavaScript engines, some people still want to use them.

There is a slightly more complete EcmaScript implementation available at https://github.com/MaxArt2501/object-observe. This is probably the most popular Object.observe polyfill available at the moment. However, it has well documented and acknowledged shortcomings. It is based on polling which means some events get delivered out of order or even missed. It's author provides a reasonable rationale for not using Proxies to implement Object.observe.

The above being said, we had an application that could not afford to miss events or have them out of order and we also wanted something lighter and potentially faster. Hence, we built a Proxy based polyfill. As far as we know the sole shortcomings of our implementation are:

1) There are some less used functions not yet implemented, e.g. deliverChangeRecords.

2) The variables pointing to objects that are being observed must be re-assigned to point to a proxy returned by the call to Object.observe, e.g.

var object = { foo: null };
object = Object.observe(object,function(changeset) { console.log(changeset));
object.foo = "bar";

will result in {foo: "bar"} being printed to the console

Item one above can be re-mediated over time.

We believe item two is a small price to pay. Our implementation is also less than 200 lines of code and 4.5K minified including Array.observe and Object.deepObserve vs. over 500 lines of code and 28K for MaxArt2501 covering just Object.observe.

There is an additional implementation at https://github.com/joelgriffith/object-observe-es5. This implementation is synchronous and modifies all object properties to have custom getters and setters. This could really bind up your application if there are a lot of changes to objects. It also only monitors enumerable properties and like the MaxArt2501 implementation is several hundred lines of code.

Anyway, now you have a choice MaxArt2501, Joel Griffith or AnyWhichWay, and choice is good! They all have their pros and cons.

# Enhancements

Proxy-observe makes the second arguments to `Object.unobserve` and  `Array.unobserve` optional so that an object can be completely un-observed in one call. Additionally, `<instance>.unobserve` returns the original observed object or array "deproxied".


Proxy-observer supports a deepObserve capability on nested objects. It also allows the pausing and starting of observers using two additional optional arguments to Object.observe.

`pausable` - a boolean that indicates to create the observer so it can be paused. The argument `pausable` is optional to reduce the chance of shadowing a property or method on any existing code.

`pause` - a boolean that indicates to create the observer in paused state

If pausable is true then an additional method `deliver(ignorePrevious)` is available to start delivery.

To pause delivery, set a property called `pause` on the function `deliver` to true. Re-set it to false and call `deliver(ignorePrevious)` to re-start change handling. If `ignorePrevious` is set to true, then queued changes will not cause the invocation of observer callbacks.


# What's Implemented and Not and Other Issues

Array.observe does not behave well in Chrome. It is the native implementation that does not behave well. We are looking to patch this in the future. Unit tests pass in Firefox, which uses our observe implementation.

You can observe for ["add", "update", "delete", "reconfigure", "setPrototype","preventExtensions"] using Object.observe.

You can observe for ["add", "update", "delete", "splice"] using Array.observe.

Object.getNotifier and Object.deliverChangeRecords are not implemented.

Currently Object.deepObserve does not support event type selectivity. All events are monitored. There is also no Object.deepUnobserve.

v0.0.12 setPrototypeOf observing does not work in Firefox.

# Release History

v0.0.17 2016-06-15 Fixed [Issue 10](https://github.com/anywhichway/proxy-observe/issues/10#issue-159794843)] thanks to [goodells](https://github.com/goodells). Updated unit test `should support response to pop` accordingly.

v0.0.16 2016-06-02 Modified delivery timeout from 0ms to 10ms to reduce CPU loading.

v0.0.15 2016-05-15 README updates. Unobserve added to Array corrected issue with Object.unobserve not working. Also made callback argument to unobserve optional, which eliminates all observations. Finally, added an unobserve method on on observed instances which returns the original object, i.e. de-proxies, Added more unit tests.

v0.0.13,14 2016-05-12 README and code style improvements.

v0.0.12 2016-05-11 Addressed issue 5. Added unit tests. Coverage over 90%. Array.unobserve still not implemented. setPrototypeOf observing does not work in Firefox.

v0.0.11 2016-05-06 Addressed issues 2,3,4 ... added some unit tests to address issue 4. Unsure how long issue 2 has been undiscovered. Issue 3 has been in all versions. Issue 4 is an enhancement. Started testing in NodeJS v6.0 now that Proxy is supported by NodeJS. Array.unobserve still not implemented.

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
