//
//  TinCanDesktopAppDelegate.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/7/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TinCanDesktopAppDelegate.h"


@implementation TinCanDesktopAppDelegate
@synthesize txtLrsUrl;
@synthesize txtJson;
@synthesize txtActorEmail;
@synthesize txtActorName;
@synthesize txtObjectToCreate;
@synthesize btnGetStatements;
@synthesize btnAddCreateStatement;
@synthesize btnAddStatementToQueue;
@synthesize btnPostQueueToServer;
@synthesize txtQueue;

@synthesize txtQueueLabel;

@synthesize window;

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{

    [txtLrsUrl setStringValue:@"http://beta.projecttincan.com/TCAPI/brogers"];

    tcRequest = [[TCRequest alloc] initWithEndPoint:txtLrsUrl.stringValue withUsername:@"brogers" withPassword:@"password"];
    statementQueue = [[TCStatementQueue alloc] init];
}


- (IBAction)AddCreateStatement:(id)sender {
       
    statement = [[TCStatement alloc] initWithVerb:TCVerb_Created];
    statement.actor = [[TCActor alloc] initWithName:txtActorName.stringValue withMbox:txtActorEmail.stringValue];
    statement.verb = TCVerb_Created;
    statement.object = [[TCObject alloc] initWithId:txtObjectToCreate.stringValue];
    // beta.projecttincan.com doesn't yet support these LangStrings
    //[statement.object setDefinitionName:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"http://www.scorm.com"]];
    //[statement.object setDefinitionDescription:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"A website all about SCORM"]];
    
    [tcRequest putStatement:statement withDelegate:self];
    
}

- (IBAction)GetStatements:(id)sender {

    [txtJson setStringValue:@"Loading Statements..."];
    [tcRequest getStatementsWithDelegate:self];
    
}

- (IBAction)AddStatementToQueue:(id)sender {
    TCStatement *statement1 = [[TCStatement alloc] initWithVerb:TCVerb_Created];
    statement1.actor = [[TCActor alloc] initWithName:txtActorName.stringValue withMbox:txtActorEmail.stringValue];
    statement1.verb = TCVerb_Created;
    statement1.object = [[TCObject alloc] initWithId:txtObjectToCreate.stringValue];
    
    [statementQueue addStatementToQueue:statement1];
    
    [txtQueueLabel setStringValue:[NSString stringWithFormat:@"Queue Count: %d",[statementQueue statementCount]]];
    [txtQueue setStringValue:[statementQueue jsonString]];
}

- (IBAction)PostQueueToServer:(id)sender {
    [tcRequest postStatementQueue:statementQueue withDelegate:self];
}

- (void) requestCompleted:(TCResponse *)response
{
    // Log some stuff here...
    NSLog(@"isNoContent = %@\n", ([response isNoContent] ? @"YES" : @"NO")); //look for a 204 - NoContent as the proper response
    NSLog(@"isOk = %@\n", ([response isOK] ? @"YES" : @"NO")); //look for a 200 - as the proper response for a get statements
    NSLog(@"URL : %@",[[[response request] URL] path]);
    NSLog(@"HTTPMethod : %@",[[response request] HTTPMethod]);
    
    NSString *path = [NSString stringWithFormat:@"%@",[[[response request] URL] path]];
    
    if ([response isOK] && [path hasSuffix:@"/statements"] && [[[response request] HTTPMethod] isEqualToString:@"GET"])  {
        //this should be the GET statements call
        [self.txtJson setStringValue:[response bodyAsString]];
        SBJsonParser *parser = [[SBJsonParser alloc] init];
        NSDictionary *statements = [parser objectWithString:[response bodyAsString]];
        NSLog(@"%lu",[[statements valueForKey:@"statements"] count]); //count the statements
        
        for (NSDictionary *dict in [statements valueForKey:@"statements"]) {
            NSLog([dict valueForKey:@"id"]);
            TCStatement *newStatement = [[TCStatement alloc] initWithDictionary:dict];
            NSLog([newStatement verbToString:newStatement.verb]);
        }
        
    }else if ([response isOK] && [path hasSuffix:@"/statements"] && [[[response request] HTTPMethod] isEqualToString:@"POST"])
    {
        //this is a POST of statements
        //clear the queue
        [statementQueue removeAllStatements];
        [txtQueueLabel setStringValue:[NSString stringWithFormat:@"Queue Count: %d",[statementQueue statementCount]]];
        [txtQueue setStringValue:[statementQueue jsonString]];
        
    }else if ([response isNoContent] && [[[response request] HTTPMethod] isEqualToString:@"PUT"])
    {
        //this is a PUT of a single statement
        
    }
}

- (void)dealloc {
    [statementQueue release];
    [super dealloc];
}

@end
