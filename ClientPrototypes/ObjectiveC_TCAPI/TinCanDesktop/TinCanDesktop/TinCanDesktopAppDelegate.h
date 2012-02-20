//
//  TinCanDesktopAppDelegate.h
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/7/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <RestKit/RestKit.h>
#import <RestKit/RKRequestSerialization.h>
#import "TCConnector.h"
#import "SBJson.h"

@interface TinCanDesktopAppDelegate : NSObject <NSApplicationDelegate, TCRequestDelegate> {
    NSWindow *window;
    NSTextField *txtLrsUrl;
    NSTextField *txtJson;
    NSTextField *txtActorEmail;
    NSTextField *txtActorName;
    NSTextField *txtObjectToCreate;
    NSButton *btnGetStatements;
    NSButton *btnAddCreateStatement;
    
    NSTextField *txtQueue;
    NSTextField *txtQueueLabel;
    NSButton *btnAddStatementToQueue;
    NSButton *btnPostQueueToServer;
    
    TCStatement *statement;
    TCStatement *statement2;
    TCStatementQueue *statementQueue;
    TCRequest *tcRequest;
    
    
}

@property (assign) IBOutlet NSWindow *window;

@property (assign) IBOutlet NSTextField *txtLrsUrl;

@property (assign) IBOutlet NSTextField *txtJson;

@property (assign) IBOutlet NSTextField *txtActorEmail;

@property (assign) IBOutlet NSTextField *txtActorName;

@property (assign) IBOutlet NSTextField *txtObjectToCreate;

@property (assign) IBOutlet NSButton *btnGetStatements;

@property (assign) IBOutlet NSButton *btnAddCreateStatement;

@property (assign) IBOutlet NSTextField *txtQueue;
@property (assign) IBOutlet NSTextField *txtQueueLabel;
@property (assign) IBOutlet NSButton *btnAddStatementToQueue;
@property (assign) IBOutlet NSButton *btnPostQueueToServer;

- (IBAction)AddCreateStatement:(id)sender;

- (IBAction)GetStatements:(id)sender;

- (IBAction)AddStatementToQueue:(id)sender;
- (IBAction)PostQueueToServer:(id)sender;

- (void) requestCompleted: (TCResponse*)response;

@end
