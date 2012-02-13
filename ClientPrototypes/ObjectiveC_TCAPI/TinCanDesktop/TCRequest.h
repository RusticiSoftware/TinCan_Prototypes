//
//  TCRequest.h
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TCStatement.h"
#import "TCResponse.h"
#import <RestKit/RestKit.h>
#import <RestKit/RKRequestSerialization.h>
#import "RestKit/RKObjectMapping.h"
#import "RestKit/RKObjectLoader.h"
#import "RestKit/RKObjectManager.h"

@protocol TCRequestDelegate <NSObject>
@required
- (void) requestCompleted: (TCResponse*)response;
@end

@interface TCRequest : NSObject <RKRequestDelegate, RKObjectLoaderDelegate>
{
    id <TCRequestDelegate> _delegate;
    
    NSString *_endpoint;
    TCStatement *_statement;
    RKClient *_client;
}

@property (retain) id _delegate;

- (id)initWithEndPoint:(NSString*)endpoint withUsername:(NSString*)username withPassword:(NSString*)password;
- (void)putStatement:(TCStatement*)statement withDelegate:(id)delegate;
- (void)getStatementsWithDelegate:(id)delegate;

- (void)objectLoader:(RKObjectLoader*)objectLoader didLoadObjects:(NSArray*)objects;

@end
