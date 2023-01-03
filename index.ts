let hash = require('object-hash')

export const DefaultPrime = 13127

export enum Gender {
    male = 0,
    female = 1
}

export enum Position {
    attacker = 0,
    defender = 1
}

export interface Player {
    score: number
    pos: Position
    gender: Gender
}

export const seed = (player: any, prime: number): number => parseInt(hash.MD5(player), 16) % prime

const asc = (prime: number = DefaultPrime) => {
    return (a: Player, b: Player) => {
        return a.score - b.score || seed(a, prime) - seed(b, prime)
    }
}

export const teams = (players: Player[], numTeams: number, prime: number = DefaultPrime) => {
    const attackTeams = splitPlayers(players.filter(attackersFilter), numTeams, prime)
    const defendTeams = splitPlayers(players.filter(defendersFilter), numTeams, prime)

    let allTeams: Player[][] = []
    for (let i = 0; i < numTeams; i++) {
        const defenderTeam = defendTeams[numTeams - i - 1] || []
        const attackTeam = attackTeams[i] || []
        allTeams.push([...attackTeam, ...defenderTeam])
    }

    return allTeams
}

const splitPlayers = (players: Player[], numTeams: number, prime: number = DefaultPrime) => {
    const attendees = players.map(p => p)

    attendees.sort(asc(prime))

    let allTeams: Player[][] = []
    let teamSelector: number = 0;
    let countPlayers: number = 0;
    while (attendees.length > 0) {
        teamSelector = countPlayers % numTeams;

        if (!allTeams[teamSelector]) {
            allTeams[teamSelector] = []
        }

        allTeams[teamSelector].push(
            <Player>attendees.pop()
        )

        countPlayers = players.length - attendees.length
        if (countPlayers % numTeams === 0) {
            attendees.reverse()
        }
    }

    return allTeams
}

export const defendersFilter = (p: Player) => p.pos === Position.defender
export const attackersFilter = (p: Player) => p.pos === Position.attacker
export const femaleFilter = (p: Player) => p.gender === Gender.female
export const maleFilter = (p: Player) => p.gender === Gender.male
export const lowFilter = (limit: number) => (p: Player) => p.score <= limit
export const highFilter = (limit: number) => (p: Player) => p.score > limit

export const teamsFilter = (filterFunc: (p: Player) => {}) => {
    return (attendees: Player[], numTeams: number, prime: number = DefaultPrime): Player[][] => {
        return teams(attendees.filter(filterFunc), numTeams, prime)
    }
}

export const teamAVG = (team: Player[]) => {
    const avg = team.reduce((acc, p) => acc + p.score, 0) / team.length
    return Math.round(avg * 100) / 100
}

export const teamMedian = (team: Player[]) => {
    const copy = team.map(p => p)
    if (copy.length === 0) {
        return 0
    }
    copy.sort(asc(1))
    const midIdx = Math.floor(copy.length / 2)
    return Math.floor(copy[midIdx].score)
}
