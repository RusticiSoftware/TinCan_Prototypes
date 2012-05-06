test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.playing_1",
                                "The rules of golf are maintained by:",
                                QUESTION_TYPE_CHOICE,
                                new Array("The UN", "USGA and Royal and Ancient", "The PGA", "Each course has it's own rules"),
                                "USGA and Royal and Ancient",
                                "obj_playing")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.playing_2",
                                "A score of two under par on a given hole is known as a(n):",
                               QUESTION_TYPE_CHOICE,
                                new Array("opportunity for improvement", "birdie", "double bogie", "eagle"),
                                "eagle",
                                "obj_playing")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.playing_3",
                                "A typical golf course has ____ holes",
                                QUESTION_TYPE_NUMERIC,
                                null,
                                18,
                                "obj_playing")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.playing_4",
                                "In stableford scoring, the highest score wins.",
                                QUESTION_TYPE_TF,
                                null,
                                true,
                                "obj_playing")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.playing_5",
                                "Par for a 175 yard hole is typically:",
                                QUESTION_TYPE_NUMERIC,
                                null,
                                3,
                                "obj_playing")
                );
