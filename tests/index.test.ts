import {
    countPosInTeam,
    femaleFilter,
    fillTeams,
    fillTeamsWithPositions,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Player,
    playersAVG,
    sortTeamsAsc,
    Team,
    teamMedian,
    teams
} from "../index"

class TestPlayer implements Player {
    public name: string = "";
    public gender: Gender = Gender.male;
    public positions: string[] = [];
    public score: number = 0;

    static createWithPositions(n: string, g: Gender, p: string[], s: number): TestPlayer {
        const t = new TestPlayer()
        t.name = n
        t.gender = g
        t.positions = p
        t.score = s
        return t
    }
}

const CaptainMarvel = TestPlayer.createWithPositions("Captain marvel", Gender.female, ['A'], 8)
const Hulk = TestPlayer.createWithPositions("Hulk", Gender.male, ['A'], 6)
const Drax = TestPlayer.createWithPositions("Drax", Gender.male, ['A'], 3)
const PepperPots = TestPlayer.createWithPositions("Pepper pots", Gender.female, ['A'], 2)
const IronMan = TestPlayer.createWithPositions("IronMan", Gender.male, ['D'], 9)
const HawkEye = TestPlayer.createWithPositions("Hawk eye", Gender.male, ['D'], 5)
const Valkyrie = TestPlayer.createWithPositions("Valkyrie", Gender.female, ['D'], 3)
const Nebula = TestPlayer.createWithPositions("Nebula", Gender.female, ['D'], 1)
const ScarletWitch = TestPlayer.createWithPositions("Scarlet witch", Gender.female, ['F'], 10)
const Gamora = TestPlayer.createWithPositions("Gamora", Gender.female, ['F'], 7)
const Rocket = TestPlayer.createWithPositions("Rocket", Gender.male, ['F'], 4)
const Groot = TestPlayer.createWithPositions("Groot", Gender.male, ['F'], 2)
const WarMachine = TestPlayer.createWithPositions("War machine", Gender.male, ['W'], 5)

const Falcon = TestPlayer.createWithPositions("Falcon", Gender.male, ['W'], 6)
const Wasp = TestPlayer.createWithPositions("Wasp", Gender.female, ['C'], 6)
const SpiderMan = TestPlayer.createWithPositions("Spider-man", Gender.male, ['C'], 8)
const DrStrange = TestPlayer.createWithPositions("Dr Strange", Gender.male, ['W'], 8)
const Wong = TestPlayer.createWithPositions("Wong", Gender.male, ['C'], 5)
const BlackPanther = TestPlayer.createWithPositions("Black panther", Gender.male, ['C'], 7)

const players = <Player[]>[
    Nebula,
    Groot,
    PepperPots,
    Drax,
    Valkyrie,
    Rocket,
    HawkEye,

    Hulk,
    Gamora,
    CaptainMarvel,
    IronMan,
    ScarletWitch,
].sort(() => 0.5 - Math.random());

describe('main file', () => {
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
                new Team([ScarletWitch, HawkEye, Rocket, Nebula,]),
                new Team([IronMan, Hulk, Valkyrie, PepperPots,]),
                new Team([CaptainMarvel, Gamora, Drax, Groot,])
            ]
            expect(teams(players, 3)).toEqual(expected)
        })

        it('should filter less than or equal to the given limit and create 2 teams', () => {
            const expected = [
                new Team([Rocket, Valkyrie, Groot, Nebula,]),
                new Team([HawkEye, Drax, PepperPots,])]
            expect(teams(players.filter(lowFilter(5)), 2)).toEqual(expected)
        })

        it('should filter greater than to the given limit and create 2 teams', () => {
            const expected = [
                new Team([ScarletWitch, Gamora, Hulk]),
                new Team([IronMan, CaptainMarvel]),
            ]
            expect(teams(players.filter(highFilter(5)), 2)).toEqual(expected)
        })

        it('should filter only women and return 2 teams', () => {
            const expected = [
                new Team([CaptainMarvel, Gamora, Nebula]),
                new Team([ScarletWitch, Valkyrie, PepperPots]),
            ]
            expect(teams(players.filter(femaleFilter), 2)).toEqual(expected)
        })

        it('should filter only men and return 2 teams', () => {
            const expected = [
                new Team([IronMan, Rocket, Groot]),
                new Team([Hulk, HawkEye, Drax]),
            ]
            expect(teams(players.filter(maleFilter), 2)).toEqual(expected)
        })
    })

    describe('filling existing teams with pre-selected some players', () => {
        it('should keep 2 specific players in the same team', () => {
            // Pre-defined teamA with 2 players.
            const teamA = new Team([Gamora, Nebula])
            const teamB = new Team()

            const expected = [
                new Team([ScarletWitch, CaptainMarvel, PepperPots]),
                new Team([Gamora, Nebula, Valkyrie]),
            ]

            const availableWomen = players
                .filter(femaleFilter)
                .filter(p => {
                    return !teamA.players.includes(p)
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
                    return !teamA.players.includes(p) && !teamB.players.includes(p)
                })

            const expected = [
                new Team([IronMan, Hulk, Groot]),
                new Team([Rocket, Drax, HawkEye]),
            ]

            const teams = fillTeams([teamA, teamB], availableMen)
            expect(teams).toEqual(expected)
        })
    })

    describe('sorting teams in ascending order', () => {
        it('should do nothing when same amount of player and same score', () => {
            const teamA = new Team([PepperPots])
            const teamB = new Team([Groot])
            const result = [teamA, teamB]
            sortTeamsAsc(result)
            expect(result).toEqual([teamA, teamB])
        })
        it('should revert given order when first team has more players', () => {
            const teamA = new Team([PepperPots, Valkyrie])
            const teamB = new Team([Groot])
            const result = [teamA, teamB]
            sortTeamsAsc(result)
            expect(result).toEqual([teamB, teamA])
        })
        it('should do nothing when second team has more players', () => {
            const teamA = new Team([PepperPots])
            const teamB = new Team([Groot, Valkyrie])
            const result = [teamA, teamB]
            sortTeamsAsc(result)
            expect(result).toEqual([teamA, teamB])
        })
        it('should revert given order when first team has smaller score', () => {
            const teamA = new Team([PepperPots, Valkyrie])
            const teamB = new Team([Groot, Nebula])
            const result = [teamA, teamB]
            sortTeamsAsc(result)
            expect(result).toEqual([teamB, teamA])
        })
    });

    describe('count positions in a Team', () => {
        it('should count all members when the position is a string', () => {
            const team = new Team([IronMan, HawkEye])
            expect(countPosInTeam(team, 'D')).toBe(2)
        })
        it('should count all members when the position is an array', () => {
            const team = new Team([DrStrange, Falcon])
            expect(countPosInTeam(team, 'W')).toBe(2)
        })
    });

    describe('teams with definition', () => {
        it('should return empty teams when no players or teams are given', () => {
            expect(
                fillTeamsWithPositions([], {}, [])
            ).toEqual([])
        })

        it('should return a team with the highest player in a given position', () => {
            const expectedPlayer = {
                score: 100,
                position: "A, B",
                positions: ["A", "B"],
                gender: Gender.male
            }
            const expectedTeam = new Team()
            expectedTeam.push(expectedPlayer)
            expect(
                fillTeamsWithPositions(
                    [new Team()],
                    {"A": 1},
                    [expectedPlayer]
                )
            ).toEqual([expectedTeam])
        })

        it('should return balanced teams using main positions', () => {
            const definition = {"A": 1, "D": 2, "F": 1}
            const players = [
                CaptainMarvel,
                HawkEye,
                Valkyrie,
                Gamora,
                Hulk,
                IronMan,
                Nebula,
                ScarletWitch,
                Drax,
                PepperPots
            ]
            const teamA = new Team([
                CaptainMarvel,
                HawkEye,
                Valkyrie,
                ScarletWitch,
                PepperPots,
            ], "Team A")
            const teamB = new Team([
                Hulk,
                IronMan,
                Nebula,
                Gamora,
                Drax,
            ], "Team B")

            const result = fillTeamsWithPositions(
                [new Team([], "Team A"), new Team([], "Team B")],
                definition,
                players
            )
            expect(
                result.filter(t => t.name === teamA.name).pop()
            ).toEqual(teamA)
            expect(
                result.filter(t => t.name === teamB.name).pop()
            ).toEqual(teamB)
        })

        it('should return balanced teams teams using secondary positions', () => {
            const definition = {'A': 1, 'C': 1}
            const CM = {...CaptainMarvel, positions: ['X', 'A']}
            const H = {...Hulk, positions: ['A', 'X']}
            const SP = {...SpiderMan, positions: ['Y', 'C']}
            const BP = {...BlackPanther, positions: ['Y', 'C']}
            const D = {...Drax, positions: ['X', 'A']}
            const W = {...Wong, positions: ['Y', 'C']}

            const players = [CM, H, D, BP, SP, W,]

            const teamA = new Team([CM, BP, D], "Team A")
            const teamB = new Team([H, SP, W], "Team B")

            const result = fillTeamsWithPositions(
                [new Team([], teamA.name), new Team([], teamB.name)],
                definition,
                players
            )
            expect(
                result.filter(t => t.name === teamA.name).pop()
            ).toEqual(teamA)
            expect(
                result.filter(t => t.name === teamB.name).pop()
            ).toEqual(teamB)

        })

        it('should fill teams with pre-fixed players', () => {
            const definition = {'W': 1, 'C': 2}
            const teamA = new Team([BlackPanther, Wasp])
            const teamB = new Team([DrStrange])

            const players = [Falcon, SpiderMan, Wong, WarMachine, Drax]

            const result = fillTeamsWithPositions([teamA, teamB], definition, players)
            const expected = [
                new Team([DrStrange, SpiderMan, Wong, Drax]),
                new Team([BlackPanther, Wasp, Falcon, WarMachine]),
            ]
            expect(result).toEqual(expected)
        })
    })
})


