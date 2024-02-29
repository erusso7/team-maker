import {fillTeams, Player, Position, Team} from "../index";

const CaptainMarvel = {name: "Captain marvel", positions: ['FB'], score: 8}
const Hulk = {name: "Hulk", positions: ['FB'], score: 6}
const Drax = {name: "Drax", positions: ['FB'], score: 3}
const PepperPots = {name: "Pepper pots", positions: ['FB'], score: 2}
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
const Wasp = {name: "Wasp", positions: ['C'], score: 6}
const SpiderMan = {name: "Spider-man", positions: ['C'], score: 8}
const DrStrange = {name: "Dr Strange", positions: ['W'], score: 8}
const Wong = {name: "Wong", positions: ['C'], score: 5}
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
    {pos: "FB", num: 1},
    {pos: "C", num: 1},
    {pos: "F", num: 2},
    {pos: "W", num: 2},
]

it("test new teams", () => {
    const teams = [new Team(), new Team()]
    fillTeams(teams, players, definition)

    expect(teams[0].players().get("FB")).toEqual([CaptainMarvel,Drax])
    expect(teams[0].players().get("C")).toEqual([BlackPanther,Wasp])
    expect(teams[0].players().get("F")).toEqual([IronMan, HawkEye, Rocket, Groot])
    expect(teams[0].players().get("W")).toEqual([DrStrange, Nebula])

    expect(teams[1].players().get("FB")).toEqual([Hulk, PepperPots])
    expect(teams[1].players().get("C")).toEqual([SpiderMan, Wong])
    expect(teams[1].players().get("F")).toEqual([ScarletWitch, Gamora, Valkyrie])
    expect(teams[1].players().get("W")).toEqual([Falcon, WarMachine])
})

it("test fix definition", () => {
    const teams = [new Team(), new Team()]
    fillTeams(teams, players, [])

    expect(teams[0].players().get("FB")).toEqual([Hulk, PepperPots, Groot])
    expect(teams[0].players().get("F")).toEqual([ScarletWitch, Gamora, Rocket])
    expect(teams[0].players().get("W")).toEqual([DrStrange, Nebula])
    expect(teams[0].players().get("C")).toEqual([BlackPanther, Wasp])

    expect(teams[1].players().get("FB")).toEqual([CaptainMarvel, Drax, Valkyrie])
    expect(teams[1].players().get("F")).toEqual([IronMan, HawkEye])
    expect(teams[1].players().get("W")).toEqual([Falcon, WarMachine])
    expect(teams[1].players().get("C")).toEqual([SpiderMan, Wong])
})