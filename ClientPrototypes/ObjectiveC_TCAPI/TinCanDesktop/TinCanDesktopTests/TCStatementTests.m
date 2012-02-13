//
//  TCStatementTests.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/12/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TCStatementTests.h"

@implementation TCStatementTests

- (void)setUp
{
    [super setUp];
    // Set-up code here.
    statement = [[TCStatement alloc] initWithVerb:TCVerb_Created];
    statement.actor = [[TCActor alloc] initWithName:@"Brian" withMbox:@"brian.rogers@scorm.com"];
    statement.object = [[TCObject alloc] initWithId:@"http://www.scorm.com"];
    [statement.object setDefinitionName:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"http://www.scorm.com"]];
    [statement.object setDefinitionDescription:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"A website all about SCORM"]];
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

- (void)testJsonString
{
    
    NSLog(@"statement json : %@", [statement jsonString]);
}

- (void)dealloc {
    [statement release];
    [super dealloc];
}
@end
