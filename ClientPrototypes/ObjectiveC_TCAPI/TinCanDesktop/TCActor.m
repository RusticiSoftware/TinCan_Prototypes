//
//  TCActor.m
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCActor.h"

@implementation TCActor

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
        names = [[NSMutableArray alloc]init];
        mboxes = [[NSMutableArray alloc] init];
    }
    
    return self;
}

- (id)initWithName:(NSString *)name withMbox:(NSString *)mbox
{
    self = [super init];
    if (self) {
        // Initialization code here.
        names = [[NSMutableArray alloc]init];
        mboxes = [[NSMutableArray alloc] init];
        [self addName:name];
        [self addMbox:mbox];
    }
    
    return self;
}

- (id)initWithDictionary:(NSDictionary*)dictionaryForInit
{
    self = [super init];
    if (self) {
        names = [dictionaryForInit valueForKey:@"name"];
        mboxes = [dictionaryForInit valueForKey:@"mbox"];
    }
    
    return self;
}

-(void)addName:(NSString*)name {
    [names addObject:name];
}

-(void)addMbox:(NSString*)mbox {
    [mboxes addObject:mbox];
}

-(NSDictionary*)serializedDictionary {
    NSMutableDictionary *actor = [[NSMutableDictionary alloc] init];
    [actor setObject:names forKey:@"name"];
    [actor setObject:mboxes forKey:@"mbox"];
    [actor autorelease];
    return actor;
}

@end
