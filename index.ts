let hash = require('object-hash')

export const DefaultPrime = 13127

export enum Gender {
    male = 'male',
    female = 'female'
}

export interface Player {
    score: number
    position: string | string[]
    gender: Gender
    taken?: boolean
}

export const seed = (player: any, prime: number): number => parseInt(hash.MD5(player), 16) % prime

const asc = (prime: number = DefaultPrime) => {
    return (a: Player, b: Player) => {
        return a.score - b.score || seed(a, prime) - seed(b, prime)
    }
}

export class Team {
    name?: string
    score: number
    players: Player[]

    constructor(players: Player[] = [], name: string = "") {
        this.name = name
        this.players = players
        this.score = playersAVG(this.players)
    }

    push(...players: Player[]): void {
        this.players.push(...players)
        this.score = playersAVG(this.players)
    }

    includes(p: Player): boolean {
        return this.players.includes(p)
    }
}

export const teams = (players: Player[], requiredTeams: number, prime: number = DefaultPrime): Team[] => {
    const result = new Array<Team>(requiredTeams)
    for (let i = 0; i < requiredTeams; i++) {
        result[i] = new Team()
    }

    return fillTeams(result, players, prime)
}

export const fillTeamsWithPositions = (
    teams: Team[],
    teamDefinition: { [pos: string]: number },
    players: Player[],
    prime: number = DefaultPrime
): Team[] => {
    if (teams.length === 0) return []

    const resultTeams: Team[] = [...teams]
    const positions = {...teamDefinition}
    const candidates = players.map(p => {
        const candidatePositions = Array.isArray(p.position)
            ? p.position
            : p.position.split(",").map(po => po.trim())
        return {...p, position: candidatePositions}
    })

    //TODO: When pre-fixed teams, check the required positions

    // Prioritize the teams based on the positions
    for (const pos in positions) {
        for (let i = positions[pos]; i > 0; i--) {
            for (const t in resultTeams) {
                const candidateForMainPosition: Player[] = candidates
                    .filter(p => !p.taken)
                    .filter(p => p.position[0] === pos)
                    .sort((pa, pb) => pa.score - pb.score)

                const candidateForSecondPosition: Player[] = candidates
                    .filter(p => !p.taken)
                    .filter(p => p.position[1] && p.position[1] === pos)
                    .sort((pa, pb) => pa.score - pb.score)

                if (candidateForMainPosition.length + candidateForSecondPosition.length === 0) break;
                const selected = (candidateForMainPosition.pop() || candidateForSecondPosition.pop()) as Player
                selected.taken = true
                resultTeams[t].push(selected)
            }
            sortTeamsAsc(resultTeams)
        }
    }

    const remainingCandidates = candidates
        .filter(c => !c.taken)
        .sort((pa, pb) => pa.score - pb.score)

    for (const candidate of remainingCandidates) {
        sortTeamsAsc(resultTeams)
        candidate.taken = true
        resultTeams[0].push(candidate)
    }

    return resultTeams
}

export const fillTeams = (teams: Team[], players: Player[], prime: number = DefaultPrime): Team[] => {
    const result = teams.map(t => t)
    // Sort by position and descending by score
    const availablePlayers = players.map(p => p)
    sortPlayers(availablePlayers, prime)

    const lastTeamIdx = result.length - 1
    while (availablePlayers.length) {
        sortTeams(result)
        const p = availablePlayers.pop() as Player
        result[lastTeamIdx].push(p)
    }

    return result
}

const sortPlayers = (players: Player[], prime: number): void => {
    players.sort((a, b) => {
        const playerAPos: string = Array.isArray(a.position) ? a.position.join("") : a.position
        const playerBPos: string = Array.isArray(b.position) ? b.position.join("") : b.position
        return playerAPos.localeCompare(playerBPos)
            || a.score - b.score
            || seed(a, prime) - seed(b, prime)
    })
}

export const sortTeamsAsc = (teams: Team[]): void => {
    teams.sort((a, b) => {
        return a.players.length - b.players.length || a.score - b.score
    })
}
const sortTeams = (teams: Team[]): void => {
    teams.sort((a, b) => {
        return b.players.length - a.players.length || b.score - a.score
    })
}

export const femaleFilter = (p: Player) => p.gender === Gender.female
export const maleFilter = (p: Player) => p.gender === Gender.male
export const lowFilter = (limit: number) => (p: Player) => p.score <= limit
export const highFilter = (limit: number) => (p: Player) => p.score > limit

export const teamsFilter = (filterFunc: (p: Player) => {}) => {
    return (attendees: Player[], numTeams: number, prime: number = DefaultPrime): Team[] => {
        return teams(attendees.filter(filterFunc), numTeams, prime)
    }
}

export const playersAVG = (players: Player[]) => {
    if (players.length === 0) {
        return 0
    }
    const avg = players.reduce((acc, p) => acc + p.score, 0) / players.length
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
