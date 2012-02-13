//
//  TinCanDesktopAppDelegate.m
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/7/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import "TinCanDesktopAppDelegate.h"


@implementation TinCanDesktopAppDelegate
@synthesize txtJson;
@synthesize txtActorEmail;
@synthesize txtActorName;
@synthesize txtObjectToCreate;
@synthesize btnGetStatements;
@synthesize btnAddCreateStatement;

@synthesize window;
@synthesize txtLrsUrl;

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{

    [txtLrsUrl setStringValue:@"http://beta.projecttincan.com/TCAPI/brogers"];

    tcRequest = [[TCRequest alloc] initWithEndPoint:txtLrsUrl.stringValue withUsername:@"brogers" withPassword:@"password"];

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

- (void) requestCompleted:(TCResponse *)response
{
    NSLog(@"isNoContent = %@\n", ([response isNoContent] ? @"YES" : @"NO")); //look for a 204 - NoContent as the proper response
    
    NSLog(@"isOk = %@\n", ([response isOK] ? @"YES" : @"NO")); //look for a 200 - as the proper response for a get statements
    NSLog(@"URL : %@",[[[response request] URL] path]);
    NSString *path = [NSString stringWithFormat:@"%@",[[[response request] URL] path]];
    if ([response isOK] && [path hasSuffix:@"/statements"])  {
        //this should be the get statements call
        [self.txtJson setStringValue:[response bodyAsString]];
    }
}

- (void)dealloc {
    [statement release];
    [super dealloc];
}

@end
