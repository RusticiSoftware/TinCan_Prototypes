//
//  TCActor.h
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TCActor : NSObject
{
    NSMutableArray *names;
    NSMutableArray *mboxes;
}   

-(void)addName:(NSString *)name;
-(void)addMbox:(NSString *)mbox;

-(id)initWithName:(NSString*)name withMbox:(NSString*)mbox;
- (id)initWithDictionary:(NSDictionary*)dictionaryForInit;
-(NSDictionary*)serializedDictionary;

@end
