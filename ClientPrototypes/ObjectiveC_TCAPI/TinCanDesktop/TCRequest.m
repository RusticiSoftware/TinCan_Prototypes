//
//  TCRequest.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCRequest.h"

@implementation TCRequest

@synthesize _delegate;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
    }
    
    return self;
}

- (id)initWithEndPoint:(NSString*)endpoint withUsername:(NSString*)username withPassword:(NSString*)password {
    self = [super init];
    if (self) {
        // Initialization code here.
         _endpoint = endpoint;
        _client = [RKClient clientWithBaseURL:_endpoint username:username password:password];
        
    }
    
    return self;
}

- (void)putStatement:(TCStatement*)statement withDelegate:(id)delegate
{
    _delegate = delegate;
    
    NSString *json = [statement jsonString];

    
    [_client put:[NSString stringWithFormat:@"/statements/?statementId=%@",statement.statementid] params:[RKRequestSerialization serializationWithData:[json dataUsingEncoding:NSUTF8StringEncoding] MIMEType:RKMIMETypeJSON] delegate:self];
}

- (void)getStatementsWithDelegate:(id)delegate {
    _delegate = delegate;
    [_client get:@"/statements/" delegate:self];
}

- (void)objectLoader:(RKObjectLoader *)objectLoader didFailWithError:(NSError *)error
{
    NSLog(@"an error happend %@", [error description]);
}
- (void)objectLoaderDidFinishLoading:(RKObjectLoader *)objectLoader
{
    NSLog(@"finished loading objects");
}

- (void)objectLoader:(RKObjectLoader*)objectLoader didLoadObjects:(NSArray*)objects {
    
}

//RestKit response delegate
- (void)request:(RKRequest*)request didLoadResponse:(RKResponse *)response {
    //NSLog(@"method %@", [request HTTPMethod] );
    //NSLog(@"status code %ld", response.statusCode);
    
    //NSLog(request.resourcePath);
    //NSLog(@"Loaded JSON: %@", [response bodyAsString]);
    
    TCResponse *tcResponse = [[TCResponse alloc]initWithRequest:request withResponse:response];

    [tcResponse autorelease];
    
    [_delegate requestCompleted:tcResponse];
    
}

- (void)dealloc {
    [_client release];
    [super dealloc];
}


@end
