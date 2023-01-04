import {
    attackersFilter,
    DefaultPrime,
    defendersFilter,
    femaleFilter,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Player,
    Position,
    seed,
    teamAVG,
    teamMedian,
    teams,
    teamsFilter
} from "../index"

const players = <Player[]>[
    {score: 1, gender: Gender.female, position: Position.defender},
    {score: 2, gender: Gender.male, position: Position.defender},
    {score: 2, gender: Gender.female, position: Position.attacker},
    {score: 3, gender: Gender.female, position: Position.defender},
    {score: 3, gender: Gender.male, position: Position.attacker},
    {score: 4, gender: Gender.male, position: Position.attacker},
    {score: 5, gender: Gender.male, position: Position.defender},
    {score: 6, gender: Gender.male, position: Position.attacker},
    {score: 7, gender: Gender.female, position: Position.attacker},
    {score: 8, gender: Gender.female, position: Position.attacker},
    {score: 9, gender: Gender.male, position: Position.defender},
    {score: 10, gender: Gender.female, position: Position.defender},
].sort((a, b) => 0.5 - Math.random());

describe('main file', () => {
    it('should return a deterministic seed', () => {
        expect(seed({}, DefaultPrime)).toBe(8263)
    })

    it('should return the median', () => {
        expect(teamMedian([])).toBe(0)
        expect(teamMedian(players)).toBe(5)
    })

    it('should return the average', () => {
        expect(teamAVG(players)).toBe(5)
    })

    describe('building teams from a player list', () => {
        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                [
                    {score: 4, gender: Gender.male, position: Position.attacker},
                    {score: 2, gender: Gender.female, position: Position.attacker},
                    {score: 3, gender: Gender.female, position: Position.defender},
                    {score: 2, gender: Gender.male, position: Position.defender}
                ],
                [
                    {score: 3, gender: Gender.male, position: Position.attacker},
                    {score: 5, gender: Gender.male, position: Position.defender},
                    {score: 1, gender: Gender.female, position: Position.defender}
                ]
            ]
            expect(teamsFilter(lowFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                [
                    {score: 8, gender: Gender.female, position: Position.attacker},
                    {score: 6, gender: Gender.male, position: Position.attacker},
                    {score: 9, gender: Gender.male, position: Position.defender}
                ],
                [
                    {score: 7, gender: Gender.female, position: Position.attacker},
                    {score: 10, gender: Gender.female, position: Position.defender}
                ]
            ]
            expect(teamsFilter(highFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                [
                    {score: 8, gender: Gender.female, position: Position.attacker},
                    {score: 2, gender: Gender.female, position: Position.attacker},
                    {score: 3, gender: Gender.female, position: Position.defender}
                ],
                [
                    {score: 7, gender: Gender.female, position: Position.attacker},
                    {score: 10, gender: Gender.female, position: Position.defender},
                    {score: 1, gender: Gender.female, position: Position.defender}
                ]
            ]
            expect(teamsFilter(femaleFilter)(players, 2)).toEqual(expected)
        })

        it('should filter only men and return 2 teams', () => {
            const expected = [
                [
                    {score: 6, gender: Gender.male, position: Position.attacker},
                    {score: 3, gender: Gender.male, position: Position.attacker},
                    {score: 5, gender: Gender.male, position: Position.defender}
                ],
                [
                    {score: 4, gender: Gender.male, position: Position.attacker},
                    {score: 9, gender: Gender.male, position: Position.defender},
                    {score: 2, gender: Gender.male, position: Position.defender}
                ]
            ]
            expect(teamsFilter(maleFilter)(players, 2)).toEqual(expected)
        })

        it('should balance by position and return 2 teams', () => {
            const expected = [
                [
                    {score: 8, gender: Gender.female, position: Position.attacker},
                    {score: 2, gender: Gender.female, position: Position.attacker},
                    {score: 6, gender: Gender.male, position: Position.attacker},
                    {score: 9, gender: Gender.male, position: Position.defender},
                    {score: 2, gender: Gender.male, position: Position.defender},
                    {score: 3, gender: Gender.female, position: Position.defender}
                ],
                [
                    {score: 7, gender: Gender.female, position: Position.attacker},
                    {score: 3, gender: Gender.male, position: Position.attacker},
                    {score: 4, gender: Gender.male, position: Position.attacker},
                    {score: 10, gender: Gender.female, position: Position.defender},
                    {score: 1, gender: Gender.female, position: Position.defender},
                    {score: 5, gender: Gender.male, position: Position.defender}
                ]
            ]
            expect(teams(players, 2)).toEqual(expected)
        })

        it('should return 2 teams even when there are no defenders', () => {
            const expected = [
                [
                    {score: 8, gender: Gender.female, position: Position.attacker},
                    {score: 2, gender: Gender.female, position: Position.attacker},
                    {score: 6, gender: Gender.male, position: Position.attacker},
                ],
                [
                    {score: 7, gender: Gender.female, position: Position.attacker},
                    {score: 3, gender: Gender.male, position: Position.attacker},
                    {score: 4, gender: Gender.male, position: Position.attacker},
                ]
            ]
            const attackers = players.filter(attackersFilter)
            expect(teams(attackers, 2)).toEqual(expected)
        })

        it('should return 2 teams even when there are no attackers', () => {
            const expected = [
                [
                    {score: 9, gender: Gender.male, position: Position.defender},
                    {score: 2, gender: Gender.male, position: Position.defender},
                    {score: 3, gender: Gender.female, position: Position.defender}
                ],
                [
                    {score: 10, gender: Gender.female, position: Position.defender},
                    {score: 1, gender: Gender.female, position: Position.defender},
                    {score: 5, gender: Gender.male, position: Position.defender}
                ]
            ]
            const defenders = players.filter(defendersFilter)
            expect(teams(defenders, 2)).toEqual(expected)
        })
    })
})
