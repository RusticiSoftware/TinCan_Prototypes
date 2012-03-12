//
//  TCLanguageMap.h
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/10/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TCLanguageMap : NSObject
{
    NSString *_language;
    NSString *_text;
}

@property (readwrite, copy) NSString *_language;
@property (readwrite, copy) NSString *_text;

- (id)initWithLanguage:(NSString*)language withString:(NSString*)text;

- (NSDictionary*)serializedDictionary;

@end
