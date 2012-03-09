//
//  TCResponse.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//
// this class really is just a copy of the RKResponse object, 
// but is here so that another lib could be used instead of RestKit

#import "TCResponse.h"

@implementation TCResponse

@synthesize body = _body, request = _request, failureError = _failureError;

- (id)init {
    self = [super init];
	if (self) {
		_body = [[NSMutableData alloc] init];
		_failureError = nil;
		_loading = NO;
		_responseHeaders = nil;
	}
    
	return self;
}


- (id)initWithRequest:(RKRequest*)request withResponse:(RKResponse*)response {
    self = [self init];
	if (self) {
		_request = request;
        _response = response;
	}
    
	return self;
}

- (void)dealloc {
	[_httpURLResponse release];
	_httpURLResponse = nil;
	[_body release];
	_body = nil;
	[_failureError release];
	_failureError = nil;
	[_responseHeaders release];
	_responseHeaders = nil;
	[super dealloc];
}

- (BOOL)hasCredentials {
    return _request.username && _request.password;
}


- (NSString*)localizedStatusCodeString {
	return [NSHTTPURLResponse localizedStringForStatusCode:[_response statusCode]];
}

- (NSData *)body {
	return _body;
}

- (NSString *)bodyEncodingName {
    return [_httpURLResponse textEncodingName];    
}

- (NSStringEncoding)bodyEncoding {
    CFStringEncoding cfEncoding = kCFStringEncodingInvalidId;    
    NSString *textEncodingName = [_response bodyEncodingName];
    if (textEncodingName) {
        cfEncoding = CFStringConvertIANACharSetNameToEncoding((CFStringRef) textEncodingName);
    }
    return (cfEncoding ==  kCFStringEncodingInvalidId) ? NSUTF8StringEncoding : CFStringConvertEncodingToNSStringEncoding(cfEncoding);
}

- (NSString *)bodyAsString {
	return [[[NSString alloc] initWithData:_response.body encoding:[_response bodyEncoding]] autorelease];
}


- (NSString*)failureErrorDescription {
	if ([_response isFailure]) {
		return [_failureError localizedDescription];
	} else {
		return nil;
	}
}

- (BOOL)wasLoadedFromCache {
	return (_responseHeaders != nil);
}

- (NSURL*)URL {
	return [_httpURLResponse URL];
}

- (NSString*)MIMEType {
	return [_httpURLResponse MIMEType];
}

- (NSInteger)statusCode {
    return ([_httpURLResponse respondsToSelector:@selector(statusCode)] ? [_httpURLResponse statusCode] : 200);
}

- (NSDictionary*)allHeaderFields {
    return ([_httpURLResponse respondsToSelector:@selector(allHeaderFields)] ? [_httpURLResponse allHeaderFields] : nil);
}

- (NSArray*)cookies {
	return [NSHTTPCookie cookiesWithResponseHeaderFields:self.allHeaderFields forURL:self.URL];
}

- (BOOL)isFailure {
	return (nil != _failureError);
}

- (BOOL)isInvalid {
	return ([_response statusCode] < 100 || [_response statusCode] > 600);
}

- (BOOL)isInformational {
	return ([_response statusCode] >= 100 && [_response statusCode] < 200);
}

- (BOOL)isSuccessful {
	return (([_response statusCode] >= 200 && [_response statusCode] < 300) || ([_response wasLoadedFromCache]));
}

- (BOOL)isRedirection {
	return ([_response statusCode] >= 300 && [_response statusCode] < 400);
}

- (BOOL)isClientError {
	return ([_response statusCode] >= 400 && [_response statusCode] < 500);
}

- (BOOL)isServerError {
	return ([_response statusCode] >= 500 && [_response statusCode] < 600);
}

- (BOOL)isError {
	return ([_response isClientError] || [_response isServerError]);
}

- (BOOL)isOK {
	return ([_response statusCode] == 200);
}

- (BOOL)isCreated {
	return ([_response statusCode] == 201);
}

- (BOOL)isNoContent {
	return ([_response statusCode] == 204);
}

- (BOOL)isNotModified {
	return ([_response statusCode] == 304);
}

- (BOOL)isUnauthorized {
	return ([_response statusCode] == 401);
}

- (BOOL)isForbidden {
	return ([_response statusCode] == 403);
}

- (BOOL)isNotFound {
	return ([_response statusCode] == 404);
}

- (BOOL)isConflict {
    return ([_response statusCode] == 409);
}

- (BOOL)isGone {
    return ([_response statusCode] == 410);
}

- (BOOL)isUnprocessableEntity {
	return ([_response statusCode] == 422);
}

- (BOOL)isRedirect {
	return ([_response statusCode] == 301 || [_response statusCode] == 302 || [_response statusCode] == 303 || [_response statusCode] == 307);
}

- (BOOL)isEmpty {
	return ([_response statusCode] == 201 || [_response statusCode] == 204 || [_response statusCode] == 304);
}

- (BOOL)isServiceUnavailable {
	return ([_response statusCode] == 503);
}

- (NSString*)contentType {
	return ([[_response allHeaderFields] objectForKey:@"Content-Type"]);
}

- (NSString*)contentLength {
	return ([[_response allHeaderFields] objectForKey:@"Content-Length"]);
}

- (NSString*)location {
	return ([[_response allHeaderFields] objectForKey:@"Location"]);
}

- (BOOL)isHTML {
	NSString* contentType = [_response contentType];
	return (contentType && ([contentType rangeOfString:@"text/html"
											   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0 ||
                            [_response isXHTML]));
}

- (BOOL)isXHTML {
	NSString* contentType = [_response contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/xhtml+xml"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

- (BOOL)isXML {
	NSString* contentType = [_response contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/xml"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

- (BOOL)isJSON {
	NSString* contentType = [_response contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/json"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

@end
