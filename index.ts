export interface Player {
    name: string;
    score: number;
    positions: string[];
}

export interface Position {
    pos: string,
    num: number
}

export class Team {
    private _count: number = 0;
    private _score: number = 0;
    private _players: Player[] = [];
    private _playersByPos = new Map<string, Player[]>();

    players(): Map<string, Player[]> {
        return this._playersByPos
    }

    addPlayer(pos: string, player: Player) {
        const players = this._playersByPos.get(pos) || []
        players.push(player)
        this._playersByPos.set(pos, players)

        this._players.push(player)
        this._players.sort((a, b): number => {
            return a.score - b.score
        })

        this._score += player.score
        this._count++
    }

    avgScore(): number {
        return this._score / this._count
    }

    medScore(): number {
        const medIdx = Math.floor(this._count / 2)
        return this._players[medIdx].score
    }

    count(): number {
        return this._count
    }
}

const teamsCompare = (a: Team, b: Team): number => {
    const diffByCount = a.count() - b.count()
    if (diffByCount !== 0) {
        return diffByCount
    }
    const diffByAvg = a.avgScore() - b.avgScore()
    if (diffByAvg !== 0) {
        return diffByAvg
    }
    const diffByMed = a.medScore() - b.medScore()
    if (diffByMed !== 0) {
        return diffByMed
    }
    return 0
}

const fixDefinition = (definition: Position[], players: Player[]): (Position[]) => {
    players.forEach(pl => {
        pl.positions.forEach(po => {
            const availablePos = definition.map(d => d.pos)
            if (availablePos.includes(po)) {
                return
            }
            definition.push({pos: po, num: 1})
        })
    })
    return definition
}

export const fillTeams = (teams: Team[], players: Player[], definition: Position[]): (Team[]) => {
    let availablePlayers = players.map(p => p).sort((a, b): number => {
        return b.score - a.score
    })

    const teamDef = fixDefinition(definition, players)

    while (availablePlayers) {
        for (const def of teamDef) {
            for (let i = 0; i < def.num; i++) {
                for (const team of teams) {
                    if (availablePlayers.length === 0) {
                        return teams
                    }
                    const playerIdx = availablePlayers.findIndex(p => {
                        return p.positions.includes(def.pos)
                    })
                    const p = availablePlayers.splice(playerIdx, 1).pop() as Player
                    team.addPlayer(def.pos, p)
                }
                teams.sort(teamsCompare)
            }
        }
        teamDef.reverse()
    }
    return teams
}
