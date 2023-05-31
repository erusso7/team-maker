import {
    DefaultPrime,
    femaleFilter,
    fillTeams,
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

class TestPlayer implements Player {
    public name: string;
    public gender: Gender;
    public position: string;
    public score: number;

    constructor(n: string, g: Gender, p: string, s: number) {
        this.name = n
        this.gender = g
        this.position = p
        this.score = s
    }
}

const ScarletWitch = new TestPlayer("Scarlet witch", Gender.female, 'F', 10)
const PepperPots = new TestPlayer("Pepper pots", Gender.female, 'A', 2)
const Nebula = new TestPlayer("Nebula", Gender.female, 'D', 1)
const Gamora = new TestPlayer("Gamora", Gender.female, 'F', 7)
const CaptainMarvel = new TestPlayer("Captain marvel", Gender.female, 'A', 8)
const Valkyrie = new TestPlayer("Valkyrie", Gender.female, 'D', 3)
const Drax = new TestPlayer("Drax", Gender.male, 'A', 3)
const HawkEye = new TestPlayer("Hawk eye", Gender.male, 'D', 5)
const IronMan = new TestPlayer("IronMan", Gender.male, 'D', 9)
const Rocket = new TestPlayer("Rocket", Gender.male, 'F', 4)
const Groot = new TestPlayer("Groot", Gender.male, 'F', 2)
const Hulk = new TestPlayer("Hulk", Gender.male, 'A', 6)

const players = <Player[]>[
    ScarletWitch,
    HawkEye,
    Nebula,
    Drax,
    Gamora,
    IronMan,
    CaptainMarvel,
    PepperPots,
    Rocket,
    Groot,
    Valkyrie,
    Hulk,
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
                new Team([ScarletWitch, HawkEye, Nebula, Drax]),
                new Team([Rocket, Groot, Valkyrie, Hulk]),
                new Team([Gamora, IronMan, CaptainMarvel, PepperPots]),
            ]
            expect(teams(players, 3)).toEqual(expected)
        })

        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                new Team([Groot, HawkEye, Drax]),
                new Team([Rocket, Valkyrie, Nebula, PepperPots])
            ]
            expect(teamsFilter(lowFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                new Team([ScarletWitch, CaptainMarvel]),
                new Team([Gamora, IronMan, Hulk]),
            ]
            expect(teamsFilter(highFilter(5))(players, 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                new Team([Gamora, Valkyrie, CaptainMarvel]),
                new Team([ScarletWitch, Nebula, PepperPots]),
            ]
            expect(teamsFilter(femaleFilter)(players, 2)).toEqual(expected)
        })

        it('should filter only men and return 2 teams', () => {
            const expected = [
                new Team([Rocket, HawkEye, Hulk]),
                new Team([Groot, IronMan, Drax]),
            ]
            expect(teamsFilter(maleFilter)(players, 2)).toEqual(expected)
        })
    })

    describe('filling existing teams with pre-selected some players', () => {
        it('should keep 2 specific players in the same team', () => {
            // Pre-defined teamA with 2 players.
            const teamA = new Team([Gamora, Nebula])
            const teamB = new Team()

            const expected = [
                new Team([Gamora, Nebula, CaptainMarvel]),
                new Team([ScarletWitch, Valkyrie, PepperPots]),
            ]

            const availableWomen = players
                .filter(femaleFilter)
                .filter(p => {
                    return !teamA.includes(p)
                })

            const teams = fillTeams([teamA, teamB], availableWomen)
            expect(teams).toEqual(expected)
        })

        it('should keep 4 given players in 2 specific teams', () => {
            // Pre-defined teamA with 2 players and teamB with 2 player
            const teamA = new Team([Rocket, Drax])
            const teamB = new Team([IronMan, Hulk])

            const availableMen = players
                .filter(maleFilter)
                .filter(p => {
                    return !teamA.includes(p) && !teamB.includes(p)
                })

            const expected = [
                new Team([Rocket, Drax, Groot]),
                new Team([IronMan, Hulk, HawkEye]),
            ]

            const teams = fillTeams([teamA, teamB], availableMen)
            expect(teams).toEqual(expected)
        })
    })
})
