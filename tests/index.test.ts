import {
    DefaultPrime,
    femaleFilter,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Player,
    playersAVG,
    seed,
    Team,
    teamMedian,
    teams,
    teamsFilter
} from "../index"

const players = <Player[]>[
    {score: 10, gender: Gender.female, position: 'F'},
    {score: 5, gender: Gender.male, position: 'D'},
    {score: 1, gender: Gender.female, position: 'D'},
    {score: 3, gender: Gender.male, position: 'A'},

    {score: 7, gender: Gender.female, position: 'F'},
    {score: 9, gender: Gender.male, position: 'D'},
    {score: 8, gender: Gender.female, position: 'A'},
    {score: 2, gender: Gender.female, position: 'A'},

    {score: 4, gender: Gender.male, position: 'F'},
    {score: 2, gender: Gender.male, position: 'F'},
    {score: 3, gender: Gender.female, position: 'D'},
    {score: 6, gender: Gender.male, position: 'A'},

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
        expect(playersAVG(players)).toBe(5)
    })

    describe('building teams from a player list', () => {
        it('should build based on multiple positions', () => {
            const expected = [
                new Team([
                        {score: 10, gender: Gender.female, position: 'F'},
                        {score: 5, gender: Gender.male, position: 'D'},
                        {score: 1, gender: Gender.female, position: 'D'},
                        {score: 3, gender: Gender.male, position: 'A'},
                    ]
                ),
                new Team([
                    {score: 4, gender: Gender.male, position: 'F'},
                    {score: 2, gender: Gender.male, position: 'F'},
                    {score: 3, gender: Gender.female, position: 'D'},
                    {score: 6, gender: Gender.male, position: 'A'},
                ]),
                new Team([
                    {score: 7, gender: Gender.female, position: 'F'},
                    {score: 9, gender: Gender.male, position: 'D'},
                    {score: 8, gender: Gender.female, position: 'A'},
                    {score: 2, gender: Gender.female, position: 'A'},
                ]),
            ]
            expect(teams(players, 3)).toEqual(expected)
        })

        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                new Team([
                    {score: 2, gender: Gender.male, position: 'F'},
                    {score: 5, gender: Gender.male, position: 'D'},
                    {score: 3, gender: Gender.male, position: 'A'},
                ]),
                new Team([
                    {score: 4, gender: Gender.male, position: 'F'},
                    {score: 3, gender: Gender.female, position: 'D'},
                    {score: 1, gender: Gender.female, position: 'D'},
                    {score: 2, gender: Gender.female, position: 'A'},
                ])
            ]
            expect(teamsFilter(lowFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                new Team([
                    {score: 10, gender: Gender.female, position: 'F'},
                    {score: 8, gender: Gender.female, position: 'A'},
                ]),
                new Team([
                    {score: 7, gender: Gender.female, position: 'F'},
                    {score: 9, gender: Gender.male, position: 'D'},
                    {score: 6, gender: Gender.male, position: 'A'},
                ]),
            ]
            expect(teamsFilter(highFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                new Team([
                    {score: 7, gender: Gender.female, position: 'F'},
                    {score: 3, gender: Gender.female, position: 'D'},
                    {score: 8, gender: Gender.female, position: 'A'},
                ]),
                new Team([
                    {score: 10, gender: Gender.female, position: 'F'},
                    {score: 1, gender: Gender.female, position: 'D'},
                    {score: 2, gender: Gender.female, position: 'A'},
                ]),
            ]
            expect(teamsFilter(femaleFilter)(players, 2)).toEqual(expected)
        })

        it('should filter only men and return 2 teams', () => {
            const expected = [
                new Team([
                    {score: 4, gender: Gender.male, position: 'F'},
                    {score: 5, gender: Gender.male, position: 'D'},
                    {score: 6, gender: Gender.male, position: 'A'},
                ]),
                new Team([
                    {score: 2, gender: Gender.male, position: 'F'},
                    {score: 9, gender: Gender.male, position: 'D'},
                    {score: 3, gender: Gender.male, position: 'A'},
                ]),
            ]
            expect(teamsFilter(maleFilter)(players, 2)).toEqual(expected)
        })
    })
})
