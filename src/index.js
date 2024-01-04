// TODO
// Comptabiliser le nombre de points des différents poissons dans les zones
// Calculer les scores des scans réalisés
// Eliminer les marges inutiles sur les bords et à la surface
// Améliorer l'algorithme d'évitement

import State from "./State";
import AI from "./AI";

const state = new State();
const ai = new AI();

while (true) {
  state.read();
  ai.nextMove(state);
}
