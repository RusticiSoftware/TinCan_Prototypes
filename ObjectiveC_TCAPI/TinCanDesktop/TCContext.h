//
//  TCContext.h
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TCContext : NSObject
{
    NSString *_registration;
    NSString *_instructor;
    NSString *_team;
    NSMutableDictionary *_contextActivities;
    NSMutableDictionary *_revision;
    NSMutableDictionary *_platform;
    NSString *_language;
    NSMutableDictionary *_statement;
    NSMutableDictionary *_extensions;
}

@property(readwrite,assign) NSString *_registration;
@property(readwrite,assign) NSString *_instructor;
@property(readwrite,assign) NSString *_team;
@property(readwrite,assign) NSMutableDictionary *_contextActivities;
@property(readwrite,assign) NSMutableDictionary *_revision;
@property(readwrite,assign) NSMutableDictionary *_platform;
@property(readwrite,assign) NSString *_language;
@property(readwrite,assign) NSMutableDictionary *_statement;
@property(readwrite,assign) NSMutableDictionary *_extensions;

-(id)initWithDictionary:(NSDictionary*)dictionaryForInit;
-(NSDictionary*)serializedDictionary;

-(void) setRegistration:(NSString*)registration;

@end
