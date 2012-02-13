//
//  TCObject.m
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCObject.h"

@implementation TCObject

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
        _definition = [[NSMutableDictionary alloc]init];
        _objectId = [[NSString alloc] init];
    }
    
    return self;
}

- (id)initWithId:(NSString *)objectId
{
    self = [super init];
    if (self) {
        // Initialization code here.
        _definition = [[NSMutableDictionary alloc]init];
        _objectId = [[NSString alloc] init];
        _objectId = objectId;
    }
    
    return self;
}

-(NSDictionary*)serializedDictionary {
    NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
    [object setObject:_objectId forKey:@"id"];
    [object setObject:_definition forKey:@"definition"];
    [object autorelease];
    return object;
}

-(void)setDefinitionName:(TCLanguageMap*)name {
    [_definition setObject:[name serializedDictionary] forKey:@"name"];
}

-(void)setDefinitionDescription:(TCLanguageMap*)description{
    [_definition setObject:[description serializedDictionary] forKey:@"description"];
}

-(void)setDefinitionType:(NSString*)type{
    [_definition setObject:type forKey:@"type"];
}

-(void)setDefinitionInteractionType:(NSString*)interactionType{
    [_definition setObject:interactionType forKey:@"interactionType"];
}

-(void)setDefinitionCorrectResponsesPattern:(NSString*)correctResponsesPattern{
    [_definition setObject:correctResponsesPattern forKey:@"correctResponsesPattern"];
}

-(void)setDefinitionExtensions:(NSString*)extensions{
    [_definition setObject:extensions forKey:@"extensions"];
}

@end
