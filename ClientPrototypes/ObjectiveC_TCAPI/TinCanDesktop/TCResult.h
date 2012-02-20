//
//  TCResult.h
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TCResult : NSObject
{
    NSMutableDictionary *_score;
    NSString *_success;
    NSString *_completion;
    NSString *_response;
    NSString *_duration;
    NSMutableDictionary *_extensions;
}

@property (readwrite,assign) NSMutableDictionary *_score;
@property (readwrite,assign) NSString *_success;
@property (readwrite,assign) NSString *_completion;
@property (readwrite,assign) NSString *_response;
@property (readwrite,assign) NSString *_duration;
@property (readwrite,assign) NSMutableDictionary *_extensions;

-(void)setSuccess:(NSString*)success;
-(void)setCompletion:(NSString*)completion;
-(void)setResponse:(NSString*)response;
-(void)setDuration:(NSString*)duration;
-(void)setScaledScore:(NSString*)scaledScore withRawScore:(NSString*)rawScore withMaxScore:(NSString*)maxScore withMinScore:(NSString*)minScore;
-(NSMutableDictionary*)serializedDictionary;

@end
