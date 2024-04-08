// We use this file for any variable that used in multiple test files.
// Bcz when we import a var from another test file, it will be executed before the current test file.

/**
 * Mock suggestions data for address field.
 */
export const mockSuggestionAddressesData = [
    {
        description: 'Rue Général Lotz 37, Uccle, Belgique',
        place_id: 'ChIJKwNqoPnEw0cRIwMwh9SYOkI',
        structured_formatting: {
            main_text: 'Rue Général Lotz 37',
            secondary_text: 'Uccle, Belgique',
            main_text_matched_substrings: [
                {
                    length: 7,
                    offset: 0,
                },
                {
                    length: 2,
                    offset: 17,
                },
            ],
        },
    },
    {
        description: '37 Rue Général de Larminat, Bordeaux, France',
        place_id: 'ChIJUXSNwe0nVQ0RJu1MfaIwZbY',
        structured_formatting: {
            main_text: '37 Rue Général de Larminat',
            secondary_text: 'Bordeaux, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
    {
        description: '37 Rue Général Mangin, Grenoble, France',
        place_id: 'ChIJo1WQ1pn0ikcR8eXMBbeo_5s',
        structured_formatting: {
            main_text: '37 Rue Général Mangin',
            secondary_text: 'Grenoble, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
    {
        description: '37 Rue Genton, Lyon, France',
        place_id: 'ChIJTy9oE_LB9EcR7mmGhV5S1dY',
        structured_formatting: {
            main_text: '37 Rue Genton',
            secondary_text: 'Lyon, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
]
