//
//  TCStatementTests.h
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/12/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <SenTestingKit/SenTestingKit.h>
#import "TCConnector.h"

@interface TCStatementTests : SenTestCase
{
    TCStatement *statement;
    TCStatement *statement2;
    TCStatementQueue *queue;
}

- (void)testJsonString;

@end
