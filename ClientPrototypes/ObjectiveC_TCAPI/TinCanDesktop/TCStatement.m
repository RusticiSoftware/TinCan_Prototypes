//
//  TCStatement.m
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCStatement.h"

@implementation TCStatement

@synthesize statementid,actor,verb,object,result,context,timestamp;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
        statementid = [self generateUuidString];
        actor = [[TCActor alloc] init];
        object = [[TCObject alloc] init];
    }
    
    return self;
}

- (id)initWithVerb:(TCVerb)verbForInit
{
    self = [super init];
    self = [self init];
    if (self) {
        [self setVerb:verbForInit];
    }
    
    return self;
}

- (NSString*)VerbToString:(TCVerb)verbToConvert {
    NSString *output = nil;
    switch(verbToConvert) {
        case TCVerb_Created:
            output = @"created";
            break;
        case TCVerb_Completed:
            output = @"completed";
            break;
        case TCVerb_Failed:
            output = @"failed";
            break;
        case TCVerb_Passed:
            output = @"passed";
            break;
        case TCVerb_Answered:
            output = @"answered";
            break;
        case TCVerb_Attemped:
            output = @"attempted";
            break;
        case TCVerb_Attended:
            output = @"attended";
            break;
        case TCVerb_Imported:
            output = @"imported";
            break;
        case TCVerb_Interacted:
            output = @"interacted";
            break;
        case TCVerb_Experienced:
            output = @"experienced";
            break;
        default:
            [NSException raise:NSGenericException format:@"Unexpected Verb."];
    }
    return output;
}

- (NSDictionary*)serializedDictionary {
 
    NSMutableDictionary* statement = [[NSMutableDictionary alloc] init];
    
    [statement setObject:statementid forKey:@"id"];
    [statement setObject:[self VerbToString:verb] forKey:@"verb"];
    
    [statement setObject:[actor serializedDictionary] forKey:@"actor"];
    [statement setObject:[object serializedDictionary] forKey:@"object"];
    
    [statement autorelease];
    return statement;
}


- (NSString*)jsonString {
    id<RKParser> parser = [[RKParserRegistry sharedRegistry] parserForMIMEType:RKMIMETypeJSON];
    NSError *error = nil;
    NSString *json = [parser stringFromObject:[self serializedDictionary] error:&error]; 
    if (error == nil) {
        return json;
    }else{
        return [error description];
    }
}

// return a new autoreleased UUID string
- (NSString *)generateUuidString
{
    // create a new UUID which you own
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    // create a new CFStringRef (toll-free bridged to NSString)
    // that you own
    NSString *uuidString = (NSString *)CFUUIDCreateString(kCFAllocatorDefault, uuid);
    // transfer ownership of the string
    // to the autorelease pool
    [uuidString autorelease];
    // release the UUID
    CFRelease(uuid);
    return uuidString;
}

- (void)dealloc {
    [super dealloc];
}

- (void)objectLoader:(RKObjectLoader*)objectLoader didFailWithError:(NSError*)error
{
    
}

@end
