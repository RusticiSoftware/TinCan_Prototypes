//
//  TCStatementQueue.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCStatementQueue.h"

@implementation TCStatementQueue
@synthesize _statementQueue = statementQueue;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
        _statementQueue = [[NSMutableArray alloc] init];
    }
    
    return self;
}

- (void) addStatementToQueue:(TCStatement*)statementToAdd
{
    [_statementQueue addObject:statementToAdd];
}

- (NSUInteger) statementCount
{
    return [_statementQueue count];
}

- (void) postAndClearQueue
{
    
}

- (void) removeAllStatements
{
    [_statementQueue removeAllObjects];
}

- (NSString*)jsonString {
    
    NSMutableArray *serializedArray = [[NSMutableArray alloc] init];
    
    for (TCStatement *statement in _statementQueue) {
        [serializedArray addObject:[statement serializedDictionary]];
    }
    
    id<RKParser> parser = [[RKParserRegistry sharedRegistry] parserForMIMEType:RKMIMETypeJSON];
    NSError *error = nil;
    NSString *json = [parser stringFromObject:serializedArray error:&error]; 
    if (error == nil) {
        return json;
    }else{
        return [error description];
    }
}

@end
