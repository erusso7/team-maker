import {fillTeams, Player, Position, Team} from "../index";

const CaptainMarvel = {name: "Captain marvel", positions: ['FB'], score: 8}
const Hulk = {name: "Hulk", positions: ['FB'], score: 6}
const Drax = {name: "Drax", positions: ['FB', 'W'], score: 3}
const PepperPots = {name: "Pepper pots", positions: ['FB', 'W'], score: 2}
const IronMan = {name: "IronMan", positions: ['F'], score: 9}
const HawkEye = {name: "Hawk eye", positions: ['F'], score: 5}
const Valkyrie = {name: "Valkyrie", positions: ['F'], score: 3}
const Nebula = {name: "Nebula", positions: ['F'], score: 1}
const ScarletWitch = {name: "Scarlet witch", positions: ['F'], score: 10}
const Gamora = {name: "Gamora", positions: ['F'], score: 7}
const Rocket = {name: "Rocket", positions: ['F'], score: 4}
const Groot = {name: "Groot", positions: ['F'], score: 2}
const WarMachine = {name: "War machine", positions: ['W'], score: 5}
const Falcon = {name: "Falcon", positions: ['W'], score: 6}
const Wasp = {name: "Wasp", positions: ['C', 'W'], score: 6}
const SpiderMan = {name: "Spider-man", positions: ['C'], score: 8}
const DrStrange = {name: "Dr Strange", positions: ['W'], score: 8}
const Wong = {name: "Wong", positions: ['C', 'W'], score: 5}
const BlackPanther = {name: "Black panther", positions: ['C'], score: 7}
const players: Player[] = [
    CaptainMarvel,
    Hulk,
    Drax,
    PepperPots,
    IronMan,
    HawkEye,
    Valkyrie,
    Nebula,
    ScarletWitch,
    Gamora,
    Rocket,
    Groot,
    WarMachine,
    Falcon,
    Wasp,
    SpiderMan,
    DrStrange,
    Wong,
    BlackPanther,
]

const definition: Position[] = [
    {pos: "W", num: 2},
    {pos: "F", num: 2},
    {pos: "FB", num: 1},
    {pos: "C", num: 1},
]

it("test new teams", () => {
    const teams = [new Team(), new Team()]
    fillTeams(teams, players, definition)

    expect(teams[0].players().get("W")).toEqual([DrStrange, WarMachine, Wong])
    expect(teams[0].players().get("F")).toEqual([IronMan, HawkEye, Rocket, Groot])
    expect(teams[0].players().get("FB")).toEqual([CaptainMarvel])
    expect(teams[0].players().get("C")).toEqual([BlackPanther])

    expect(teams[1].players().get("W")).toEqual([Falcon, Wasp, Drax, PepperPots])
    expect(teams[1].players().get("F")).toEqual([ScarletWitch, Gamora, Valkyrie, Nebula])
    expect(teams[1].players().get("FB")).toEqual([Hulk])
    expect(teams[1].players().get("C")).toEqual([SpiderMan])
})

it("test fix definition", () => {
    const teams = [new Team(), new Team()]
    fillTeams(teams, players, [])

    expect(teams[0].players().get("FB")).toEqual([Hulk, PepperPots])
    expect(teams[0].players().get("F")).toEqual([ScarletWitch, Gamora, Rocket, Groot])
    expect(teams[0].players().get("W")).toEqual([DrStrange, Wasp])
    expect(teams[0].players().get("C")).toEqual([BlackPanther])

    expect(teams[1].players().get("FB")).toEqual([CaptainMarvel, Drax])
    expect(teams[1].players().get("W")).toEqual([Falcon, WarMachine])
    expect(teams[1].players().get("F")).toEqual([IronMan, HawkEye, Valkyrie, Nebula])
    expect(teams[1].players().get("C")).toEqual([SpiderMan, Wong])
})