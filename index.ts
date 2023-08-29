let hash = require('object-hash')

export enum Gender {
    male = 'male',
    female = 'female'
}

export interface Player {
    score: number
    positions: string[]
    gender: Gender
    taken?: boolean
}

const playerHash = (p: Player): number => parseInt(hash.MD5(p), 16)
const asc = (a: Player, b: Player): number => a.score - b.score || playerHash(a) - playerHash(b)

export interface TeamInt {
    name?: string
    score: number
    players: Player[]

    push(...players: Player[]): void;
}

export class Team implements TeamInt {
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
}

export const teams = (players: Player[], requiredTeams: number): TeamInt[] => {
    const result = new Array<TeamInt>(requiredTeams)
    for (let i = 0; i < requiredTeams; i++) {
        result[i] = new Team()
    }

    return fillTeams(result, players)
}

export const fillTeamsWithPositions = (
    teams: TeamInt[],
    teamDefinition: { [pos: string]: number },
    players: Player[]
): TeamInt[] => {
    if (teams.length === 0) return []
    if (players.length === 0) return teams

    const structuredTeams: TeamInt[] = [...teams]
    const positions = {...teamDefinition}
    const candidates = players.map(p => p)

    // Prioritize the teams based on the positions
    for (const pos in positions) {
        for (let requirePlayers = positions[pos]; requirePlayers > 0; requirePlayers--) {
            sortTeamsAsc(structuredTeams)
            for (const t in structuredTeams) {
                const posCovered = positions[pos] - countPosInTeam(structuredTeams[t], pos) <= 0
                if (posCovered) continue;

                const candidatesInPosition: Player[] = candidates
                    .filter(p => !p.taken)
                    .filter(p => p.positions?.includes(pos))
                    .sort((pa, pb) => pa.score - pb.score)

                if (candidatesInPosition.length === 0) break;
                const selected = candidatesInPosition.pop() as Player
                selected.taken = true
                structuredTeams[t].push(selected)
            }
        }
    }

    // Fill the teams with the remaining candidates
    const result = fillTeams(
        structuredTeams,
        candidates.filter(c => !c.taken)
    )

    // Remove player.taken property
    return result.map(t => {
        return {
            ...t, players: t.players.map(p => {
                delete p.taken
                return p
            })
        }
    })
}

export const countPosInTeam = (team: TeamInt, pos: string): number => {
    return team.players.filter(p => p.positions.includes(pos)).length
}

export const fillTeams = (teams: TeamInt[], players: Player[]): TeamInt[] => {
    const result = teams.map(t => t)
    // Sort by position and descending by score
    const availablePlayers = players.map(p => p)
    availablePlayers.sort(asc)

    while (availablePlayers.length) {
        sortTeamsAsc(result)
        const p = availablePlayers.pop() as Player
        result[0].push(p)
    }

    return result
}

export const sortTeamsAsc = (teams: TeamInt[]): void => {
    teams.sort((a, b) => {
        return a.players.length - b.players.length || a.score - b.score
    })
}

export const femaleFilter = (p: Player) => p.gender === Gender.female
export const maleFilter = (p: Player) => p.gender === Gender.male
export const lowFilter = (limit: number) => (p: Player) => p.score <= limit
export const highFilter = (limit: number) => (p: Player) => p.score > limit

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
    copy.sort(asc)
    const midIdx = Math.floor(copy.length / 2)
    return Math.floor(copy[midIdx].score)
}
