//
//  TCResponse.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

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
	return [NSHTTPURLResponse localizedStringForStatusCode:[self statusCode]];
}

- (NSData *)body {
	return _body;
}

- (NSString *)bodyEncodingName {
    return [_httpURLResponse textEncodingName];    
}

- (NSStringEncoding)bodyEncoding {
    CFStringEncoding cfEncoding = kCFStringEncodingInvalidId;    
    NSString *textEncodingName = [self bodyEncodingName];
    if (textEncodingName) {
        cfEncoding = CFStringConvertIANACharSetNameToEncoding((CFStringRef) textEncodingName);
    }
    return (cfEncoding ==  kCFStringEncodingInvalidId) ? NSUTF8StringEncoding : CFStringConvertEncodingToNSStringEncoding(cfEncoding);
}

- (NSString *)bodyAsString {
	return [[[NSString alloc] initWithData:self.body encoding:[self bodyEncoding]] autorelease];
}


- (NSString*)failureErrorDescription {
	if ([self isFailure]) {
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
	return ([self statusCode] < 100 || [self statusCode] > 600);
}

- (BOOL)isInformational {
	return ([self statusCode] >= 100 && [self statusCode] < 200);
}

- (BOOL)isSuccessful {
	return (([self statusCode] >= 200 && [self statusCode] < 300) || ([self wasLoadedFromCache]));
}

- (BOOL)isRedirection {
	return ([self statusCode] >= 300 && [self statusCode] < 400);
}

- (BOOL)isClientError {
	return ([self statusCode] >= 400 && [self statusCode] < 500);
}

- (BOOL)isServerError {
	return ([self statusCode] >= 500 && [self statusCode] < 600);
}

- (BOOL)isError {
	return ([self isClientError] || [self isServerError]);
}

- (BOOL)isOK {
	return ([self statusCode] == 200);
}

- (BOOL)isCreated {
	return ([self statusCode] == 201);
}

- (BOOL)isNoContent {
	return ([self statusCode] == 204);
}

- (BOOL)isNotModified {
	return ([self statusCode] == 304);
}

- (BOOL)isUnauthorized {
	return ([self statusCode] == 401);
}

- (BOOL)isForbidden {
	return ([self statusCode] == 403);
}

- (BOOL)isNotFound {
	return ([self statusCode] == 404);
}

- (BOOL)isConflict {
    return ([self statusCode] == 409);
}

- (BOOL)isGone {
    return ([self statusCode] == 410);
}

- (BOOL)isUnprocessableEntity {
	return ([self statusCode] == 422);
}

- (BOOL)isRedirect {
	return ([self statusCode] == 301 || [self statusCode] == 302 || [self statusCode] == 303 || [self statusCode] == 307);
}

- (BOOL)isEmpty {
	return ([self statusCode] == 201 || [self statusCode] == 204 || [self statusCode] == 304);
}

- (BOOL)isServiceUnavailable {
	return ([self statusCode] == 503);
}

- (NSString*)contentType {
	return ([[self allHeaderFields] objectForKey:@"Content-Type"]);
}

- (NSString*)contentLength {
	return ([[self allHeaderFields] objectForKey:@"Content-Length"]);
}

- (NSString*)location {
	return ([[self allHeaderFields] objectForKey:@"Location"]);
}

- (BOOL)isHTML {
	NSString* contentType = [self contentType];
	return (contentType && ([contentType rangeOfString:@"text/html"
											   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0 ||
                            [self isXHTML]));
}

- (BOOL)isXHTML {
	NSString* contentType = [self contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/xhtml+xml"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

- (BOOL)isXML {
	NSString* contentType = [self contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/xml"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

- (BOOL)isJSON {
	NSString* contentType = [self contentType];
	return (contentType &&
			[contentType rangeOfString:@"application/json"
							   options:NSCaseInsensitiveSearch|NSAnchoredSearch].length > 0);
}

@end
