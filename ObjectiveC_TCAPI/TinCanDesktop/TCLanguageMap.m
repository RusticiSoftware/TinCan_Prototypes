//
//  TCLanguageMap.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCLanguageMap.h"

@implementation TCLanguageMap

@synthesize _language, _text;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here.
    }
    
    return self;
}

- (id)initWithLanguage:(NSString*)language withString:(NSString*)text {
    
    self = [super init];
    if (self) {
        [self set_language:language];
        [self set_text:text];
    }
    
    return self;
}

-(NSDictionary*)serializedDictionary {
    NSMutableDictionary *langmap = [[NSMutableDictionary alloc] init];
    [langmap setObject:_text forKey:_language];
    [langmap autorelease];
    return langmap;
}

@end
