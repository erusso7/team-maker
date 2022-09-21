import {
    DefaultPrime,
    femaleFilter,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Player,
    seed,
    teamAVG,
    teamMedian,
    teamsFilter
} from "../index"


class Attendee implements Player {
    score: number
    gender: Gender

    constructor(score: number, gender: Gender) {
        this.score = score;
        this.gender = gender;
    }

    Score(): number {
        return this.score;
    }

    Gender(): Gender {
        return this.gender;
    }
}

const players = [
    new Attendee(2, Gender.male),
    new Attendee(10, Gender.female),
    new Attendee(9, Gender.male),
    new Attendee(1, Gender.female),
    new Attendee(3, Gender.female),
    new Attendee(5, Gender.male),
    new Attendee(8, Gender.female),
    new Attendee(7, Gender.female),
    new Attendee(4, Gender.male),
    new Attendee(6, Gender.male),
    new Attendee(3, Gender.male),
    new Attendee(2, Gender.female),
]


describe('main file', () => {
    it('should return a deterministic seed', () => {
        expect(seed({}, DefaultPrime)).toBe(8263)
    })

    it('should return the median', () => {
        expect(teamMedian(players)).toBe(8)
    })

    it('should return the average', () => {
        expect(teamAVG(players)).toBe(5)
    })

    describe('building teams from a player list', () => {
        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                [
                    new Attendee(5, Gender.male),
                    new Attendee(1, Gender.female),
                    new Attendee(3, Gender.male),
                    new Attendee(2, Gender.male),
                ],
                [
                    new Attendee(4, Gender.male),
                    new Attendee(2, Gender.female),
                    new Attendee(3, Gender.female),
                ]
            ]
            expect(teamsFilter(lowFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                [
                    new Attendee(10, Gender.female),
                    new Attendee(6, Gender.male),
                    new Attendee(8, Gender.female),
                ],
                [
                    new Attendee(9, Gender.male),
                    new Attendee(7, Gender.female),
                ]
            ]
            expect(teamsFilter(highFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                [
                    new Attendee(10, Gender.female),
                    new Attendee(1, Gender.female),
                    new Attendee(7, Gender.female),
                ],
                [
                    new Attendee(8, Gender.female),
                    new Attendee(2, Gender.female),
                    new Attendee(3, Gender.female),
                ]
            ]
            expect(teamsFilter(femaleFilter)(players, 2)).toEqual(expected)
        })
        it('should filter only men and return 2 teams', () => {
            const expected = [
                [
                    new Attendee(9, Gender.male),
                    new Attendee(2, Gender.male),
                    new Attendee(5, Gender.male),
                ],
                [
                    new Attendee(6, Gender.male),
                    new Attendee(3, Gender.male),
                    new Attendee(4, Gender.male),
                ]
            ]
            expect(teamsFilter(maleFilter)(players, 2)).toEqual(expected)
        })
    })

})
