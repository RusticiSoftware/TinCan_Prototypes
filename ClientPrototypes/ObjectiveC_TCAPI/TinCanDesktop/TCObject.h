//
//  TCObject.h
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TCLanguageMap.h"

@interface TCObject : NSObject
{
    NSString *_objectId;
    NSMutableDictionary *_definition;
    NSString *_objectType;
    
    
}

-(id)initWithId:(NSString*)objectId;

-(void)setDefinitionName:(TCLanguageMap*)name;
-(void)setDefinitionDescription:(TCLanguageMap*)description;
-(void)setDefinitionType:(NSString*)type;
-(void)setDefinitionInteractionType:(NSString*)type;
-(void)setDefinitionCorrectResponsesPattern:(NSString*)pattern;
-(void)setDefinitionExtensions:(NSString*)extensions;

-(NSDictionary*)serializedDictionary;

@end
