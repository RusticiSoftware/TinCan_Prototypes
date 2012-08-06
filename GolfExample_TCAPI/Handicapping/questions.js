
test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.handicap_1",
                                "Which formula is used to calculate the 'course handicap'?", 
                                QUESTION_TYPE_CHOICE,
                                new Array("Course Handicap = Handicap index + number of holes * number of lost balls in last round", "Course Handicap = Number of years experience / annual equipment spending", "Course Handicap = Handicap index * Slope Rating / 113"),
                                "Course Handicap = Handicap index * Slope Rating / 113",
                                "obj_handicapping")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.handicap_2",
                                "Golfer A has a course handicap of 6. Golfer B has a course handicap of 10. Golfer A shoots an 81. Golfer B shoots an 84. Golfer B wins the match be how many strokes?", 
                                QUESTION_TYPE_NUMERIC,
                                null,
                                1,
                                "obj_handicapping")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.handicap_3",
                                "A 'scratch golfer' has a handicap of ___",
                                QUESTION_TYPE_NUMERIC,
                                null,
                                0,
                                "obj_handicapping")
                );

test.AddQuestion( new Question ("com.scorm.golfsamples.interactions.handicap_4",
                                "Golfer A has a course handicap of 3. Golfer B has a course handicap of 28. On the 6th handicap hole, how many strokes will Golfer A have to give Golfer B in match play?",
                                QUESTION_TYPE_NUMERIC,
                                null,
                                2,
                                "obj_handicapping")
                );

