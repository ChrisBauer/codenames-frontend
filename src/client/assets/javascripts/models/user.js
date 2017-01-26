/**
 * Created by chris on 1/3/17.
 */

import {Teams} from 'models/game';

export function createPlayerFromUser (user) {
  return {
    user: user,
    team: Teams.RED,
    role: "GIVER"
  }
}
