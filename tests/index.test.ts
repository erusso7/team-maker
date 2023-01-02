import {
    DefaultPrime,
    femaleFilter,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Position,
    seed,
    teamAVG,
    teamMedian,
    teamsFilter
} from "../index"

const players = [
    {score: 1, gender: Gender.female, pos: Position.defender},
    {score: 2, gender: Gender.male, pos: Position.defender},
    {score: 2, gender: Gender.female, pos: Position.attacker},
    {score: 3, gender: Gender.female, pos: Position.defender},
    {score: 3, gender: Gender.male, pos: Position.attacker},
    {score: 4, gender: Gender.male, pos: Position.attacker},
    {score: 5, gender: Gender.male, pos: Position.defender},
    {score: 6, gender: Gender.male, pos: Position.attacker},
    {score: 7, gender: Gender.female, pos: Position.attacker},
    {score: 8, gender: Gender.female, pos: Position.attacker},
    {score: 9, gender: Gender.male, pos: Position.defender},
    {score: 10, gender: Gender.female, pos: Position.defender},
]

describe('main file', () => {
    it('should return a deterministic seed', () => {
        expect(seed({}, DefaultPrime)).toBe(8263)
    })

    it('should return the median', () => {
        expect(teamMedian(players)).toBe(5)
    })

    it('should return the average', () => {
        expect(teamAVG(players)).toBe(5)
    })

    describe('building teams from a player list', () => {
        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                [
                    {score: 5, gender: Gender.male, pos: Position.defender},
                    {score: 1, gender: Gender.female, pos: Position.defender},
                    {score: 3, gender: Gender.female, pos: Position.defender},
                    {score: 2, gender: Gender.female, pos: Position.attacker},
                ],
                [
                    {score: 4, gender: Gender.male, pos: Position.attacker},
                    {score: 2, gender: Gender.male, pos: Position.defender},
                    {score: 3, gender: Gender.male, pos: Position.attacker},
                ]
            ]
            expect(teamsFilter(lowFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                [
                    {score: 10, gender: Gender.female, pos: Position.defender},
                    {score: 6, gender: Gender.male, pos: Position.attacker},
                    {score: 8, gender: Gender.female, pos: Position.attacker},
                ],
                [
                    {score: 9, gender: Gender.male, pos: Position.defender},
                    {score: 7, gender: Gender.female, pos: Position.attacker},
                ]
            ]
            expect(teamsFilter(highFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                [
                    {score: 10, gender: Gender.female, pos: Position.defender},
                    {score: 1, gender: Gender.female, pos: Position.defender},
                    {score: 7, gender: Gender.female, pos: Position.attacker},
                ],
                [
                    {score: 8, gender: Gender.female, pos: Position.attacker},
                    {score: 2, gender: Gender.female, pos: Position.attacker},
                    {score: 3, gender: Gender.female, pos: Position.defender},
                ]
            ]
            expect(teamsFilter(femaleFilter)(players, 2)).toEqual(expected)
        })
        it('should filter only men and return 2 teams', () => {
            const expected = [
                [
                    {score: 9, gender: Gender.male, pos: Position.defender},
                    {score: 2, gender: Gender.male, pos: Position.defender},
                    {score: 5, gender: Gender.male, pos: Position.defender},
                ],
                [
                    {score: 6, gender: Gender.male, pos: Position.attacker},
                    {score: 3, gender: Gender.male, pos: Position.attacker},
                    {score: 4, gender: Gender.male, pos: Position.attacker},
                ]
            ]
            expect(teamsFilter(maleFilter)(players, 2)).toEqual(expected)
        })
    })
})
