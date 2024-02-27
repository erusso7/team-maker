import {fillTeams, Player, Position, Team} from "../index";

const CaptainMarvel = {name: "Captain marvel", positions: ['A'], score: 8}
const Hulk = {name: "Hulk", positions: ['A'], score: 6}
const Drax = {name: "Drax", positions: ['A'], score: 3}
const PepperPots = {name: "Pepper pots", positions: ['A'], score: 2}
const IronMan = {name: "IronMan", positions: ['D'], score: 9}
const HawkEye = {name: "Hawk eye", positions: ['D'], score: 5}
const Valkyrie = {name: "Valkyrie", positions: ['D'], score: 3}
const Nebula = {name: "Nebula", positions: ['D'], score: 1}
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
    {pos: "P", num: 1},
    {pos: "C", num: 1},
    {pos: "A", num: 2},
    {pos: "D", num: 2},
]

it("test new teams", () => {
    const teams = [new Team(), new Team()]
    fillTeams(teams, players, definition)

    expect(teams[0].players().get("P")).toEqual([Groot])
    expect(teams[0].players().get("C")).toEqual([BlackPanther])
    expect(teams[0].players().get("A")).toEqual([CaptainMarvel, PepperPots, Gamora, ScarletWitch])
    expect(teams[0].players().get("D")).toEqual([HawkEye, Valkyrie, Wong, Wasp])

    expect(teams[1].players().get("P")).toEqual([Nebula])
    expect(teams[1].players().get("C")).toEqual([SpiderMan])
    expect(teams[1].players().get("A")).toEqual([Hulk, Drax, DrStrange])
    expect(teams[1].players().get("D")).toEqual([IronMan, Rocket, WarMachine, Falcon])
})
