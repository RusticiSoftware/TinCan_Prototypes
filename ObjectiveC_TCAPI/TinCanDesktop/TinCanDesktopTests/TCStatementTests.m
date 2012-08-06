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
    
    statement2 = [[TCStatement alloc] initWithVerb:TCVerb_Created];
    statement2.actor = [[TCActor alloc] initWithName:@"Brian" withMbox:@"brian.rogers@scorm.com"];
    statement2.object = [[TCObject alloc] initWithId:@"http://www.google.com"];
    [statement2.object setDefinitionName:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"http://www.google.com"]];
    [statement2.object setDefinitionDescription:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"A website for searching for stuff"]];
    [statement2.result setScaledScore:@"1.0" withRawScore:@"100" withMaxScore:@"100" withMinScore:@"0"];
    [statement2.result setSuccess:@"true"];
    [statement2.result setCompletion:@"completed"];
    
    [statement2.context setRegistration:@"reg123"];
    
    queue = [[TCStatementQueue alloc] init];
    [queue addStatementToQueue:statement];
    [queue addStatementToQueue:statement2];
}

- (void)tearDown
{
    // Tear-down code here.
    
    [super tearDown];
}

- (void)testJsonString
{
    
    NSLog(@"statement json : %@", [statement jsonString]);
    NSLog(@"statementQueue json : %@", [queue jsonString]);
}


- (void)dealloc {
    [statement release];
    [super dealloc];
}
@end
