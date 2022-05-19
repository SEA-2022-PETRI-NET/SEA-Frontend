

export interface PetriNet {
  id: number
}

export enum ArcType {
  INHIBITOR = 'INHIBITOR',
  REGULAR = 'REGULAR',
  RESET = 'RESET'
}

export interface Arc {
  type: ArcType
  weight: number
}

export interface Transition {

}