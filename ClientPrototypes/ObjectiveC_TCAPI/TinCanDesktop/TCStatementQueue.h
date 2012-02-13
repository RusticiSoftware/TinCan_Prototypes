//
//  TCStatementQueue.h
//  TinCanDesktop
//
//  Created by Brian Rogers on 2/11/12.
//  Copyright 2012 Rustici Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TCStatementQueue : NSObject
{
    NSMutableArray *_statementQueue;
}

@property (readwrite,assign) NSMutableArray *_statementQueue;

@end
