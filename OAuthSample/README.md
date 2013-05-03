OAuth Tester Page
=================

This prototype provides a small and simple page for testing
the OAuth compatibility of a Tin Can endpoint. 

In light of remaining simple, this page does not make special
provisions for Internet Explorer. Because of this, if you plan
to test an endpoint which is in another domain than where this test
page is served, please use a browser with modern CORS support
such as Firefox or Chrome.

At the time of this writing, this prototype only provides testing
for the "Registered Application + Known User" scenario outlined in
the Tin Can spec. This means the full 3-legged OAuth handshake will
be exercised (initiate, authorize, token).
