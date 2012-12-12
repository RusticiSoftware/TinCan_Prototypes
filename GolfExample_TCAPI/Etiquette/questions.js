test.AddQuestion(
    new Question (
        GolfExample.CourseActivity.id + "/GolfAssessment/interactions.etiquette_1",
        "When another player is attempting a shot, it is best to stand:",
        QUESTION_TYPE_CHOICE,
        ["On top of his ball", "Directly in his line of fire", "Out of the player's line of sight"],
        "Out of the player's line of sight",
        "obj_etiquette")
);

test.AddQuestion(
    new Question (
        GolfExample.CourseActivity.id + "/GolfAssessment/interactions.etiquette_2",
        "Generally sand trap rakes should be left outside of the hazard",
        QUESTION_TYPE_TF,
        null,
        true,
        "obj_etiquette"
    )
);

test.AddQuestion(
    new Question (
        GolfExample.CourseActivity.id + "/GolfAssessment/interactions.etiquette_3",
        "The player with the best score on previous hole tees off:",
        QUESTION_TYPE_CHOICE,
        ["First", "Last", "With a putter"],
        "First",
        "obj_etiquette"
    )
);
