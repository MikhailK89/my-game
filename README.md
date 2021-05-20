# My 2d platformer

## About
It's a 2d platformer implemented using *pure JavaScript* and *DOM API* (without *Canvas* and special libs).

At the moment this game has the following functionality:
1. The Player's physics
2. Obstacles and glitch areas handling
3. Collision handler for coins and player
4. Game over and finish areas (with simple animation)
5. The observer pattern for the global state control and game scrolling

## Available Scripts
1. `npm run serve` starts DevServer (`http://localhost:3000/`)
2. `npm run build` builds the app for production to the `dist` folder

**Note:** it is necessary to specify `publicPath: '/'` in `webpack.config.js` for the DevServer to work correctly. If you are planning to upload the project to a subdirectory of your site then change this property to `publicPath: './'` when building for production.

## Game engine logic
1. A character sprite is inside a rectangular block element
2. The coordinates of the game elements are calculated relative to the block `game` without taking into account the scrolling of the block (calculations only relative to the visible area)
3. `setInterval()` inside `src/components/game/gameManager.js` after clicking on the menu button calls the animation of characters and passes the state of motion keys (right, left and up)
4. Each call of the `hero.animate()` method checks if a character is on the ground
5. A character has *three* points at the base to check the ground and *seven* points to check obstacles in the default case (different characters may have their own set of obstacle points). If a character is on the ground then alignment to the ground level occurs
6. Before moving a character checks for an obstacle at the next coordinate according to its step (vertical or horizontal). If an obstacle is in the path of movement then a character shortens its step in order to get as close as possible to an obstacle
7. The folder `src/shared` contains general functions for working with *dom* elements, coordinates, alignment, obstacle check and ground check. The animation of movements is implemented at the level of character logic (see `src/components/heroes`). The folder `src/components/game` contains the game control interface. The dynamic game menu is implemented in `src/components/menu.js`
8. The game components communicate with each other using a single state (see `src/store`). The components may change the global state without notifying each other (in such case the second parameter of the `store.emit(action, withNotify)` method takes on the value `false`)
9. The background of the game is generated from the array (see `src/settings/worldSettings.js`). Each element of the array converted to the `div` element with the corresponding class
10. The block with the game has a fixed size of 1200 x 600 pixels. Also this block has scrolling along both axes

## Links

### The player's sprite is taken from:
https://freepngimg.com/png/83123-computer-sprite-figure-character-fictional-2d-animation
