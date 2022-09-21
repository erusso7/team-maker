let hash = require('object-hash')

export const DefaultPrime = 13127

export enum Gender {
    male = 0,
    female = 1
}

export interface Player {
    Score(): number

    Gender(): Gender
}

export const seed = (player: any, prime: number): number => parseInt(hash.MD5(player), 16) % prime

export const teams = (players: Player[], numTeams: number, prime: number = DefaultPrime) => {
    const attendees = players.map(p => p)

    attendees.sort((a: Player, b: Player) => {
        return a.Score() - b.Score() || seed(a, prime) - seed(b, prime)
    })

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

export const femaleFilter = (p: Player) => p.Gender() === Gender.female
export const maleFilter = (p: Player) => p.Gender() === Gender.male
export const lowFilter = (limit: number) => (p: Player) => p.Score() <= limit
export const highFilter = (limit: number) => (p: Player) => p.Score() > limit

export const teamsFilter = (filterFunc: (p: Player) => {}) => {
    return (attendees: Player[], numTeams: number, prime: number = DefaultPrime): Player[][] => {
        return teams(attendees.filter(filterFunc), numTeams, prime)
    }
}

export const teamAVG = (team: Player[]) => {
    const avg = team.reduce((acc, p) => acc + p.Score(), 0) / team.length
    return Math.round(avg * 100) / 100
}

export const teamMedian = (team: Player[]) => {
    const teamCopy = team.map(p => p)
    teamCopy.sort((a, b) => a.Score() - b.Score())
    const midIdx = Math.floor(team.length / 2)
    return Math.floor(team[midIdx].Score())
}
