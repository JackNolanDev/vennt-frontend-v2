# TODO list

### notes

- [ ] Make full page notes view
  - [ ] Need outline logic / better editor control buttons
  - [ ] On full page editor, should probably add a back button to take the user back to the last thing they were looking at too
  - [ ] Should make a pop out version that just lives on top of everything else that you can drag around / resize / hide / will reappear in the same place as before

### abilities

- [ ] Add basic 4 abilities to combat page
- [ ] Add support for Recovery Shock
- [ ] Add resting modal

### actions / reactions

- [ ] Go through abilities that give you extra actions / reactions and support them
- [ ] (maybe) move levels to process to stored entity instead of just locally, then the value can be manipulated by both the frontend & the backend


### DONE
- [x] actions_on_turn (default to 3) / reactions
- [x] add in_combat flag to entity
- [x] make adjust attrs check flag to only adjust actions / reactions when in combat
- [x] can change buttons on combat page depending on combat status (e.g. start round, start turn, end turn, end combat) when in combat. start combat, end scene, rest when out of combat (or something similar)
