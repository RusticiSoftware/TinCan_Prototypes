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
#import "TCStatement.h"
#import "TCRequest.h"
#import "TCResponse.h"

@interface TinCanDesktopAppDelegate : NSObject <NSApplicationDelegate, TCRequestDelegate> {
    NSWindow *window;
    NSTextField *txtLrsUrl;
    NSTextField *txtJson;
    NSTextField *txtActorEmail;
    NSTextField *txtActorName;
    NSTextField *txtObjectToCreate;
    NSButton *btnGetStatements;
    NSButton *btnAddCreateStatement;
    RKClient *client;
    
    TCStatement *statement;
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

- (IBAction)AddCreateStatement:(id)sender;

- (IBAction)GetStatements:(id)sender;

- (void) requestCompleted: (TCResponse*)response;

@end
