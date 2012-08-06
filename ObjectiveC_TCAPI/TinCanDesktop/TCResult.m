//
//  TCResult.m
//  TinCanConnector
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCResult.h"

@implementation TCResult

@synthesize _score,_success,_duration,_response,_completion,_extensions;

- (id)init
{
    self = [super init];
    if (self) {
        _score = [[NSMutableDictionary alloc] init];
        _extensions = [[NSMutableDictionary alloc] init];
    }
    
    return self;
}

-(void)setScaledScore:(NSString*)scaledScore withRawScore:(NSString*)rawScore withMaxScore:(NSString*)maxScore withMinScore:(NSString*)minScore
{
    [_score setObject:scaledScore forKey:@"scaled"];
    [_score setObject:rawScore forKey:@"raw"];
    [_score setObject:maxScore forKey:@"max"];
    [_score setObject:minScore forKey:@"min"];
}

-(void)setSuccess:(NSString*)success
{
    _success = success;
}

-(void)setCompletion:(NSString*)completion
{
    _completion = completion;
}

-(void)setResponse:(NSString*)response
{
    _response = response;
}

-(void)setDuration:(NSString*)duration
{
    _duration = duration;
}

-(NSMutableDictionary*)serializedDictionary
{
    NSMutableDictionary *result = [[[NSMutableDictionary alloc] init] autorelease];
    
    [result setValue:_score forKey:@"score"];
    [result setValue:_success forKey:@"success"];
    [result setValue:_duration forKey:@"duration"];
    [result setValue:_response forKey:@"response"];
    [result setValue:_completion forKey:@"completion"];
    [result setValue:_extensions forKey:@"extensions"];
    
    return result;
}

-(void)dealloc
{
    [_score dealloc];
    [_extensions dealloc];
    [super dealloc];
}

@end
