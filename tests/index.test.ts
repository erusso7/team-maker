import {
    countPosInTeam,
    DefaultPrime,
    femaleFilter,
    fillTeams,
    fillTeamsWithPositions,
    Gender,
    highFilter,
    lowFilter,
    maleFilter,
    Player,
    playersAVG,
    seed,
    sortTeamsAsc,
    Team,
    teamMedian,
    teams,
    teamsFilter
} from "../index"

class TestPlayer implements Player {
    public name: string = "";
    public gender: Gender = Gender.male;
    public position: string = "";
    public positions: string[] = [];
    public score: number = 0;

    static createWithOldPosition(n: string, g: Gender, p: string, s: number): TestPlayer {
        const t = new TestPlayer()
        t.name = n
        t.gender = g
        t.position = p
        t.positions = p.split(",").map(s => s.trim())
        t.score = s
        return t
    }

    static createWithPositions(n: string, g: Gender, p: string[], s: number): TestPlayer {
        const t = new TestPlayer()
        t.name = n
        t.gender = g
        t.position = (p ? p.map(s => s.trim()).at(0) : "") as string
        t.positions = p
        t.score = s
        return t
    }
}

const CaptainMarvel = TestPlayer.createWithOldPosition("Captain marvel", Gender.female, 'A', 8)
const Hulk = TestPlayer.createWithOldPosition("Hulk", Gender.male, 'A', 6)
const Drax = TestPlayer.createWithOldPosition("Drax", Gender.male, 'A', 3)
const PepperPots = TestPlayer.createWithOldPosition("Pepper pots", Gender.female, 'A', 2)
const IronMan = TestPlayer.createWithOldPosition("IronMan", Gender.male, 'D', 9)
const HawkEye = TestPlayer.createWithOldPosition("Hawk eye", Gender.male, 'D', 5)
const Valkyrie = TestPlayer.createWithOldPosition("Valkyrie", Gender.female, 'D', 3)
const Nebula = TestPlayer.createWithOldPosition("Nebula", Gender.female, 'D', 1)
const ScarletWitch = TestPlayer.createWithOldPosition("Scarlet witch", Gender.female, 'F', 10)
const Gamora = TestPlayer.createWithOldPosition("Gamora", Gender.female, 'F', 7)
const Rocket = TestPlayer.createWithOldPosition("Rocket", Gender.male, 'F', 4)
const Groot = TestPlayer.createWithOldPosition("Groot", Gender.male, 'F', 2)
const WarMachine = TestPlayer.createWithOldPosition("War machine", Gender.male, 'W', 5)

const Falcon = TestPlayer.createWithPositions("Falcon", Gender.male, ['W'], 6)
const Wasp = TestPlayer.createWithPositions("Wasp", Gender.female, ['C'], 6)
const SpiderMan = TestPlayer.createWithPositions("Spider-man", Gender.male, ['C'], 8)
const DrStrange = TestPlayer.createWithPositions("Dr Strange", Gender.male, ['W'], 8)
const Wong = TestPlayer.createWithPositions("Wong", Gender.male, ['C'], 5)
const BlackPanther = TestPlayer.createWithPositions("Black panther", Gender.male, ['C'], 7)

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
].sort(() => 0.5 - Math.random());

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
                new Team([Rocket, Drax, Groot]),
                new Team([IronMan, Hulk, HawkEye]),
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
            const expectedPlayer = {taken: true, score: 100, positions: ["A", "B"], gender: Gender.male}
            const expectedTeam = new Team()
            expectedTeam.push(expectedPlayer)
            expect(
                fillTeamsWithPositions(
                    [new Team()],
                    {"A": 1},
                    [{...expectedPlayer, taken: false, positions: ["A", "B"]}]
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
                {...CaptainMarvel, positions: [CaptainMarvel.position], taken: true},
                {...HawkEye, positions: [HawkEye.position], taken: true},
                {...Valkyrie, positions: [Valkyrie.position], taken: true},
                {...ScarletWitch, positions: [ScarletWitch.position], taken: true},
                {...PepperPots, positions: [PepperPots.position], taken: true},
            ], "Team A")
            const teamB = new Team([
                {...Hulk, positions: [Hulk.position], taken: true},
                {...IronMan, positions: [IronMan.position], taken: true},
                {...Nebula, positions: [Nebula.position], taken: true},
                {...Gamora, positions: [Gamora.position], taken: true},
                {...Drax, positions: [Drax.position], taken: true},
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

            const teamA = new Team([
                {...CM, taken: true},
                {...BP, taken: true},
                {...D, taken: true}
            ], "Team A")
            const teamB = new Team([
                {...H, taken: true},
                {...SP, taken: true},
                {...W, taken: true}
            ], "Team B")

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

            const players = [
                Falcon,
                SpiderMan,
                Wong,
                WarMachine,
                Drax
            ]

            const result = fillTeamsWithPositions([teamA, teamB], definition, players)
            const expected = [
                new Team([
                    DrStrange,
                    {...SpiderMan, taken: true},
                    {...Wong, taken: true},
                    {...Drax, taken: true},
                ]),
                new Team([
                    BlackPanther,
                    Wasp,
                    {...Falcon, taken: true},
                    {...WarMachine, taken: true}
                ]),
            ]
            expect(result).toEqual(expected)
        })
    })
})


