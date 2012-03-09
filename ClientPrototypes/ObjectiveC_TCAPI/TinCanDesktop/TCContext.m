//
//  TCContext.m
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCContext.h"

@implementation TCContext

@synthesize _registration,_instructor,_team,_language,_platform,_revision,_statement,_extensions,_contextActivities;

- (id)init
{
    self = [super init];
    if (self) {
        _registration = [NSString stringWithString:@""];
        _instructor = [NSString stringWithString:@""];;
        _team = [NSString stringWithString:@""];
        _contextActivities = [[NSMutableDictionary alloc] init];
        _revision = [[NSMutableDictionary alloc] init];
        _platform = [[NSMutableDictionary alloc] init];
        _language = [NSString stringWithString:@""];
        _statement = [[NSMutableDictionary alloc] init];
        _extensions = [[NSMutableDictionary alloc] init];
    }
    
    return self;
}

-(id)initWithDictionary:(NSDictionary*)dictionaryForInit
{
    self = [super init];
    if (self) {
        _registration = [dictionaryForInit valueForKey:@"registration"];
        _instructor = [dictionaryForInit valueForKey:@"instructor"];
        _team = [dictionaryForInit valueForKey:@"team"];
    }
    
    return self;
}

-(NSDictionary*)serializedDictionary {
    NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
    [object setObject:_registration forKey:@"registration"];
    [object setObject:_instructor forKey:@"instructor"];
    [object autorelease];
    return object;
}

-(void) setRegistration:(NSString*)registration
{
    _registration = registration;
}

@end
