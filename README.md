# discover-2019-game
Hackshack game for Discover 2019 event.

## Getting Started
Install dependencies individually for frontend, game-client, and server folders.

```
cd frontend
yarn
```
```
cd game-client
yarn
```
```
cd server
yarn
```

## To run
frontend
```
cd frontend
yarn start
```
game-client
```
cd game-client
yarn start
```
server must have MongoDB running prior.
```
mongod
```

```
cd server
yarn-watch
```

## How to play

Gamepad controls(Nvidia Shield):

In Menus:
Joystick to select option
A - Confirm selection/If no option for selections, exit current screen

In Game:
Joystick for movement
A - Fire down
B - Fire right
X - Fire left
Y - Fire up

In Highscore Input:
Joystick to select characters
A - Confirm character selection
B - Delete/If there are no characters to delete, taken to cancel submission menu

Keyboard controls:

In Menus:
Arrow keys to select option
Enter - Confirm selection/If no option for selections, exit current screen

In Game:
WSAD for movement
Down arrow - Fire down
Right arrow - Fire right
Left arrow - Fire left
Up arrow - Fire up

In Highscore Input:
Arrow keys to select characters
Enter - Confirm character selection
Backspace/Delete - Delete a single character/If there are no characters to delete, taken to cancel submission menu