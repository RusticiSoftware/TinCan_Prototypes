#Tin Can API wrapper for Objective-C

This code can be compiled for either desktop OS X or for iOS, you just need to have the proper version of RestKit installed

##Requirements
### RestKit for HTTP connection (can easily be replaced with other http lib)

## Sample Statement Code

To create a new statement and send it to your LRS you would use something like this:

	statement = [[TCStatement alloc] initWithVerb:TCVerb_Created];
    statement.actor = [[TCActor alloc] initWithName:@"Joe User" withMbox:@"joe.user@scorm.com"];
    statement.object = [[TCObject alloc] initWithId:@"http://www.scorm.com"];
    [statement.object setDefinitionName:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"http://www.scorm.com"]];
    [statement.object setDefinitionDescription:[[TCLanguageMap alloc] initWithLanguage:@"en-US" withString:@"A website that's all about SCORM"]];
	// send the statement to the LRS and assign this as the delegate (add the proper delegate callbacks)
	[tcRequest putStatement:statement withDelegate:self];

