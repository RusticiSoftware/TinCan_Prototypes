//
//  TCStatement.h
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <RestKit/RestKit.h>
#import <RestKit/RKRequestSerialization.h>
#import "TCActor.h"
#import "TCObject.h"
#import "TCResult.h"
#import "TCContext.h"

typedef enum {  TCVerb_Created,
                TCVerb_Completed,
                TCVerb_Passed,
                TCVerb_Failed,
                TCVerb_Experienced,
                TCVerb_Attended,
                TCVerb_Attemped,
                TCVerb_Answered,
                TCVerb_Interacted,
                TCVerb_Imported
} TCVerb;

@interface TCStatement : NSObject <RKObjectLoaderDelegate>

{
    RKClient *_client;
    
    NSString *statementid;
    TCActor *actor;
    TCVerb verb;
    BOOL _inprogress;
    TCObject *object;
    TCResult *result;
    TCContext *context;
    NSDate *timestamp;
    BOOL _stored;
    NSString *authority;
}

@property (readwrite, copy) NSString *statementid;
@property (readwrite,assign) TCActor *actor;
@property (readwrite) TCVerb verb;
@property (readwrite,assign) TCObject *object;
@property (readwrite,assign) TCResult *result;
@property (readwrite,assign) TCContext *context;
@property (readwrite, copy) NSDate *timestamp;

- (id)initWithVerb:(TCVerb)verb;
- (id)initWithDictionary:(NSDictionary*)dictionaryForInit;

-(void)setActor:(TCActor*)actor;
-(void)setObject:(TCObject*)object;

-(NSDictionary*)serializedDictionary;
-(NSString*)jsonString;
- (NSString*)verbToString:(TCVerb)verbToConvert;
- (TCVerb)stringToVerb:(NSString*)stringToConvert;
- (NSString *)generateUuidString;
@end
