# proxy-observe
A Proxy Based Implementation Of Object.observe, Array.observe plus Object.deepObserve.

Object.observe is Proxy based polyfill based on a subset of the EcmaScript 7 spec.

Array.observe is Proxy based polyfill based on a subset of the EcmaScript 7 spec.

Object.deepObserve goes beyond the EcmaScript spec and implements the ability to observe an object and all its sub-objects with a single call.

# Installation

npm install proxy-observe

Or, copy the contents of dist/proxy-observe.js to your local machine and include it like you would any Javascript file. Except for Chrome, which has native support for Object.observe and does not need to use Proxy, you will need to get a shim for Proxy if your browser does not support it.

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

Item one above can be re-mediated over time (Hopefully the browser vendors will finish implementing the spec and we won't have to do this re-mediation). 

We believe item three is a small price to pay. Our implementation is also less than 175 lines of code and 3K including Array.observe and Object.deepObserve vs. over 500 lines of code and 28K for MaxArt2501 covering just Object.observe.

There is an additional implementation at https://github.com/joelgriffith/object-observe-es5. This implementation is synchronous and modifies all object properties to have custom getters and setters. This could really bind up your application if there are a lot of changes to objects. It also only monitors enumerable properties and like the MaxArt2501 implementation is several hundred lines of code.

Anyway, now you have a choice MaxArt2501, Joel Griffith or AnyWhichWay, and choice is good! They all have their pros and cons.

# What's Implemented and Not

You can observe for ["add", "update", "delete", "reconfigure", "setPrototype","preventExtensions"] using Object.observe.

You can observe for ["add", "update", "delete", "splice"] using Array.observe.

Object.getNotifier and Object.deliverChangeRecords are not implemented.

Currently Object.deepObserve does not support event type selectivity. All events are monitored. There is also no Object.deepUnobserve.

# Release History

v0.0.5 2015-11-07 Fixed issue with testing for existence of Proxy object. Consider this a BETA.

v0.0.4 2015-10-03 Fixed issue with deepObserve discovered during code walkthrough. Issue would have impacted non-Chrome browsers. Consider this a BETA.

v0.0.3 2015-10-01 Updated README. No unit tests yet. Consider this a BETA.

v0.0.2 2015-10-01 Added Object.deepObserve and Array.observe. No unit tests yet. Consider this a BETA.

v0.0.1 2015-10-01 Initial release. No unit tests yet. Consider this a BETA.



# License

MIT License - see LICENSE file
