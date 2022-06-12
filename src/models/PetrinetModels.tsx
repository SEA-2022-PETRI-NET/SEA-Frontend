export interface PetriNet {
    id: number
    name: string
    arcs: Arc[]
    places: Place[]
    transitions: Transition[]
}

export enum ArcType {
    INHIBITOR = 'INHIBITOR',
    REGULAR = 'REGULAR',
    RESET = 'RESET',
}

export interface Arc {
    id: number
    sourceNode: number
    targetNode: number
    //type: ArcType
    //weight: number
}

export interface Place {
    id: number
    name: string
    placeId: number
    numberOfTokens?: number
    tokens?: Token[]
    position: Position
}

export interface Transition {
    id: number
    transitionId: number
    name: string
    position: Position
}

export interface Position {
    x: number
    y: number
}

export interface Token {
    id: number
}
